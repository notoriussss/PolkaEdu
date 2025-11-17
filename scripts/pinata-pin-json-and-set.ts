import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

dotenv.config();

async function pinJsonToPinata(metadata: any) {
  const jwt = process.env.PINATA_JWT;
  const key = process.env.PINATA_KEY;
  const secret = process.env.PINATA_SECRET;

  // Prefer JWT if provided (recommended for scoped API keys). Fallback to key/secret.
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  } else if (key && secret) {
    headers['pinata_api_key'] = key;
    headers['pinata_secret_api_key'] = secret;
  } else {
    throw new Error('PINATA_JWT or PINATA_KEY+PINATA_SECRET not set in .env (Pinata credentials required)');
  }

  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: headers as any,
    body: JSON.stringify({ pinataContent: metadata })
  });

  if (!res.ok) {
    // Try to parse JSON body for more details
    let bodyText = '';
    try {
      const jsonErr = await res.json();
      bodyText = JSON.stringify(jsonErr);

      // Common case: restricted API key without pinning scopes
      if (res.status === 403 && jsonErr?.error?.reason === 'NO_SCOPES_FOUND') {
        throw new Error([
          `Pinata pinJSONToIPFS failed: ${res.status} ${res.statusText} - ${bodyText}`,
          '',
          'Pinata error NO_SCOPES_FOUND: the API key you are using does not include the required scopes to pin content.',
          'Fixes:',
          '  1) In the Pinata dashboard go to Settings → API Keys → Create New Key (or edit the key you use).',
          "  2) Give the key the 'Pinning' permissions (ability to pin JSON/files). Ensure create/read/delete pin permissions are enabled.",
          "  3) Prefer creating a scoped key and using the generated JWT (set it as PINATA_JWT in your .env).",
          '',
          'Quick test (JWT example):',
          '  curl -X POST https://api.pinata.cloud/pinning/pinJSONToIPFS \\',
          "    -H \"Content-Type: application/json\" \\\\",
          "    -H \"Authorization: Bearer <YOUR_JWT>\" \\\\",
          "    -d '{\"pinataContent\":{\"name\":\"test\"}}'",
          '',
          'If you must use API key + secret, ensure the key is a master key or has Pinning scope; note: Pinata is moving toward scoped JWT usage.'
        ].join('\n'));
      }
    } catch (e) {
      // If parsing failed, fallback to text
      try { bodyText = await res.text(); } catch { bodyText = '<unavailable>'; }
    }

    throw new Error(`Pinata pinJSONToIPFS failed: ${res.status} ${res.statusText} - ${bodyText}`);
  }

  const json = await res.json();
  if (!json.IpfsHash) {
    throw new Error('Pinata response missing IpfsHash: ' + JSON.stringify(json));
  }
  return json.IpfsHash;
}

async function setOnChainMetadata(cid: string, collection: string, token: string) {
  const ws = process.env.POLKADOT_WS_URL;
  if (!ws) throw new Error('POLKADOT_WS_URL not set in .env');
  const api = await ApiPromise.create({ provider: new WsProvider(ws) });

  const keyring = new Keyring({ type: (process.env.POLKADOT_ACCOUNT_TYPE as any) || 'sr25519' });
  const mnemonic = process.env.POLKADOT_ACCOUNT_MNEMONIC;
  if (!mnemonic) throw new Error('POLKADOT_ACCOUNT_MNEMONIC not set in .env');
  const signer = keyring.addFromMnemonic(mnemonic);

  const metadataUri = `ipfs://${cid}`;
  console.log('Setting metadata on-chain:', metadataUri, 'collection', collection, 'token', token);

  const tx = api.tx.uniques.setMetadata(collection, token, metadataUri, 0);

  await new Promise<void>((resolve, reject) => {
    tx.signAndSend(signer, (result: any) => {
      const { status, events, txHash } = result;
      if (events && events.length) {
        events.forEach(({ event }: any) => console.log(event.section, event.method, event.data.toString()));
      }
      if (status.isInBlock || status.isFinalized) {
        console.log('setMetadata txHash:', txHash.toString());
        resolve();
      }
      if (status.isDropped || status.isInvalid) {
        reject(new Error('Transaction failed with status: ' + status.type));
      }
    }).catch(reject);
  });

  await api.disconnect();
}

async function main() {
  try {
    const mdPath = path.join(process.cwd(), 'metadata.json');
    if (!fs.existsSync(mdPath)) throw new Error('metadata.json not found in project root');
    const raw = fs.readFileSync(mdPath, 'utf8');
    const metadata = JSON.parse(raw);

    console.log('Pinning metadata.json to Pinata...');
    const cid = await pinJsonToPinata(metadata);
    console.log('Pinned CID:', cid);

    const collection = process.env.NFT_COLLECTION_ID || '1';
    const token = process.env.NFT_TOKEN_ID || '1';

    console.log('Setting on-chain metadata...');
    await setOnChainMetadata(cid, collection, token);
    console.log('Done');
  } catch (err: any) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
