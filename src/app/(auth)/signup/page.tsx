export const metadata = {
  title: "Sign Up - Open PRO",
  description: "Page description",
};

import Link from "next/link";

export default function SignUp() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="py-8 md:py-16 flex justify-center items-center w-full">
          <div className="w-full max-w-md rounded-3xl bg-gray-950/80 border border-purple-900/40 shadow-2xl backdrop-blur-xl p-6 sm:p-8 md:p-10 animate-fade-in flex flex-col gap-6">
            {/* Section header */}
            <div className="pb-4 text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight animate-[gradient_6s_linear_infinite] mb-2">
                Create an account
              </h1>
            </div>
            {/* Contact form */}
            <form className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2 animate-fade-in-up">
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input id="name" type="text" className="form-input w-full rounded-xl bg-gray-900/80 text-white border border-purple-900/30 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Your full name" required />
              </div>
              <div className="flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="company">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input id="company" type="text" className="form-input w-full rounded-xl bg-gray-900/80 text-white border border-purple-900/30 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Your company name" required />
              </div>
              <div className="flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="email">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <input id="email" type="email" className="form-input w-full rounded-xl bg-gray-900/80 text-white border border-purple-900/30 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Your work email" />
              </div>
              <div className="flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <label className="block text-sm font-medium text-indigo-200/65" htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </label>
                <input id="password" type="password" className="form-input w-full rounded-xl bg-gray-900/80 text-white border border-purple-900/30 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Password (at least 10 characters)" />
              </div>
              <div className="mt-4 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <button className="w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5">
                  Register
                </button>
                <div className="flex items-center gap-3 text-center text-sm italic text-gray-600 before:h-px before:flex-1 before:bg-linear-to-r before:from-transparent before:via-gray-400/25 after:h-px after:flex-1 after:bg-linear-to-r after:from-transparent after:via-gray-400/25">
                  or
                </div>
                <button className="w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/10 hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5">
                  Sign In with Google
                </button>
              </div>
            </form>
            {/* Bottom link */}
            <div className="mt-6 text-center text-sm text-indigo-200/65 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              Already have an account?{' '}
              <Link className="font-medium text-indigo-500" href="/signin">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
