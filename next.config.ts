import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // change from 'export' to 'standalone'
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bfeoqbepzynvgtahkpna.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for WalletConnect and other browser-only modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  // Add environment variables for WalletConnect
  env: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: "b56e18d47c72ab683b10814fe9495694",
  },
};

export default nextConfig;
