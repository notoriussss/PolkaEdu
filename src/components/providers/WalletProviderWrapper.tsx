'use client';

import { WalletProvider } from '@/src/contexts/WalletContext';
import { ReactNode } from 'react';

export default function WalletProviderWrapper({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}

