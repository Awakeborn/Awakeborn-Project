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
                <div className='flex flex-col items-center justify-around gap-0 text-white text-sm bg-gray-900/70 border border-purple-900/30 rounded-lg shadow px-3 py-1 min-w-[150px] w-[200px] h-15 relative'>
                  <div className='flex justify-center'>
                    <div
                      onClick={() => setShowNamePrompt(true)}
                      className="font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-sm cursor-pointer group w-[80px] overflow-hidden text-ellipsis whitespace-nowrap text-center"
                    >
                      {isLoading ? (
                        <Loading size="sm" />
                      ) : (
                        userName || 'Connected'
                      )}
                    </div>
                    {/* {(userName === 'Connected' || !userName) && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900/90 text-white text-xs rounded-lg shadow-lg border border-purple-900/30 backdrop-blur-md opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 flex flex-col items-center top-[58px] left-[100px]">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
                        <span className="relative z-10">Please input your user name!</span>
                      </div>
                    )} */}
                    <button
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              width={12}
                              height={12}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                  </div>
                  <div className="flex justify-center w-inherit">
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="cursor-pointer"
                    >
                      {account.displayName}
                      {account.displayBalance ? ` (${account.displayBalance})` : ''}
                    </button>
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
