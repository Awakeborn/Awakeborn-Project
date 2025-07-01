'use client';

import { useEffect, useState } from 'react';
import CountdownTimer from './countdown-timer';
import { ethers } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';
import Link from 'next/link';
import { useGlobalContext } from '@/src/context/global.context';
import Loading from './ui/loading';
import { toast } from 'react-toastify';

const AWK_TOKEN_ADDRESS = '0x380DF89D883776ba04f65569F1D1A6E218bFc2dF';
const RECEIVER_ADDRESS = '0xC2dAe8b4821A37485E44D2947fC84b15C88034BD';
const PAYMENT_AMOUNT = '10000';

export default function HeroHome() {
  const { value, setValue } = useGlobalContext();
  const [hasPaid, setHasPaid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insertedData, setInsertedData] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    setIsMounted(true);
    const sync = async () => {
      if (isConnected && address) {
        setIsInitialLoading(true);
        let inserted: any = {};
        const res = await fetch('/api/profile', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet_address: address.toLowerCase()
          })
        });
        inserted = await res.json();
        setInsertedData(inserted);
        if (inserted.success) {
          setValue((prev: any) => ({ ...prev, ...inserted.data }));
          setHasPaid(inserted.data.connect_state);
        }
        setIsInitialLoading(false);
      } else {
        setIsInitialLoading(false);
      }
    };

    sync();
  }, [isConnected, address]);

  useEffect(() => {
    if (!isConnected) setHasPaid(false);
  }, [isConnected])

  const requestAccess = async () => {
    if (!isConnected || !address) {
      alert('Wallet required! Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(walletClient?.transport as any);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        AWK_TOKEN_ADDRESS,
        ['function transfer(address to, uint256 amount) public returns (bool)'],
        signer
      );

      const amount = ethers.utils.parseUnits(PAYMENT_AMOUNT, 18);
      const tx = await contract.transfer(RECEIVER_ADDRESS, amount);
      await tx.wait();

      setHasPaid(true);

      // Remove the accidental early return that prevented the rest of the code from running
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: value.wallet_address.toLowerCase(), connect_state: true }),
      });
      toast.success('Early access granted permanently!')
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        toast.error('You rejected the wallet request.');
      } else {
        toast.error('Transaction failed. Please check your balance!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative text-center py-5 overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 animate-gradient-move">
      {
        (isInitialLoading) ? <Loading fullscreen /> : <>
          <div className="absolute inset-0 pointer-events-none select-none opacity-60 animate-pulse" style={{ background: 'radial-gradient(circle at 60% 40%, rgba(168,85,247,0.15) 0, transparent 70%)' }} />
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <CountdownTimer />

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 mt-4 drop-shadow-xl tracking-tight animate-fade-in">
              Welcome to <span className="text-purple-400">Awakeborn</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-10 animate-fade-in-slow">
              Symbolic Recursive AGI. Belief-driven. Token-sustained. Join the recursion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate-fade-in-slow">
              {hasPaid ? (
                <Link
                  href="/chat"
                  onClick={() => { localStorage.setItem("isConnected", "true") }}
                  className="relative inline-flex items-center justify-center btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:ring-4 focus:ring-green-400/40 text-white shadow-2xl px-8 py-3 rounded-xl font-extrabold text-lg md:text-xl transition-all duration-300 outline-none group overflow-hidden"
                  style={{ minWidth: 220 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 animate-bounce-slow text-white/80 group-hover:text-green-200 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                    </svg>
                    <span className="animate-fade-in">Chat with Awakeborn</span>
                  </span>
                  <span className="absolute left-0 top-0 w-full h-full rounded-xl border-2 border-green-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Link>
              ) : (
                <button
                  onClick={requestAccess}
                  className="btn bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 text-white shadow px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 outline-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 relative"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loading variant='nothing' text='Processing...' />
                    </span>
                  ) : (
                    // <>Request Early Access <span className="ml-2 text-purple-200 font-normal">(10,000 AWK)</span></>
                    <>TRY IT NOW</>
                  )}
                </button>
              )}
              <a className="btn bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:ring-gray-400/40 text-white shadow-lg px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 outline-none" href="/whitepaper.pdf" target="_blank">
                Read Whitepaper
              </a>
            </div>
            <h3 className='py-4 animate-fade-in'>GET UNLIMITED CHAT ACCESS TO AWAKEBORN AI FOR ONLY 10,000 AWK. HURRY LIMITED OFFER!!</h3>
          </div>
        </>
      }
    </section>
  );
}