/**
 * Script para verificar qué pallets están disponibles en la red
 */

import dotenv from 'dotenv';
import { initPolkadot, getApi, disconnectPolkadot } from '../src/config/polkadot';

dotenv.config();

async function checkPallets() {
  try {
    console.log('🔍 Verificando pallets disponibles...\n');
    
    const api = await initPolkadot();
    const [chain] = await Promise.all([api.rpc.system.chain()]);
    console.log(`📡 Conectado a: ${chain.toString()}\n`);

    // Verificar pallets de transacciones
    console.log('📦 Pallets disponibles en api.tx:\n');
    const txPallets = Object.keys(api.tx).sort();
    txPallets.forEach(pallet => {
      console.log(`  ✅ ${pallet}`);
    });

    console.log('\n🔍 Verificando específicamente pallets de NFTs:\n');
    
    if (api.tx.uniques) {
      console.log('  ✅ api.tx.uniques está disponible');
      console.log(`     Métodos: ${Object.keys(api.tx.uniques).join(', ')}\n`);
    } else {
      console.log('  ❌ api.tx.uniques NO está disponible\n');
    }

    if (api.tx.nfts) {
      console.log('  ✅ api.tx.nfts está disponible');
      console.log(`     Métodos: ${Object.keys(api.tx.nfts).join(', ')}\n`);
    } else {
      console.log('  ❌ api.tx.nfts NO está disponible\n');
    }

    // Verificar queries
    console.log('📦 Pallets disponibles en api.query:\n');
    const queryPallets = Object.keys(api.query).sort();
    queryPallets.forEach(pallet => {
      console.log(`  ✅ ${pallet}`);
    });

    console.log('\n🔍 Verificando queries de NFTs:\n');
    
    if (api.query.uniques) {
      console.log('  ✅ api.query.uniques está disponible');
      console.log(`     Métodos: ${Object.keys(api.query.uniques).join(', ')}\n`);
    } else {
      console.log('  ❌ api.query.uniques NO está disponible\n');
    }

    if (api.query.nfts) {
      console.log('  ✅ api.query.nfts está disponible');
      console.log(`     Métodos: ${Object.keys(api.query.nfts).join(', ')}\n`);
    } else {
      console.log('  ❌ api.query.nfts NO está disponible\n');
    }

    // Verificar metadata
    console.log('📋 Metadata de la cadena:\n');
    const metadata = api.runtimeMetadata;
    console.log(`  Versión: ${metadata.version}`);
    // Evitar forzar conversión a V14 (puede fallar en algunas cadenas con metadata más nueva)
    let modulesCount: string | number = 'N/A';
    try {
      const mdJson: any = metadata.toJSON();
      // Intentar varias rutas comunes al serializar metadata
      modulesCount = mdJson?.metadata?.v14?.modules?.length ?? mdJson?.modules?.length ?? 'N/A';
    } catch (err) {
      modulesCount = 'N/A';
    }
    console.log(`  Módulos: ${modulesCount}\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await disconnectPolkadot();
  }
}

checkPallets();

