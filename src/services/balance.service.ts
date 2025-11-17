import { getApi, getSignerAccount } from '../config/polkadot';
import { BN, formatBalance as formatBalanceUtil } from '@polkadot/util';

export interface BalanceInfo {
  free: string;        // Saldo disponible (en DOT)
  reserved: string;     // Saldo reservado (en DOT)
  frozen: string;       // Saldo congelado (en DOT)
  total: string;        // Saldo total (en DOT)
  address: string;      // Dirección de la cuenta
}

/**
 * Servicio para consultar balances de cuentas en Polkadot
 */
export class BalanceService {
  /**
   * Obtiene el saldo de una cuenta específica
   */
  async getBalance(address: string): Promise<BalanceInfo> {
    const api = getApi();
    
    // Consultar el balance de la cuenta
    const accountInfo = await api.query.system.account(address);
    
    // Extraer información del balance
    const data = accountInfo.data;
    
    // Convertir a DOT (Polkadot tiene 10 decimales)
    const decimals = api.registry.chainDecimals[0] || 10;
    const divisor = new BN(10).pow(new BN(decimals));
    
    const free = data.free.toString();
    const reserved = data.reserved.toString();
    const frozen = data.frozen.toString();
    const total = data.free.add(data.reserved).toString();
    
    return {
      free: this.formatBalance(free, decimals),
      reserved: this.formatBalance(reserved, decimals),
      frozen: this.formatBalance(frozen, decimals),
      total: this.formatBalance(total, decimals),
      address: address
    };
  }

  /**
   * Obtiene el saldo de la cuenta configurada (la que firma transacciones)
   */
  async getMyBalance(): Promise<BalanceInfo> {
    const signer = getSignerAccount();
    
    if (!signer) {
      throw new Error('No hay cuenta configurada. Configura POLKADOT_ACCOUNT_MNEMONIC en .env');
    }
    
    return this.getBalance(signer.address);
  }

  /**
   * Formatea el balance de planck (unidad más pequeña) a DOT
   */
  private formatBalance(amount: string, decimals: number): string {
    // Usar la función de formateo de Polkadot.js
    const formatted = formatBalanceUtil(amount, {
      decimals: decimals,
      withSi: false, // Sin unidad (DOT)
      withUnit: false
    });
    
    // Extraer solo el número (sin espacios)
    return formatted.replace(/,/g, '').trim();
  }

  /**
   * Obtiene información adicional de la cuenta
   */
  async getAccountInfo(address: string) {
    const api = getApi();
    const accountInfo = await api.query.system.account(address);
    
    return {
      nonce: accountInfo.nonce.toString(),
      consumers: accountInfo.consumers.toString(),
      providers: accountInfo.providers.toString(),
      sufficients: accountInfo.sufficients.toString(),
      data: {
        free: accountInfo.data.free.toString(),
        reserved: accountInfo.data.reserved.toString(),
        frozen: accountInfo.data.frozen.toString(),
      }
    };
  }
}

