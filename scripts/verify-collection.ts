import dotenv from 'dotenv';
import { ApiPromise, WsProvider } from '@polkadot/api';

dotenv.config();

async function main() {
  let ws = process.env.POLKADOT_WS_URL as string | undefined;
  if (!ws) {
    console.error('POLKADOT_WS_URL not set in .env');
    process.exit(1);
  }
  // sanitize surrounding quotes and whitespace
  ws = ws.trim().replace(/^['"]|['"]$/g, '');
  if (!ws.startsWith('ws://') && !ws.startsWith('wss://')) {
    console.error("POLKADOT_WS_URL must start with 'ws://' or 'wss://' after sanitization. Got:", ws);
    process.exit(1);
  }
  const collection = process.env.NFT_COLLECTION_ID || '4';
  const tokenIdsEnv = process.env.NFT_TOKEN_IDS || '1,2';
  const tokenIds = tokenIdsEnv.split(',').map(s => s.trim()).filter(Boolean);

  const api = await ApiPromise.create({ provider: new WsProvider(ws) });
  console.log('Connected to', ws);

  console.log('Available uniques queries:', Object.keys(api.query.uniques || {}));

  try {
    const cls = await api.query.uniques.class(collection);
    console.log('class.toHuman():', cls?.toHuman ? cls.toHuman() : cls?.toString());

    for (const id of tokenIds) {
      const meta = await api.query.uniques.instanceMetadataOf(collection, id);
      console.log(`instanceMetadataOf(${collection}, ${id}):`, meta?.toHuman ? meta.toHuman() : meta?.toString());

      // Try common owner/account storage names
      if (api.query.uniques['owner']) {
        const owner = await api.query.uniques.owner(collection, id);
        console.log(`owner(${collection}, ${id}):`, owner?.toHuman ? owner.toHuman() : owner?.toString());
      } else if (api.query.uniques['account']) {
        const owner = await api.query.uniques.account(collection, id);
        console.log(`account(${collection}, ${id}):`, owner?.toHuman ? owner.toHuman() : owner?.toString());
      } else {
        console.log('No owner/account query available for this uniques runtime.');
      }
    }
  } catch (err: any) {
    console.error('Error querying chain:', err?.message || err);
    process.exit(1);
  } finally {
    await api.disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
