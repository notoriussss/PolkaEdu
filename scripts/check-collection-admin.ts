import dotenv from 'dotenv';
import { initPolkadot, getApi, getSignerAccount, disconnectPolkadot } from '../src/config/polkadot';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

dotenv.config();

async function checkCollectionAdmin() {
  try {
    console.log('🔍 Verificando información de la colección...\n');
    
    const api = await initPolkadot();
    const signer = getSignerAccount();
    
    if (!signer) {
      throw new Error('No hay cuenta configurada. Configura POLKADOT_ACCOUNT_MNEMONIC en .env');
    }
    
    const collectionId = process.env.NFT_COLLECTION_ID || '1';
    console.log(`📦 Collection ID: ${collectionId}\n`);
    console.log(`💼 Tu cuenta: ${signer.address}\n`);
    
    // Verificar si la colección existe
    if (api.query.uniques && api.query.uniques.class) {
      try {
        const collectionInfo = await api.query.uniques.class(collectionId);
        const infoHuman = collectionInfo.toHuman();
        
        if (infoHuman && typeof infoHuman === 'object') {
          const admin = (infoHuman as any).owner || (infoHuman as any).admin || null;
          
          console.log('✅ Colección existe!\n');
          console.log('📋 Información de la colección:');
          console.log(`   Admin/Owner: ${admin ? admin.toString() : 'No encontrado'}`);
          
          // Comparar direcciones usando bytes (para manejar diferentes formatos SS58)
          let isAdmin = false;
          if (admin) {
            try {
              const adminAddress = admin.toString();
              const signerAddress = signer.address;
              
              // Decodificar ambas direcciones a bytes y comparar
              const adminBytes = decodeAddress(adminAddress);
              const signerBytes = decodeAddress(signerAddress);
              
              // Comparar los bytes directamente (son la misma cuenta si los bytes coinciden)
              isAdmin = adminBytes.length === signerBytes.length &&
                adminBytes.every((byte, index) => byte === signerBytes[index]);
              
              if (isAdmin) {
                console.log(`   Es tu cuenta: ✅ SÍ (misma cuenta, diferentes formatos SS58)\n`);
                console.log('✅ Tú eres el admin de esta colección. Puedes acuñar NFTs.\n');
              } else {
                // Mostrar ambas direcciones normalizadas para debug
                const adminNormalized = encodeAddress(adminBytes, 42);
                const signerNormalized = encodeAddress(signerBytes, 42);
                console.log(`   Es tu cuenta: ❌ NO\n`);
                console.log(`   Admin normalizado (SS58-42): ${adminNormalized}`);
                console.log(`   Tu cuenta normalizada (SS58-42): ${signerNormalized}\n`);
                
                console.log('⚠️ ADVERTENCIA:');
                console.log(`   La colección ${collectionId} fue creada por otra cuenta.`);
                console.log(`   Necesitas ser el admin para acuñar NFTs.\n`);
                console.log('💡 Soluciones:');
                console.log('   1. Crea una nueva colección con un ID diferente');
                console.log('   2. O usa la colección que tú creaste');
                console.log('   3. O pide al admin que te dé permisos\n');
              }
            } catch (e) {
              console.log(`   Es tu cuenta: ⚠️ Error al comparar: ${e}\n`);
              console.log('⚠️ No se pudo verificar si eres el admin debido a un error al comparar direcciones.\n');
            }
          } else {
            console.log(`   Es tu cuenta: ⚠️ No se pudo determinar el admin\n`);
          }
        } else {
          console.log(`❌ La colección ${collectionId} NO existe.\n`);
          console.log('💡 Crea la colección primero con:');
          console.log('   npx tsx scripts/create-nft-collection.ts\n');
        }
      } catch (error: any) {
        console.error('❌ Error al consultar la colección:', error.message);
        console.log('\n💡 Posibles causas:');
        console.log('   - El pallet uniques no está disponible en esta red');
        console.log('   - El ID de colección es inválido');
      }
    } else {
      console.log('❌ El pallet uniques no está disponible en esta red.\n');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await disconnectPolkadot();
  }
}

checkCollectionAdmin();

