/**
 * Diálogo para conectar wallet durante el proceso de inscripción
 */

'use client';

import { useState } from 'react';
import { useWallet } from '@/src/contexts/WalletContext';

interface WalletConnectDialogProps {
  isOpen: boolean;
  onConnected: (account: any) => void;
  onCancel: () => void;
}

export default function WalletConnectDialog({
  isOpen,
  onConnected,
  onCancel,
}: WalletConnectDialogProps) {
  const {
    connectPolkadotJs,
    connectSubWallet,
    error,
    isPolkadotJsAvailable,
    isSubWalletAvailable,
  } = useWallet();

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<'polkadot' | 'subwallet' | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (walletType: 'polkadot' | 'subwallet') => {
    try {
      setIsConnecting(true);
      setConnectingWallet(walletType);
      
      let connectedAccount;
      if (walletType === 'polkadot') {
        connectedAccount = await connectPolkadotJs();
      } else {
        connectedAccount = await connectSubWallet();
      }
      
      if (connectedAccount) {
        onConnected(connectedAccount);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // El error ya está manejado en el contexto
    } finally {
      setIsConnecting(false);
      setConnectingWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4 border border-neutral-700">
        <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
        <p className="text-neutral-300 mb-6 text-sm">
          You must connect your wallet first to enroll in the course.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {isPolkadotJsAvailable() ? (
            <button
              onClick={() => handleConnect('polkadot')}
              disabled={isConnecting}
              className="w-full text-left px-4 py-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white">Polkadot.js</div>
                <div className="text-xs text-neutral-400">Browser extension</div>
              </div>
              {isConnecting && connectingWallet === 'polkadot' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
            </button>
          ) : (
            <div className="px-4 py-3 rounded bg-neutral-900 text-neutral-500 text-sm">
              Polkadot.js not available
              <div className="text-xs mt-1">
                <a
                  href="https://polkadot.js.org/extension/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline"
                >
                  Install extension
                </a>
              </div>
            </div>
          )}

          {isSubWalletAvailable() ? (
            <button
              onClick={() => handleConnect('subwallet')}
              disabled={isConnecting}
              className="w-full text-left px-4 py-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white">SubWallet</div>
                <div className="text-xs text-neutral-400">Browser extension</div>
              </div>
              {isConnecting && connectingWallet === 'subwallet' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
            </button>
          ) : (
            <div className="px-4 py-3 rounded bg-neutral-900 text-neutral-500 text-sm">
              SubWallet not available
              <div className="text-xs mt-1">
                <a
                  href="https://subwallet.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline"
                >
                  Install extension
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isConnecting}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

