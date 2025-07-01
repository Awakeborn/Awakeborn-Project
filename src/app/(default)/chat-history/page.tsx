"use client";

import React, { useEffect, useState, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Loading from '@/components/ui/loading';

interface ChatMessage {
  date: string;
  input: string;
  output: string;
}

export default function ChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    async function loadHistory() {
      if (!isConnected) return router.push('/');
      setLoading(true);
      const res = await fetch(`/api/chat-history?wallet=${address}`);
      const data: ChatMessage[] = await res.json();
      setChatHistory(data);
      setLoading(false);
    }
    loadHistory();
  }, [router, address, isConnected]);

  // Group messages by date
  const grouped = chatHistory.reduce((acc: Record<string, ChatMessage[]>, msg) => {
    if (!acc[msg.date]) acc[msg.date] = [];
    acc[msg.date].push(msg);
    return acc;
  }, {});

  return (
    <section className="max-w-4xl mx-auto py-12 px-2 md:px-4 min-h-[80vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight transition-all duration-500">Full Chat History</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <Loading />
          <span className="text-purple-400 font-semibold">Loading chat history...</span>
        </div>
      ) : chatHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.728 9-8.333 0-4.605-4.03-8.334-9-8.334s-9 3.729-9 8.334c0 4.605 4.03 8.333 9 8.333z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-6.364 2.364a4.5 4.5 0 016.364 0" /></svg>
          <span className="text-gray-400 text-lg">No chat history yet. Start a conversation!</span>
        </div>
      ) : (
        <div className="w-full animate-fade-in-up">
          {Object.entries(grouped).map(([date, messages]) => (
            <div key={date} className="mb-8">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-950 via-gray-900 to-purple-950 bg-clip-padding py-2 px-4 rounded-xl shadow-md mb-4 border-l-4 border-purple-400/60">
                <span className="text-lg font-bold text-purple-300 tracking-wide">{date}</span>
              </div>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-gray-800/80 to-purple-900/30 shadow-lg rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-purple-900/20 opacity-0 translate-y-6 animate-fade-in-card"
                    style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    <p className="mb-2"><span className="font-bold text-purple-300">You:</span> <span className="text-gray-200">{msg.input}</span></p>
                    <p><span className="font-bold text-blue-300">Awakeborn:</span> <span className="text-gray-100">{msg.output}</span></p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => router.push('/chat')}
        className="mt-8 px-8 py-3 rounded-full font-bold text-lg bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white shadow-lg ring-1 ring-purple-400/30 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.25)] animate-fade-in"
      >
        Back to Chat
      </button>
      <style jsx global>{`
        @keyframes fade-in-card {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in-card {
          animation: fade-in-card 0.6s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s both;
        }
      `}</style>
    </section>
  );
}
