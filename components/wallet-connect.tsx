'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import UserInfoModal from './userInfo';
import { useGlobalContext } from '@/src/context/global.context';
import Loading from './ui/loading';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect() {
  const { value } = useGlobalContext();
  const [userName, setUserName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔁 On mount or wallet event
  useEffect(() => {
    if (mounted && isConnected && value.id) {
      const init = async () => {
        try {
          setIsLoading(true);
          setUserName(value.user_name)
        } catch (e) {
          console.error("Failed to get accounts from wallet provider", e);
        } finally {
          setIsLoading(false);
        }
      };

      init();
    }
  }, [address, isConnected, mounted, value.id]);

  // Move event listeners into useEffect to avoid adding multiple listeners on every render
  useEffect(() => {
    if (!mounted) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === "nameModal") {
        setShowNamePrompt(false);
      }
    };

    document.addEventListener("click", handleClick);

    // Cleanup listeners on unmount
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showNamePrompt, userName, mounted]);

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return null;
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted: rainbowMounted,
      }) => {
        return (
          <div
            {...(!rainbowMounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!rainbowMounted || !account || !chain) {
                return (
                  <button onClick={() => {
                    openConnectModal();
                    if (!localStorage.awakeborn_user) localStorage.setItem('awakeborn_user', JSON.stringify({ address: address, name: "Connected" }));
                  }} type="button" className='bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 text-white px-6 py-2 rounded-lg shadow font-semibold transition-all duration-200 cursor-pointer border-0 outline-none ring-1 ring-inset ring-purple-400/20 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5'>
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={() => {
                      setIsSwitchingNetwork(true);
                      openChainModal();
                      // Reset loading state after a delay
                      setTimeout(() => setIsSwitchingNetwork(false), 3000);
                    }}
                    type="button"
                    className='bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 text-white px-6 py-2 rounded-lg shadow font-semibold transition-all duration-200 cursor-pointer border-0 outline-none ring-1 ring-inset ring-purple-400/20 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2'
                    disabled={isSwitchingNetwork}
                  >
                    {isSwitchingNetwork ? (
                      <Loading size="sm" variant='nothing' text='' />
                    ) : null}
                    {isSwitchingNetwork ? 'Switching...' : 'Switch to Polygon'}
                  </button>
                );
              }

              return (
                <div>
                  <div className='bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 text-white px-6 py-2 rounded-lg shadow font-semibold transition-all duration-200 cursor-pointer border-0 outline-none ring-1 ring-inset ring-purple-400/20 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2'>
                    <button
                      onClick={() => setShowNamePrompt(true)}
                      type="button"
                      className='cursor-pointer'
                      title='Showing Dashboard'
                    >
                      Dashboard
                    </button>
                    <span onClick={openAccountModal} className="cursor-pointer flex items-center" title="Disconnect Wallet">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path d="M16 17v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="16" y="8" width="6" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 12h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                  <UserInfoModal setShowNamePrompt={setShowNamePrompt} showNamePrompt={showNamePrompt} setUserName={setUserName} />
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
