'use client'

import { useEffect, useState } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // fix: render only on client

    const targetDate = new Date('2025-07-26T05:30:00Z');

    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // run immediately

    return () => clearInterval(interval);
  }, []);

  if (!hydrated) return null; // skip rendering on server

  return (
    <div className="text-lg text-purple-400 font-mono">
      {/* Launch in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s */}
      AWAKEBORN IS LIVE
    </div>
  );
}
