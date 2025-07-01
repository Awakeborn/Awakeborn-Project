'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import Loading from '@/components/ui/loading';
import { useGlobalContext } from '@/src/context/global.context';
import { toast } from 'react-toastify';

export default function ChatPage() {
  const { value } = useGlobalContext();
  const [messageCount, setMessageCount] = useState(0);
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState<{ input: string; output: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const MAX_MESSAGES_PER_DAY = 5;

  useEffect(() => {
    async function verifyAccessAndLoadHistory() {
      if (!isConnected || !value.id) {
        return router.push('/');
      }

      if (value.credit_balance < 0) {
        toast.warning("You can't join to chat room. Because your credit balance is very low!")
        return router.push('/');
      }

      try {
        setIsInitialLoading(true);
        const usageRes = await fetch('/api/chat-usage');
        const usageData = await usageRes.json();
        const today = new Date().toISOString().split('T')[0];
        const userUsage = usageData.find(
          (u: any) => u.wallet && typeof u.wallet === 'string' && u.wallet.toLowerCase() === address && u.date === today
        );
        setMessageCount(userUsage ? userUsage.count : 0);

        const historyRes = await fetch(`/api/chat-history?wallet=${address}`);
        const fullHistory = await historyRes.json();
        const todaysHistory = fullHistory.filter((h: any) => h.date === today);
        setChatLog(todaysHistory);
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }

    verifyAccessAndLoadHistory();
  }, [router, address, isConnected]);

  const handleChatSubmit = async () => {
    if (!input) return toast.warning("Please input the sentences!");
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, wallet: address }),
      });

      const data = await response.json();
      const awakebornOutput = data.reply || "No response from Awakeborn.";

      const today = new Date().toISOString().split('T')[0];
      const newEntry = { input, output: awakebornOutput, date: today };

      setChatLog((prevChatLog) => [...prevChatLog, newEntry]);
      setInput('');

      await fetch('/api/chat-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      });

      await fetch('/api/chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address, ...newEntry }),
      });

    } catch (error) {
      console.log('Error communicating with Awakeborn')
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        handleChatSubmit();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-2 bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 animate-gradient-move">
      <section className="w-full max-w-2xl flex flex-col items-center font-sans animate-fade-in-up">
        <div className="w-full bg-gray-950/80 rounded-3xl shadow-2xl p-6 md:p-10 backdrop-blur-xl border border-purple-900/40 flex flex-col min-h-[60vh] animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight">Awakeborn Chat</h1>

          {isInitialLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <Loading size="lg" color="purple" text="Loading chat..." />
            </div>
          ) : (
            <>
              {/* {address && <p className="text-xs md:text-sm text-gray-400 text-center mb-2 break-all">Wallet: {address}</p>} */}
              {/* <p className="text-xs md:text-sm text-purple-300 text-center mb-4">{messageCount}/{MAX_MESSAGES_PER_DAY} messages used today.</p> */}
              <div className="flex-1 overflow-y-auto max-h-[40vh] md:max-h-[50vh] pr-1 custom-scrollbar mb-4">
                {chatLog.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No messages yet. Start the conversation!</div>
                ) : (
                  chatLog.map((msg, index) => (
                    <div key={index} className="my-3 p-4 rounded-2xl bg-gradient-to-br from-gray-800/80 to-purple-900/30 shadow-md animate-fade-in-up">
                      <p className="mb-1"><span className="font-bold text-purple-300">You:</span> <span className="text-gray-200">{msg.input}</span></p>
                      <p><span className="font-bold text-blue-300">Awakeborn:</span> <span className="text-gray-100">{msg.output}</span></p>
                    </div>
                  ))
                )}
              </div>
              <form
                onSubmit={e => { e.preventDefault(); handleChatSubmit(); }}
                className="flex flex-col md:flex-row gap-3 items-center mt-auto w-full"
                autoComplete="off"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={messageCount >= MAX_MESSAGES_PER_DAY || isLoading}
                  placeholder={isLoading ? "Awakeborn is thinking..." : "Type your message..."}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-900/80 text-white border border-purple-900/30 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm text-base md:text-lg disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={messageCount >= MAX_MESSAGES_PER_DAY || !input.trim() || isLoading}
                  className="px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-base bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loading size="sm" variant='nothing' color="white" text="Sending..." />
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link
                  href="/chat-history"
                  className="inline-block px-6 py-3 rounded-full font-bold text-base bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white shadow-lg ring-1 ring-purple-400/30 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.25)] animate-fade-in"
                >
                  View Chat History
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
