'use client';
import { useState } from 'react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, email, category, description };

    try {
      const res = await fetch('/contact/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('Your message has been received. Please allow up to 24 business hours for our response.');
        setName('');
        setEmail('');
        setCategory('');
        setDescription('');
      } else {
        setStatus('Submission failed. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Submission failed. Please try again later.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 animate-fade-in">
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center font-sans">
        <div className="w-full bg-gray-950/80 rounded-3xl shadow-2xl p-10 md:p-14 backdrop-blur-xl border border-purple-900/40 animate-fade-in-up transition-all duration-500">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight">Contact Support</h2>

          <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col items-center">
            <input
              type="text"
              required
              placeholder="Your Name"
              className="w-full p-3 border border-purple-900/30 rounded-xl bg-gray-900/80 text-white focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full p-3 border border-purple-900/30 rounded-xl bg-gray-900/80 text-white focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="issue-type" className="block mb-2 font-medium text-purple-200">Issue Type</label>
            <select
              id="issue-type"
              aria-label="Issue Type"
              className="w-full mb-4 p-3 border border-purple-900/30 rounded-xl bg-gray-900/80 text-white focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Choose an Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Reporting Bugs">Reporting Bugs</option>
              <option value="Other Website Issues">Other Issues with Website</option>
              <option value="Awakeborn Output Issue">Issue with Awakeborn Output</option>
              <option value="Improvement Suggestion">Suggestion to Improve</option>
            </select>

            <textarea
              required
              placeholder="Describe your issue in detail"
              rows={6}
              className="w-full p-3 border border-purple-900/30 rounded-xl bg-gray-900/80 text-white focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg mt-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5"
            >
              Submit
            </button>
          </form>

          {status && <p className="mt-8 text-center text-green-400 font-semibold animate-fade-in-up text-lg">{status}</p>}
        </div>
      </section>
    </main>
  );
}
