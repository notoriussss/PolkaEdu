/**
 * Script para verificar el saldo de DOT de tu cuenta
 * 
 * Ejecutar: npx tsx scripts/check-balance.ts
 */

import dotenv from 'dotenv';
import { initPolkadot, disconnectPolkadot } from '../src/config/polkadot';
import { BalanceService } from '../src/services/balance.service';

dotenv.config();

async function checkBalance() {
  try {
    console.log('💰 Consultando saldo de DOT...\n');
    
    await initPolkadot();
    const balanceService = new BalanceService();
    
    const balance = await balanceService.getMyBalance();
    
    console.log('📊 Saldo de tu cuenta:');
    console.log(`   Dirección: ${balance.address}`);
    console.log(`   💵 Disponible: ${balance.free} DOT`);
    console.log(`   🔒 Reservado: ${balance.reserved} DOT`);
    console.log(`   ❄️  Congelado: ${balance.frozen} DOT`);
    console.log(`   📈 Total: ${balance.total} DOT\n`);
    
    // Advertencia si el saldo es muy bajo
    const totalBN = parseFloat(balance.total);
    if (totalBN < 0.1) {
      console.log('⚠️  Advertencia: Tu saldo es muy bajo.');
      console.log('   Necesitas DOT para pagar las fees de transacción.\n');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await disconnectPolkadot();
  }
}

checkBalance();

