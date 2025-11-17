'use client';
import { useState } from 'react';
import WalletIcon from '@/src/components/icons/wallet';
import { useWallet } from '@/src/contexts/WalletContext';

export default function ConectarWallet() {
  const {
    isConnected,
    account,
    accounts,
    error,
    connectPolkadotJs,
    connectSubWallet,
    disconnect,
    selectAccount,
    isPolkadotJsAvailable,
    isSubWalletAvailable,
  } = useWallet();

  const [showMenu, setShowMenu] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (walletType: 'polkadot' | 'subwallet') => {
    try {
      setIsConnecting(true);
      if (walletType === 'polkadot') {
        await connectPolkadotJs();
      } else {
        await connectSubWallet();
      }
      setShowMenu(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      // El error ya está manejado en el hook
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-[#990052] font-bold text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#aa005a] transition-colors"
        >
          <WalletIcon className="w-6 h-6" />
          <span>{formatAddress(account.address)}</span>
          <svg
            className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <>
            {/* Overlay para cerrar el menú */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menú desplegable */}
            <div className="absolute right-0 mt-2 w-64 bg-neutral-800 rounded-lg shadow-lg z-20 border border-neutral-700">
              <div className="p-4 border-b border-neutral-700">
                <p className="text-sm text-neutral-400">Connected as</p>
                <p className="text-white font-bold truncate" title={account.address}>
                  {account.name || formatAddress(account.address)}
                </p>
                <p className="text-xs text-neutral-500 font-mono truncate" title={account.address}>
                  {account.address}
                </p>
              </div>

              {accounts.length > 1 && (
                <div className="p-2 border-b border-neutral-700">
                  <p className="text-xs text-neutral-400 px-2 mb-2">Switch account:</p>
                  {accounts.map((acc) => (
                    <button
                      key={acc.address}
                      onClick={() => {
                        selectAccount(acc);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        acc.address === account.address
                          ? 'bg-pink-900 text-white'
                          : 'text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {acc.name || formatAddress(acc.address)}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-2">
                <button
                  onClick={handleDisconnect}
                  className="w-full text-left px-3 py-2 rounded text-sm text-red-400 hover:bg-neutral-700 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isConnecting}
        className="bg-[#990052] font-bold text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#aa005a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <WalletIcon className="w-6 h-6" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>

      {showMenu && (
        <>
          {/* Overlay para cerrar el menú */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menú de opciones de wallet */}
          <div className="absolute right-0 mt-2 w-64 bg-neutral-800 rounded-lg shadow-lg z-20 border border-neutral-700">
            <div className="p-4">
              <p className="text-sm text-neutral-400 mb-3">Select a wallet:</p>
              
              {error && (
                <div className="mb-3 p-2 bg-red-900/20 border border-red-500 rounded text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                {isPolkadotJsAvailable() ? (
                  <button
                    onClick={() => handleConnect('polkadot')}
                    disabled={isConnecting}
                    className="w-full text-left px-4 py-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-bold text-white">Polkadot.js</div>
                    <div className="text-xs text-neutral-400">Browser extension</div>
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
                    className="w-full text-left px-4 py-3 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-bold text-white">SubWallet</div>
                    <div className="text-xs text-neutral-400">Browser extension</div>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}
