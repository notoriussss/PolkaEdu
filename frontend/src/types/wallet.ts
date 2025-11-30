/**
 * Tipos relacionados con wallets
 */

export interface WalletAccount {
  address: string;
  name?: string;
  source: string; // 'polkadot-js' | 'subwallet-js'
}

export interface WalletState {
  isConnected: boolean;
  account: WalletAccount | null;
  accounts: WalletAccount[];
  error: string | null;
}

