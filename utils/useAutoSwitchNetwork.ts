import { useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { polygon } from 'wagmi/chains';

export function useAutoSwitchNetwork() {
  const { isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chain && chain.id !== polygon.id) {
      // Automatically switch to Polygon if connected to a different network
      try {
        switchChain({ chainId: polygon.id });
      } catch (error: unknown) {
        console.log('Failed to switch to Polygon:', error);
        // Don't show error to user as this is automatic
      }
    }
  }, [isConnected, chain, switchChain]);
}