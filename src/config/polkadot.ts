import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

let api: ApiPromise | null = null;
let keyring: Keyring | null = null;
let signerAccount: KeyringPair | null = null;

/**
 * Inicializa la conexión con Polkadot
 */
export async function initPolkadot(): Promise<ApiPromise> {
  if (api) {
    return api;
  }

  // Usar la URL de conexión desde .env
  const wsUrl = process.env.POLKADOT_WS_URL || 'wss://asset-hub-paseo.dotters.network';
  console.log(`Conectando a Polkadot: ${wsUrl}`);

  // Provider con timeout
  const provider = new WsProvider(wsUrl, 5000);

  // Crear API
  api = await ApiPromise.create({
    provider,
    noInitWarn: true,
  });

  // Esperar a que esté listo con timeout
  try {
    await Promise.race([
      api.isReady,
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                `Timeout: No se pudo conectar a ${wsUrl} en 15 segundos. Prueba un endpoint alternativo.`
              )
            ),
          15000
        )
      ),
    ]);
  } catch (error: any) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\n💡 Endpoints alternativos:');
    console.error('   - Paseo: wss://rpc.paseo.polkadot.io');
    console.error('   - Westend: wss://westend-rpc.polkadot.io');
    console.error('   - Statemint: wss://statemint-rpc.polkadot.io');
    console.error('   - Statemint (dotters): wss://statemint-rpc.dotters.network');
    throw error;
  }

  // Inicializar keyring
  const accountType = process.env.POLKADOT_ACCOUNT_TYPE || 'sr25519';
  keyring = new Keyring({
    type: accountType,
    ss58Format: 42, // SS58 para testnets (Paseo/Westend)
  });

  // Cargar cuenta admin desde mnemonic (para operaciones de NFT)
  // Esta es la cuenta que administra la colección NFT compartida
  const adminMnemonic = process.env.NFT_ADMIN_MNEMONIC || 'gap onion furnace despair retire tip jeans code mother girl moon element';
  if (adminMnemonic) {
    signerAccount = keyring.addFromMnemonic(adminMnemonic);
    console.log(`✅ Cuenta admin cargada: ${signerAccount.address}`);
  } else {
    console.warn(
      '⚠️ No se encontró NFT_ADMIN_MNEMONIC en .env. No podrás firmar transacciones de NFT.'
    );
  }

  console.log('✅ Conectado a Polkadot exitosamente');
  return api;
}

/**
 * Obtiene la instancia de la API de Polkadot
 */
export function getApi(): ApiPromise {
  if (!api) {
    throw new Error('Polkadot API no inicializada. Llama a initPolkadot() primero.');
  }
  return api;
}

/**
 * Obtiene la cuenta firmante
 */
export function getSignerAccount(): KeyringPair {
  if (!signerAccount) {
    throw new Error(
      'No hay cuenta admin configurada para firmar transacciones. Define NFT_ADMIN_MNEMONIC en tu .env.'
    );
  }
  return signerAccount;
}

/**
 * Obtiene el keyring
 */
export function getKeyring(): Keyring {
  if (!keyring) {
    throw new Error('Keyring no inicializado. Llama a initPolkadot() primero.');
  }
  return keyring;
}

/**
 * Cierra la conexión con Polkadot
 */
export async function disconnectPolkadot(): Promise<void> {
  if (api) {
    await api.disconnect();
    api = null;
    keyring = null;
    signerAccount = null;
    console.log('🔌 Desconectado de Polkadot');
  }
}