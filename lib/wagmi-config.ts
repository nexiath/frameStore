'use client';

import { createConfig, http } from 'wagmi';
import { mainnet, base, polygon } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet, base, polygon],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'FrameStore',
      appLogoUrl: 'https://framestore.vercel.app/icon.png',
      preference: 'smartWalletOnly',
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
});