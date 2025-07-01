'use client';

import { getDefaultConfig, getWalletConnectConnector, Wallet } from '@rainbow-me/rainbowkit';
import { rainbowWallet, trustWallet, metaMaskWallet, ledgerWallet } from '@rainbow-me/rainbowkit/wallets';
import { polygon } from 'wagmi/chains';

// Use your WalletConnect Cloud projectId
export const projectId = "c2a4ab1530a4cebd6389736e2983aec3";

export interface ExodusWalletOptions {
  projectId: string;
}

export const exodusWallet = ({ projectId }: ExodusWalletOptions): Wallet => ({
  id: 'exodus',
  name: 'Exodus',
  iconUrl: '/icons/exodus.svg',
  iconBackground: '#ffffff',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=exodusmovement.exodus',
    ios: 'https://apps.apple.com/app/id1414384820',
    chrome: 'https://www.exodus.com/download/',
    qrCode: 'https://www.exodus.com/mobile/',
  },
  mobile: {
    getUri: (uri: string) => uri,
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: 'https://www.exodus.com/faq/',
      steps: [
        {
          description: 'Open the Exodus app on your mobile device.',
          step: 'install',
          title: 'Install and Open the Exodus app',
        },
        {
          description: 'Scan the QR code to connect your wallet.',
          step: 'scan',
          title: 'Tap the scan icon in Exodus',
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: 'https://www.exodus.com/download/',
      steps: [
        {
          description: 'Download and install the Exodus browser extension.',
          step: 'install',
          title: 'Install the Exodus Extension',
        },
        {
          description: 'Secure your wallet with a backup phrase.',
          step: 'create',
          title: 'Create or Import a Wallet',
        },
        {
          description: 'After setup, refresh your browser to complete connection.',
          step: 'refresh',
          title: 'Refresh your browser',
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({ projectId }),
});

// Create config only when running in browser
export const getConfig = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return getDefaultConfig({
    appName: 'Awakeborn',
    projectId,
    chains: [polygon],
    wallets: [{
      groupName: 'Suggested',
      wallets: [rainbowWallet, trustWallet, metaMaskWallet, ledgerWallet, exodusWallet]
    }],
    ssr: true,
  });
};

export const chains = [polygon];