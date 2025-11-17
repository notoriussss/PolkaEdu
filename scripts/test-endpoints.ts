/**
 * Script para probar diferentes endpoints y encontrar uno que funcione
 */

import { ApiPromise, WsProvider } from '@polkadot/api';

const endpoints = [
  { name: 'Paseo Testnet', url: 'wss://rpc.paseo.polkadot.io' },
  { name: 'Westend Testnet', url: 'wss://westend-rpc.polkadot.io' },
  { name: 'Statemint (Oficial)', url: 'wss://statemint-rpc.polkadot.io' },
  { name: 'Statemint (Dotters)', url: 'wss://statemint-rpc.dotters.network' },
  { name: 'Statemint (Alternativo)', url: 'wss://rpc-statemint.polkadot.io' },
  { name: 'Polkadot Mainnet', url: 'wss://rpc.polkadot.io' },
];

async function testEndpoint(name: string, url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log(`  ❌ ${name}: Timeout (no responde en 10s)`);
      resolve(false);
    }, 10000);

    const provider = new WsProvider(url, 5000);
    ApiPromise.create({ provider, noInitWarn: true })
      .then(async (api) => {
        try {
          await Promise.race([
            api.isReady,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
          ]);
          
          const [chain, lastHeader] = await Promise.all([
            api.rpc.system.chain(),
            api.rpc.chain.getHeader()
          ]);
          const hasUniques = !!api.tx.uniques;
          
          clearTimeout(timeout);
          console.log(`  ✅ ${name}: Conectado a ${chain.toString()}`);
          console.log(`     📊 Último bloque: #${lastHeader.number.toString()}`);
          console.log(`     🎨 Pallet uniques: ${hasUniques ? '✅ Disponible' : '❌ No disponible'}`);
          console.log(`     🔗 URL: ${url}`);
          
          await api.disconnect();
          resolve(true);
        } catch (error: any) {
          clearTimeout(timeout);
          console.log(`  ❌ ${name}: ${error.message}`);
          resolve(false);
        }
      })
      .catch((error: any) => {
        clearTimeout(timeout);
        console.log(`  ❌ ${name}: ${error.message}`);
        resolve(false);
      });
  });
}

async function testAllEndpoints() {
  console.log('🔍 Probando endpoints de Polkadot (conexión REAL a la blockchain)...\n');
  console.log('⚠️  Esto hace conexiones WebSocket reales a nodos RPC de Polkadot\n');
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.name, endpoint.url);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2s entre pruebas
  }
  
  console.log('\n✅ Pruebas completadas');
  process.exit(0);
}

testAllEndpoints().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

