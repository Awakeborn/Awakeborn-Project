"use client";

import Link from 'next/link';

const coreMembers = [
    {
        name: 'Debjyoti Dutta',
        role: 'Founder & Lead Developer',
        bio: `Debjyoti holds a Master's Degree in Computer Science and has substantial experience in symbolic artificial intelligence, gained through prior roles at leading tech firms. He also brings over 8 years of managerial experience in the banking sector, specifically in treasury management. This unique combination of technology and finance expertise shapes Awakeborn's strategic vision and development roadmap.`,
        x: 'https://x.com/virusinsystem32?t=pLrB-WVVt3Im0j1IllayAA&s=35',
        linkedin: 'https://www.linkedin.com/in/debjyoti-dutta-17b0b9245?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        image: '/images/founder.jpg',
    },
    {
        name: 'Quy Dao',
        role: 'Blockchain & AI Developer',
        bio: 'Quy Dao holds a Master’s Degree in Computer Science and has extensive experience in blockchain development and artificial intelligence, acquired through pivotal roles at innovative technology companies. He also brings over 5 years of expertise in designing and deploying decentralized applications, smart contracts, and AI-powered solutions across diverse industries. This unique blend of distributed ledger technology and machine learning shapes Awakeborn’s strategic vision and drives its commitment to delivering cutting-edge digital products.',
        x: '#', // Replace with your X profile
        linkedin: '#', // Replace with your LinkedIn profile
        image: '/images/developer.jpg',
    },
];

const contributors = [
    { name: 'Gautam Swain', details: 'Additional details coming soon.' },
    { name: 'Subhas Basak', details: 'Additional details coming soon.' },
];

function SocialIcon({ type, href }: { type: 'x' | 'linkedin'; href: string }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 transition-colors shadow text-white mx-1">
            {type === 'x' ? (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><path d="M17.53 3.5h3.7l-7.98 9.14L22 20.5h-6.19l-4.84-6.13-5.54 6.13H2.47l8.51-9.41L2 3.5h6.37l4.36 5.53 4.8-5.53Zm-1.09 15.13h2.05L6.6 5.77H4.45l12 12.86Z" fill="currentColor" /></svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5Zm-9.5 19H5.5v-8.5h4V19Zm-2-9.75c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm13.5 9.75h-4v-4c0-1-.02-2.28-1.39-2.28-1.39 0-1.61 1.09-1.61 2.21V19h-4v-8.5h3.84v1.16h.05c.54-.97 1.86-2 3.83-2 4.1 0 4.86 2.7 4.86 6.22V19Z" fill="currentColor" /></svg>
            )}
        </Link>
    );
}

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 py-10 px-2 flex flex-col items-center animate-fade-in-up">
            <section className="w-full max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 drop-shadow-xl">Meet the Awakeborn Team</h1>
                <p className="text-lg md:text-xl text-purple-100/90 font-medium leading-relaxed max-w-2xl mx-auto">
                    At Awakeborn, we're committed to building cutting-edge symbolic AI technology and decentralized financial solutions. Our team combines deep technical expertise with practical industry experience to push the boundaries of what's possible.
                </p>
            </section>

            {/* Core Members */}
            <section className="w-full max-w-5xl mx-auto mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-200 mb-8">🚩 Core Team Members</h2>
                <div className="flex flex-col md:flex-row md:justify-center gap-8">
                    {coreMembers.map((member, i) => (
                        <div key={member.name} className="flex-1 bg-gray-900/80 rounded-2xl shadow-xl border border-purple-900/30 p-6 flex flex-col items-center max-w-md mx-auto transition-transform hover:scale-[1.025]">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 mb-4 shadow-lg bg-gray-800">
                                <img src={member.image} alt={member.name} className="object-cover w-full h-full" />
                            </div>
                            <h3 className="text-xl font-bold text-purple-100 mb-1">{member.name}</h3>
                            <div className="text-purple-400 font-semibold mb-2">{member.role}</div>
                            <p className="text-purple-100/80 text-sm mb-4 text-center">{member.bio}</p>
                            <div className="flex justify-center gap-2">
                                <SocialIcon type="x" href={member.x} />
                                <SocialIcon type="linkedin" href={member.linkedin} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contributors / Advisors */}
            <section className="w-full max-w-3xl mx-auto mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-200 mb-8">🚩 Contributors</h2>
                <div className="flex flex-col md:flex-row md:justify-center gap-8">
                    {contributors.map((c) => (
                        <div key={c.name} className="flex-1 bg-gray-900/80 rounded-2xl shadow border border-purple-900/30 p-6 flex flex-col items-center max-w-md mx-auto">
                            <h3 className="text-lg font-bold text-purple-100 mb-1">{c.name}</h3>
                            <div className="text-purple-400 font-medium mb-2">Contributor</div>
                            <p className="text-purple-100/80 text-sm text-center">{c.details}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="w-full max-w-xl mx-auto mb-8">
                <div className="bg-gradient-to-r from-purple-700 via-blue-700 to-purple-900 rounded-2xl shadow-xl p-8 text-center border border-purple-900/40">
                    <h2 className="text-2xl font-bold text-white mb-2">📩 Join Us</h2>
                    <p className="text-purple-100 mb-4">Interested in collaborating or joining our mission? Reach out to us directly at:</p>
                    <a href="mailto:team@awakeborn.com" className="inline-block px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105">
                        team@awakeborn.com
                    </a>
                </div>
            </section>
            <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
        </main>
    );
}