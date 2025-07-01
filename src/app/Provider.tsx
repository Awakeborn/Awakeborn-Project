"use client";

import { useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { getConfig } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { GlobalProvider } from "../context/global.context";
import { useAutoSwitchNetwork } from "@/utils/useAutoSwitchNetwork";
import '@rainbow-me/rainbowkit/styles.css';

interface ProviderProps {
  children: React.ReactNode;
}

// Create a single QueryClient instance outside the component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function AutoSwitchNetwork() {
  useAutoSwitchNetwork();
  return null;
}

export default function Provider({ children }: ProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Get config only on client side
    const wagmiConfig = getConfig();
    setConfig(wagmiConfig);
  }, []);

  // Prevent hydration issues by not rendering until mounted and config is ready
  if (!mounted || !config) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="wide"
          initialChain={config.chains[0]}
        >
          <GlobalProvider>
            <AutoSwitchNetwork />
            {children}
          </GlobalProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
} 