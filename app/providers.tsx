'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import { mainnet, bsc, polygon, arbitrum, base } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// ⚠️ IMPORTANT: Înlocuiește textul de mai jos cu ID-ul copiat din Reown Cloud
const projectId = 'AICI_LIPESTI_ID_UL_NOU_DE_LA_REOWN';

const config = getDefaultConfig({
  appName: 'Mihai Daniel Website',
  projectId: projectId,
  chains: [mainnet, bsc, polygon, arbitrum, base],
  ssr: true, // Server Side Rendering activat pentru Next.js
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#2563eb', // Albastrul brandului tău
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}