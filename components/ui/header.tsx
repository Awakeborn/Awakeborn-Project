'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/src/context/global.context';
import Loading from './loading';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

// Dynamically import WalletConnect to prevent SSR issues
const WalletConnect = dynamic(() => import('../wallet-connect'), {
  ssr: false,
  loading: () => (
    <div className="px-6 py-2 bg-gray-700 rounded-lg animate-pulse">
      <div className="h-4 bg-gray-600 rounded w-24"></div>
    </div>
  ),
});

export default function Header() {
  const { setValue } = useGlobalContext();
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (isConnected && address) {
        setIsInitialLoading(true);
        try {
          let inserted: any = {};
          const res = await fetch('/api/profile', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              wallet_address: address.toLowerCase()
            })
          });
          inserted = await res.json();
          if (inserted.success) {
            setValue((prev: any) => ({ ...prev, ...inserted.data }));
          }

          const adminRes = await fetch('/api/admin-config');
          let adminData = await adminRes.json();
          setValue((prev: any) => ({ ...prev, credit_price: adminData.data.credit_price }));

        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred.");
          }
        }

        setIsInitialLoading(false);
      } else setIsInitialLoading(false);
    };

    sync();
  }, [isConnected, address]);

  return (
    <header className="bg-gray-950/80 border-b border-purple-900/30 shadow-lg text-gray-100 py-4 px-6">
      {
        isInitialLoading ? <Loading fullscreen /> : ""
      }
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="inline-block align-middle mr-2">
            <Image
              src="/logo.png"
              alt="Awakeborn Logo"
              width={100}
              height={100}
              priority
              className="shadow-lg scale-[1.5]"
            />
          </span>
        </Link>

        <nav className="flex items-center gap-2 px-4 py-2 pt-[10px] rounded-full bg-gray-900/70 border border-purple-900/30 shadow-md backdrop-blur-sm">
          <Link href="/">
            <span className="px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-purple-900/30 hover:text-purple-300 focus:bg-purple-900/40 focus:text-purple-200 focus:outline-none shadow-sm hover:-translate-y-0.5">
              Home
            </span>
          </Link>
          <Link href="/about">
            <span className="px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-purple-900/30 hover:text-purple-300 focus:bg-purple-900/40 focus:text-purple-200 focus:outline-none shadow-sm hover:-translate-y-0.5">
              About Us
            </span>
          </Link>
          <Link href="/contact">
            <span className="px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-purple-900/30 hover:text-purple-300 focus:bg-purple-900/40 focus:text-purple-200 focus:outline-none shadow-sm hover:-translate-y-0.5">
              Contact Us
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://dapp.quickswap.exchange/swap/v3/ETH/0x380DF89D883776ba04f65569F1D1A6E218bFc2dF"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 text-white rounded-lg shadow font-semibold transition-all duration-200 cursor-pointer border-0 outline-none ring-1 ring-inset ring-purple-400/20 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5"
          >
            Buy AWK Token
          </a>
          {mounted && (
            <div className="cursor-pointer">
              <WalletConnect />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
