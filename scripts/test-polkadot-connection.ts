/**
 * Script de prueba para verificar la conexión con Polkadot
 * 
 * Ejecutar con: npx tsx scripts/test-polkadot-connection.ts
 */

import dotenv from 'dotenv';
import { initPolkadot, getApi, disconnectPolkadot } from '../src/config/polkadot';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔌 Conectando a Polkadot...');
    const api = await initPolkadot();

    // Obtener información de la cadena
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);

    console.log(`\n✅ Conexión exitosa!`);
    console.log(`📡 Chain: ${chain.toString()}`);
    console.log(`🖥️  Node: ${nodeName.toString()}`);
    console.log(`📦 Version: ${nodeVersion.toString()}`);

    // Obtener información del bloque actual
    const lastHeader = await api.rpc.chain.getHeader();
    console.log(`\n📊 Último bloque: #${lastHeader.number.toString()}`);

    // Verificar si el pallet uniques está disponible
    try {
      const uniquesPallet = api.tx.uniques;
      console.log(`\n✅ Pallet 'uniques' disponible`);
    } catch (error) {
      console.log(`\n⚠️  Pallet 'uniques' no disponible en esta cadena`);
      console.log(`   Puede que necesites usar otro pallet o una parachain diferente`);
    }

    // Verificar cuenta firmante
    const signer = getApi();
    console.log(`\n🔑 Verificando cuenta...`);
    
    const mnemonic = process.env.POLKADOT_ACCOUNT_MNEMONIC;
    if (mnemonic) {
      console.log(`✅ Mnemonic configurado`);
    } else {
      console.log(`⚠️  No hay mnemonic configurado en .env`);
    }

    console.log(`\n✨ Prueba completada exitosamente!`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await disconnectPolkadot();
    process.exit(0);
  }
}

testConnection();

