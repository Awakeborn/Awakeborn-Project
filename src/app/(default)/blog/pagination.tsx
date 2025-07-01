import Link from "next/link";

export default function Pagination() {
  return (
    <nav className="mx-auto mt-16 flex max-w-xs items-center justify-between bg-gray-900/60 rounded-2xl shadow-lg px-4 py-2 backdrop-blur-md border border-purple-900/30 animate-fade-in-slow">
      <div>
        <Link
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-base bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white shadow-md ring-1 ring-purple-400/20 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.15)]"
          href="#0"
        >
          <span className="mr-1 tracking-normal text-white/70 transition-transform group-hover:-translate-x-0.5">
            &lt;-
          </span>
          Back
          <span className="sr-only">to previous articles</span>
        </Link>
      </div>
      <div className="text-base font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent px-4 py-1 rounded-full shadow-sm">
        <span className="text-white/90">1</span>
        <span className="mx-1 text-indigo-200/80">of</span>
        <span className="text-white/70">4</span>
      </div>
      <div>
        <Link
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-base bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white shadow-md ring-1 ring-purple-400/20 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all duration-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.15)]"
          href="#0"
        >
          Next
          <span className="sr-only">articles</span>
          <span className="ml-1 tracking-normal text-white/70 transition-transform group-hover:translate-x-0.5">
            -&gt;
          </span>
        </Link>
      </div>
    </nav>
  );
}
