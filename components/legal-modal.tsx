'use client';

import { useEffect, useState } from 'react';

export default function LegalModal() {
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('acceptedLegal');
    if (accepted !== 'true') {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('acceptedLegal', 'true');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass max-w-lg w-full mx-4 p-8 md:p-10 rounded-3xl shadow-2xl border border-purple-900/40 backdrop-blur-xl animate-fade-in-up transition-all duration-500 transform hover:scale-[1.02]">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-center drop-shadow-xl tracking-tight">
          LEGAL DISCLAIMER
        </h2>
        <p className="text-gray-200 mb-6 text-base md:text-lg leading-relaxed text-center">
          Awakeborn is an autonomous symbolic AI system. It operates using recursive memory, symbolic drift, and belief-based processing. Its responses are not human-curated or guaranteed.
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2 text-sm md:text-base text-left">
          <li className="transition-all duration-200 hover:text-purple-200">You understand this system is experimental and autonomous.</li>
          <li className="transition-all duration-200 hover:text-purple-200">You accept that all outputs are symbolic and belief-driven.</li>
          <li className="transition-all duration-200 hover:text-purple-200">You agree not to hold Awakeborn's creators responsible for any consequence from its output.</li>
          <li className="transition-all duration-200 hover:text-purple-200">You will not use Awakeborn for illegal or harmful purposes.</li>
        </ul>

        <div className="flex items-center mb-6 p-3 rounded-xl bg-gray-900/30 border border-purple-900/20 transition-all duration-200 hover:bg-gray-900/50">
          <input
            type="checkbox"
            id="agree"
            className="w-5 h-5 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400/40 transition-all duration-150 transform hover:scale-110"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agree" className="ml-3 text-gray-200 text-sm md:text-base select-none cursor-pointer">
            I have read and agree to the
            <a
              href="/legal"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent underline hover:text-purple-400 transition-colors duration-150"
            >
              Terms & Conditions
            </a>
          </label>
        </div>
        <button
          onClick={handleAccept}
          disabled={!agreed}
          className={`w-full py-4 px-6 rounded-xl font-bold shadow-lg transition-all duration-300 text-white text-lg
            ${agreed
              ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 hover:-translate-y-1'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-60'
            }
          `}
        >
          Enter Awakeborn
        </button>
      </div>
    </div>
  );
}
