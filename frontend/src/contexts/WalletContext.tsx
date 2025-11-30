/**
 * Contexto para compartir el estado de la wallet entre componentes
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WalletAccount, WalletState } from '@/src/types/wallet';
import { userService } from '@/src/services/user.service';

// Declarar tipos para window.injectedWeb3
declare global {
  interface Window {
    injectedWeb3?: {
      'polkadot-js'?: {
        enable: (origin: string) => Promise<{
          accounts: {
            get: () => Promise<WalletAccount[]>;
          };
          signer: any;
        }>;
      };
      'subwallet-js'?: {
        enable: (origin: string) => Promise<{
          accounts: {
            get: () => Promise<WalletAccount[]>;
          };
          signer: any;
        }>;
      };
    };
  }
}

const APP_NAME = 'PolkaEdu';

interface WalletContextType extends WalletState {
  connectPolkadotJs: () => Promise<WalletAccount>;
  connectSubWallet: () => Promise<WalletAccount>;
  disconnect: () => void;
  selectAccount: (account: WalletAccount) => void;
  isPolkadotJsAvailable: () => boolean;
  isSubWalletAvailable: () => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    account: null,
    accounts: [],
    error: null,
  });

  // Cargar estado guardado al montar
  useEffect(() => {
    const savedAccount = localStorage.getItem('polkaedu_wallet_account');
    const savedAccounts = localStorage.getItem('polkaedu_wallet_accounts');
    
    if (savedAccount && savedAccounts) {
      try {
        const account = JSON.parse(savedAccount);
        const accounts = JSON.parse(savedAccounts);
        setState({
          isConnected: true,
          account,
          accounts,
          error: null,
        });
      } catch (error) {
        console.error('Error al cargar wallet guardada:', error);
        localStorage.removeItem('polkaedu_wallet_account');
        localStorage.removeItem('polkaedu_wallet_accounts');
      }
    }
  }, []);

  /**
   * Conecta con Polkadot.js extension
   */
  const connectPolkadotJs = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      if (!window.injectedWeb3 || !window.injectedWeb3['polkadot-js']) {
        throw new Error('No se encontró la extensión Polkadot.js. Por favor, instálala desde https://polkadot.js.org/extension/');
      }

      const extension = window.injectedWeb3['polkadot-js'];
      const provider = await extension.enable(APP_NAME);
      const accounts = await provider.accounts.get();

      if (accounts.length === 0) {
        throw new Error('No se encontraron cuentas en la extensión. Por favor, crea una cuenta primero.');
      }

      // Mapear cuentas al formato esperado
      const mappedAccounts: WalletAccount[] = accounts.map(acc => ({
        address: acc.address,
        name: acc.name,
        source: 'polkadot-js',
      }));

      const selectedAccount = mappedAccounts[0];

      // Guardar en localStorage
      localStorage.setItem('polkaedu_wallet_account', JSON.stringify(selectedAccount));
      localStorage.setItem('polkaedu_wallet_accounts', JSON.stringify(mappedAccounts));

      // Asociar wallet con el backend
      try {
        await userService.associateWallet({
          walletAddress: selectedAccount.address,
          name: selectedAccount.name,
        });
      } catch (error) {
        console.error('Error al asociar wallet con backend:', error);
        // No lanzar error, solo loguear
      }

      setState({
        isConnected: true,
        account: selectedAccount,
        accounts: mappedAccounts,
        error: null,
      });

      return selectedAccount;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al conectar con Polkadot.js';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Conecta con SubWallet
   */
  const connectSubWallet = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      if (!window.injectedWeb3 || !window.injectedWeb3['subwallet-js']) {
        throw new Error('No se encontró SubWallet. Por favor, instálalo desde https://subwallet.app/');
      }

      const extension = window.injectedWeb3['subwallet-js'];
      const provider = await extension.enable(APP_NAME);
      const accounts = await provider.accounts.get();

      if (accounts.length === 0) {
        throw new Error('No se encontraron cuentas en SubWallet. Por favor, crea una cuenta primero.');
      }

      // Mapear cuentas al formato esperado
      const mappedAccounts: WalletAccount[] = accounts.map(acc => ({
        address: acc.address,
        name: acc.name,
        source: 'subwallet-js',
      }));

      const selectedAccount = mappedAccounts[0];

      // Guardar en localStorage
      localStorage.setItem('polkaedu_wallet_account', JSON.stringify(selectedAccount));
      localStorage.setItem('polkaedu_wallet_accounts', JSON.stringify(mappedAccounts));

      // Asociar wallet con el backend
      try {
        await userService.associateWallet({
          walletAddress: selectedAccount.address,
          name: selectedAccount.name,
        });
      } catch (error) {
        console.error('Error al asociar wallet con backend:', error);
        // No lanzar error, solo loguear
      }

      setState({
        isConnected: true,
        account: selectedAccount,
        accounts: mappedAccounts,
        error: null,
      });

      return selectedAccount;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al conectar con SubWallet';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  /**
   * Desconecta la wallet
   */
  const disconnect = useCallback(() => {
    localStorage.removeItem('polkaedu_wallet_account');
    localStorage.removeItem('polkaedu_wallet_accounts');
    setState({
      isConnected: false,
      account: null,
      accounts: [],
      error: null,
    });
  }, []);

  /**
   * Cambia la cuenta seleccionada
   */
  const selectAccount = useCallback((account: WalletAccount) => {
    localStorage.setItem('polkaedu_wallet_account', JSON.stringify(account));
    setState(prev => ({
      ...prev,
      account,
    }));
  }, []);

  /**
   * Verifica si Polkadot.js está disponible
   */
  const isPolkadotJsAvailable = useCallback(() => {
    return !!(window.injectedWeb3 && window.injectedWeb3['polkadot-js']);
  }, []);

  /**
   * Verifica si SubWallet está disponible
   */
  const isSubWalletAvailable = useCallback(() => {
    return !!(window.injectedWeb3 && window.injectedWeb3['subwallet-js']);
  }, []);

  const value: WalletContextType = {
    ...state,
    connectPolkadotJs,
    connectSubWallet,
    disconnect,
    selectAccount,
    isPolkadotJsAvailable,
    isSubWalletAvailable,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet debe ser usado dentro de WalletProvider');
  }
  return context;
}

