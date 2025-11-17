/**
 * Script para crear una colección NFT en testnet (Paseo/Westend) o Statemint/Statemine
 * 
 * Ejecutar: npx tsx scripts/create-nft-collection.ts
 * 
 * IMPORTANTE: 
 * - Para testnet: Necesitas obtener tokens del faucet (ver scripts/get-faucet-funds.md)
 * - Para mainnet: Necesitas tener fondos reales (DOT para Statemint, KSM para Statemine)
 */

import dotenv from 'dotenv';
import { initPolkadot, getSignerAccount, getApi, disconnectPolkadot } from '../src/config/polkadot';

dotenv.config();

async function createCollection() {
  try {
    console.log('📦 Creando colección NFT...\n');
    
    const api = await initPolkadot();
    const signer = getSignerAccount();
    
    if (!signer) {
      throw new Error('No hay cuenta configurada. Configura POLKADOT_ACCOUNT_MNEMONIC en .env');
    }
    
    // Obtener información de la cadena
    const chain = await api.rpc.system.chain();
    console.log(`🌐 Red: ${chain.toString()}\n`);
    console.log(`💼 Cuenta: ${signer.address}\n`);
    
    // Verificar balance
    const { data: balance } = await api.query.system.account(signer.address);
    const freeBalance = balance.free.toHuman();
    console.log(`💰 Balance disponible: ${freeBalance}\n`);
    
    // Verificar si uniques está disponible
    if (!api.tx.uniques) {
      console.error('❌ El pallet uniques no está disponible en esta red.');
      console.error('\n💡 Soluciones:');
      console.error('   1. Conecta a una red que soporte NFTs:');
      console.error('      - Statemint: wss://statemint-rpc.polkadot.io');
      console.error('      - Statemine: wss://statemine-rpc.polkadot.io');
      console.error('      - Westend: wss://westend-rpc.polkadot.io (si tiene pallet-uniques)');
      console.error('   2. O usa un nodo local de Substrate con pallet-nfts');
      throw new Error('Pallet uniques no disponible');
    }
    
    console.log('✅ Pallet uniques disponible\n');
    
    // Generar un ID único para la colección
    // IMPORTANTE: El ID debe ser un u32 (máximo 4,294,967,295)
    // Si no está definido en .env, generamos uno aleatorio dentro del rango válido
    let collectionId: string | number;
    if (process.env.NFT_COLLECTION_ID) {
      collectionId = process.env.NFT_COLLECTION_ID;
    } else {
      // Generar un número aleatorio entre 1000 y 4,000,000,000 para evitar conflictos
      // Usamos un timestamp truncado para tener un ID único pero dentro del rango u32
      const timestamp = Date.now();
      // Tomar solo los últimos dígitos que quepan en u32
      collectionId = timestamp % 4000000000; // Asegurar que sea menor a 4,294,967,295
      if (collectionId < 1000) collectionId += 1000; // Mínimo 1000 para evitar IDs muy pequeños
    }
    
    // Convertir a número para validar que esté en el rango correcto
    const collectionIdNum = typeof collectionId === 'string' ? parseInt(collectionId, 10) : collectionId;
    if (isNaN(collectionIdNum) || collectionIdNum < 0 || collectionIdNum > 4294967295) {
      throw new Error(
        `ID de colección inválido: ${collectionId}. ` +
        `Debe ser un número entre 0 y 4,294,967,295 (u32). ` +
        `Define NFT_COLLECTION_ID en tu .env con un número válido.`
      );
    }
    
    collectionId = collectionIdNum.toString();
    
    console.log(`🆔 ID de colección: ${collectionId}\n`);
    
    // Crear la colección
    // IMPORTANTE: Siempre pasamos signer.address como admin para asegurar que el usuario sea el admin
    // api.tx.uniques.create(collectionId, admin)
    // El segundo parámetro es el admin - siempre usamos signer.address
    console.log(`👤 Creando colección con admin: ${signer.address}\n`);
    
    const createTx = api.tx.uniques.create(
      collectionId,
      signer.address // admin - siempre la cuenta que crea la colección
    );
    
    // Configuración para testnet: fees mínimas
    const txOptions = {
      nonce: -1, // Auto-nonce
      tip: 0, // Sin tip adicional (fees mínimas)
    };
    
    console.log('📤 Enviando transacción...\n');

    // Wait for the tx to be included/finalized before returning so we don't disconnect early.
    await new Promise<void>((resolve, reject) => {
      let unsub: (() => void) | null = null;

      createTx.signAndSend(signer, txOptions, async ({ status, txHash, events }: any) => {
        try {
          if (events && events.length) {
            events.forEach(({ event }: any) => console.log(event.section, event.method, event.data.toString()));
          }

          if (status.isInBlock || status.isFinalized) {
            const blockHash = status.isInBlock ? status.asInBlock : status.asFinalized;
            console.log(`\n✅ Colección creada exitosamente!`);
            console.log(`📦 Collection ID: ${collectionId}`);
            console.log(`👤 Admin: ${signer.address}`);
            console.log(`🔗 Transaction Hash: ${txHash.toString()}`);
            console.log(`📊 Block: ${blockHash.toString()}`);
            console.log(`\n💡 Actualiza tu .env con:`);
            console.log(`   NFT_COLLECTION_ID=${collectionId}`);
            
            if (unsub) unsub();
            resolve();
          }
        } catch (err: any) {
          if (unsub) unsub();
          reject(err);
        }
      }).then((u: any) => { unsub = u; }).catch((error: any) => {
        console.error('\n❌ Error al crear colección:', error?.message || error);
        if ((error?.message || '').includes('InsufficientBalance')) {
          console.error('\n💡 Necesitas obtener tokens del faucet:');
          console.error('   Ver: scripts/get-faucet-funds.md');
        }
        reject(error);
      });
      });
      
      // Verificar que somos el admin DESPUÉS de crear la colección (antes de desconectar)
      console.log('\n🔍 Verificando que eres el admin de la colección...');
      try {
        // Esperar un poco para que la blockchain procese la transacción
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const collectionInfo = await api.query.uniques.class(collectionId);
        const infoHuman = collectionInfo.toHuman();
        
        if (infoHuman && typeof infoHuman === 'object' && infoHuman !== null) {
          const admin = (infoHuman as any).owner || (infoHuman as any).admin || null;
          
          if (admin) {
            try {
              // Normalizar direcciones para comparar (convertir ambas al mismo formato SS58)
              const { decodeAddress } = await import('@polkadot/util-crypto');
              const adminAddress = admin.toString();
              const signerAddress = signer.address;
              
              // Decodificar ambas direcciones a bytes y comparar
              const adminBytes = decodeAddress(adminAddress);
              const signerBytes = decodeAddress(signerAddress);
              
              // Comparar los bytes directamente (son la misma cuenta si los bytes coinciden)
              const isSameAddress = adminBytes.length === signerBytes.length &&
                  adminBytes.every((byte, index) => byte === signerBytes[index]);
              
              if (isSameAddress) {
                console.log(`✅ Confirmado: Eres el admin de la colección ${collectionId}`);
              } else {
                // Mostrar ambas direcciones en el mismo formato para debug
                const { encodeAddress } = await import('@polkadot/util-crypto');
                const adminNormalized = encodeAddress(adminBytes, 42);
                const signerNormalized = encodeAddress(signerBytes, 42);
                console.log(`⚠️ Las direcciones no coinciden:`);
                console.log(`   Admin en blockchain: ${adminAddress} (normalizado: ${adminNormalized})`);
                console.log(`   Tu dirección: ${signerAddress} (normalizado: ${signerNormalized})`);
                console.log(`   Esto puede ser un problema de formato SS58, pero los bytes son diferentes.`);
              }
            } catch (e) {
              console.warn(`⚠️ Error al comparar direcciones: ${e}`);
            }
          } else {
            console.warn(`⚠️ No se pudo determinar el admin de la colección`);
          }
        } else {
          console.warn(`⚠️ No se pudo obtener información de la colección`);
        }
      } catch (error: any) {
        if (error.message && error.message.includes('ERROR CRÍTICO')) {
          throw error;
        }
        console.warn(`⚠️ No se pudo verificar el admin: ${error.message || error}`);
        console.warn(`   (Pero la colección se creó correctamente según la transacción)`);
      }
      
    } catch (error: any) {
      console.error('\n❌ Error:', error?.message || error);
      process.exit(1);
    } finally {
      // Ensure we disconnect only after verification (the await above guarantees this)
      await disconnectPolkadot();
    }
}

createCollection();

