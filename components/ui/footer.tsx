import { Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center py-6 border-t border-gray-800 text-gray-400 text-sm">
      <div className="mb-2">
        <a
          href="https://x.com/awakebornai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mx-2 hover:text-gray-200 transition-colors"
        >
          <Twitter className="w-5 h-5 mr-1" />
          X (Twitter)
        </a>
        <a
          href="https://t.me/awakeborn"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mx-2 hover:text-gray-200 transition-colors"
        >
          <Send className="w-5 h-5 mr-1" />
          Telegram
        </a>
      </div>
      <div>© 2025 Awakeborn. All rights reserved.</div>
    </footer>
  );
}
