/**
 * Script rápido para verificar conexión a Statemint y pallet uniques
 */

import dotenv from 'dotenv';
import { ApiPromise, WsProvider } from '@polkadot/api';

dotenv.config();

async function testStatemint() {
  const wsUrl = 'wss://statemint-rpc.polkadot.io';
  console.log(`Conectando a Statemint: ${wsUrl}`);
  
  const provider = new WsProvider(wsUrl, 5000); // timeout de 5 segundos
  const api = await ApiPromise.create({ provider });
  
  const [chain] = await Promise.all([api.rpc.system.chain()]);
  console.log(`✅ Conectado a: ${chain.toString()}\n`);
  
  console.log('Verificando pallet uniques...');
  if (api.tx.uniques) {
    console.log('✅ api.tx.uniques está disponible!');
    console.log(`   Métodos: ${Object.keys(api.tx.uniques).slice(0, 10).join(', ')}...`);
  } else {
    console.log('❌ api.tx.uniques NO está disponible');
  }
  
  await api.disconnect();
  process.exit(0);
}

testStatemint().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

