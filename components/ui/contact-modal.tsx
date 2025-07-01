'use client'

import { useState } from 'react';
import Loading from './loading';

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('Issue');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock email trigger (you can replace this with actual API logic)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Message sent to team@awakeborn.com\nEmail: ${email}\nType: ${type}\nMessage: ${message}`);
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full text-black">
        <h2 className="text-xl font-bold mb-4">Contact Awakeborn Team</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Email Address</label>
          <input
            type="email"
            required
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block mb-2 font-medium">Issue Type</label>
          <select
            className="w-full mb-4 p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Issue">Issue</option>
            <option value="Suggestion">Suggestion</option>
          </select>

          <label className="block mb-2 font-medium">Message</label>
          <textarea
            required
            className="w-full mb-4 p-2 border rounded"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" disabled={isLoading}>
              {isLoading ? <Loading /> : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
