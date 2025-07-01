'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

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
  const [user, setUser] = useState(false);
  const [connect, setConnect] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-gray-950/80 border-b border-purple-900/30 shadow-lg text-gray-100 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/">
          <span className="inline-block align-middle mr-2">
            <Image
              src="/logo1.png"
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
          {
            user ? (
              <>
                <Link href="/chat">
                  <span className="px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-purple-900/30 hover:text-purple-300 focus:bg-purple-900/40 focus:text-purple-200 focus:outline-none shadow-sm hover:-translate-y-0.5">
                    Chat
                  </span>
                </Link>
                <Link href="/blog">
                  <span className="px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-purple-900/30 hover:text-purple-300 focus:bg-purple-900/40 focus:text-purple-200 focus:outline-none shadow-sm hover:-translate-y-0.5">
                    Blog
                  </span>
                </Link>
                <Link href="/pricing">
                  <span className="px-4 py-2 rounded-full transition-all duration-200 cursor-pointer hover:bg-purple-900/30 hover:text-purple-300 focus:bg-purple-900/40 focus:text-purple-200 focus:outline-none shadow-sm hover:-translate-y-0.5">
                    Pricing
                  </span>
                </Link>
              </>
            ) : ""
          }
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
          {
            connect ? (
              <Link href="/signin">
                <span className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 text-white rounded-lg shadow font-semibold transition-all duration-200 cursor-pointer border-0 outline-none ring-1 ring-inset ring-purple-400/20 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5">
                  Login
                </span>
              </Link>
            ) : ""
          }
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
