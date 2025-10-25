'use client';

import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    // MetaMask and other injected wallets
    injected({
      target() {
        return {
          id: 'injected',
          name: 'MetaMask',
          provider: typeof window !== 'undefined' ? window.ethereum : undefined,
        };
      },
    }),
    // Coinbase Wallet with Smart Wallet support
    coinbaseWallet({
      appName: 'Base Raffle',
      appLogoUrl: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=ad3941e5ec034c87bd50708c966e7b84',
      preference: 'all', // Shows both EOA and Smart Wallet options
    }),
    // WalletConnect for mobile wallets
    walletConnect({
      projectId: '1d0226d4-9f84-48d6-9486-b4381e220d9f',
      metadata: {
        name: 'Base Raffle',
        description: 'Web3 Raffle dApp on Base with NFTs and Chainlink VRF',
        url: 'https://base-raffle.vercel.app',
        icons: ['https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=ad3941e5ec034c87bd50708c966e7b84'],
      },
      showQrModal: true,
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey="EUK6nliWVdB5Nkt4VuNXUsAV7VwBmtwR"
          projectId="1d0226d4-9f84-48d6-9486-b4381e220d9f"
          chain={base}
          config={{
            appearance: {
              name: 'Base Raffle',
              logo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9756b3248bdd48d596519e7d98958e9df5588654dadf0bb17a71fc435bcb37b3?placeholderIfAbsent=true&apiKey=ad3941e5ec034c87bd50708c966e7b84',
              mode: 'auto',
              theme: 'base',
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
