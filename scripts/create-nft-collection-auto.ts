/**
 * Script para crear una colección NFT con detección automática del pallet disponible
 * 
 * Ejecutar: npx tsx scripts/create-nft-collection-auto.ts
 * 
 * Este script intenta usar el mejor método disponible:
 * 1. Primero intenta pallet-nfts (más moderno)
 * 2. Si no está disponible, usa pallet-uniques
 * 3. Si ninguno está disponible, muestra alternativas
 */

import dotenv from 'dotenv';
import { initPolkadot, getSignerAccount, disconnectPolkadot } from '../src/config/polkadot';

dotenv.config();

async function createCollectionAuto() {
  try {
    console.log('🔍 Creando colección NFT con detección automática...\n');
    
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
    
    // IMPORTANTE: El ID debe ser un u32 (máximo 4,294,967,295)
    let collectionId: string | number;
    if (process.env.NFT_COLLECTION_ID) {
      collectionId = process.env.NFT_COLLECTION_ID;
    } else {
      // Generar un número aleatorio dentro del rango u32
      const timestamp = Date.now();
      collectionId = timestamp % 4000000000;
      if (collectionId < 1000) collectionId += 1000;
    }
    
    const collectionIdNum = typeof collectionId === 'string' ? parseInt(collectionId, 10) : collectionId;
    if (isNaN(collectionIdNum) || collectionIdNum < 0 || collectionIdNum > 4294967295) {
      throw new Error(
        `ID de colección inválido: ${collectionId}. Debe ser un número entre 0 y 4,294,967,295 (u32).`
      );
    }
    
    collectionId = collectionIdNum.toString();
    const txOptions = {
      nonce: -1,
      tip: 0,
    };
    
    let createTx: any = null;
    let method = '';
    
    // Intentar pallet-nfts primero (más moderno)
    if (api.tx.nfts) {
      console.log('✅ Detectado: pallet-nfts (método moderno)\n');
      method = 'nfts';

      // Construir una configuración por defecto puede fallar si no coincide exactamente
      // con el tipo esperado por la runtime (SCALE). Intentamos crear la tx y si
      // falla por problemas de encoding, haremos fallback a `uniques`.
      const collectionConfig = {
        // Intencionalmente vacío - muchas runtimes esperan fields específicos.
        // La forma correcta es usar `api.createType('<TypeName>', value)` con el
        // tipo exacto desde la metadata. Por simplicidad aquí intentamos y si
        // falla, usamos `uniques` como respaldo.
      };

      try {
        createTx = api.tx.nfts.create(
          signer.address,
          collectionConfig
        );
      } catch (err: any) {
        console.warn('⚠️  Falló api.tx.nfts.create() al construir la transacción:', err.message || err);
        console.warn('   Intentando fallback a pallet-uniques...');
        // Marcar para fallback
        createTx = null as any;
        method = '';
      }
    }
    // Si aún no logramos construir la tx para nfts, intentar uniques
    if (!createTx) {
      if (api.tx.uniques) {
        console.log('✅ Detectado: pallet-uniques (método estándar)\n');
        method = 'uniques';
        // IMPORTANTE: Siempre pasamos signer.address como admin
        console.log(`👤 Creando colección con admin: ${signer.address}\n`);
        createTx = api.tx.uniques.create(
          collectionId,
          signer.address // admin - siempre la cuenta que crea la colección
        );
      }
    }

    // Si ninguno está disponible o no se pudo construir la tx
    if (!createTx) {
      console.error('❌ No se encontró ningún pallet de NFTs disponible o no se pudo construir la transacción.\n');
      console.error('💡 Opciones:');
      console.error('   1. Conecta a Statemint: wss://statemint-rpc.polkadot.io');
      console.error('   2. Conecta a Statemine: wss://statemine-rpc.polkadot.io');
      console.error('   3. Usa un nodo local de Substrate con pallet-nfts');
      console.error('   4. Usa Polkadot.js Apps para crear la colección manualmente');
      throw new Error('Ningún pallet de NFTs disponible');
    }
    
    console.log(`📤 Creando colección usando ${method}...\n`);
    
    return new Promise<void>((resolve, reject) => {
      createTx.signAndSend(signer, txOptions, ({ status, txHash, events }: any) => {
        if (status.isInBlock || status.isFinalized) {
          const blockHash = status.isInBlock ? status.asInBlock : status.asFinalized;
          
          console.log(`\n✅ Colección creada exitosamente usando ${method}!`);
          
          if (method === 'uniques') {
            console.log(`📦 Collection ID: ${collectionId}`);
            console.log(`\n💡 Actualiza tu .env con:`);
            console.log(`   NFT_COLLECTION_ID=${collectionId}`);
          } else if (method === 'nfts') {
            // Intentar extraer Collection ID de eventos
            let extractedId = null;
            if (events) {
              events.forEach(({ event }: any) => {
                if (event.section === 'nfts' && event.method === 'Created') {
                  extractedId = event.data[0]?.toString();
                }
              });
            }
            
            if (extractedId) {
              console.log(`📦 Collection ID: ${extractedId}`);
              console.log(`\n💡 Actualiza tu .env con:`);
              console.log(`   NFT_COLLECTION_ID=${extractedId}`);
            } else {
              console.log(`\n⚠️  Revisa los eventos de la transacción para obtener el Collection ID`);
            }
          }
          
          console.log(`🔗 Transaction Hash: ${txHash.toString()}`);
          console.log(`📊 Block: ${blockHash.toString()}`);
          resolve();
        }
      }).catch((error: any) => {
        console.error('\n❌ Error al crear colección:', error.message);
        if (error.message.includes('InsufficientBalance')) {
          console.error('\n💡 Necesitas obtener tokens del faucet:');
          console.error('   Ver: scripts/get-faucet-funds.md');
        }
        reject(error);
      });
    });
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await disconnectPolkadot();
  }
}

createCollectionAuto();

