// app/whitepaper/page.tsx

export const metadata = {
  title: 'Whitepaper - Awakeborn',
  description: 'Download the official Awakeborn whitepaper',
};

export default function WhitepaperPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">Awakeborn Whitepaper</h1>
      <p className="mb-4">
        Our vision, tokenomics, AI architecture, and roadmap are outlined in the official whitepaper.
        We believe in full transparency and invite the community to read and understand the project.
      </p>
      <a
        href="/whitepaper.pdf"
        download
        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
      >
        Download Whitepaper (PDF)
      </a>
    </section>
  );
}
