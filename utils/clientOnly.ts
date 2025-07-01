'use client';

import React, { useEffect, useState } from 'react';

export function useClientOnly() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const mounted = useClientOnly();

  if (!mounted) {
    return null;
  }

  return React.createElement(React.Fragment, null, children);
}

export function isClient() {
  return typeof window !== 'undefined';
}

export function isServer() {
  return typeof window === 'undefined';
} 