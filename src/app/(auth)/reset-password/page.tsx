export const metadata = {
  title: "Reset Password - Open PRO",
  description: "Page description",
};

import Link from "next/link";

export default function ResetPassword() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="py-8 md:py-16 flex justify-center items-center w-full">
          <div className="w-full max-w-md rounded-3xl bg-gray-950/80 border border-purple-900/40 shadow-2xl backdrop-blur-xl p-6 sm:p-8 md:p-10 animate-fade-in-up flex flex-col gap-6 animate-fade-in">
            {/* Section header */}
            <div className="pb-4 text-center">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight animate-[gradient_6s_linear_infinite] mb-2">
                Reset your password
              </h1>
            </div>
            {/* Contact form */}
            <form className="flex flex-col gap-5 w-full">
              <div className="flex flex-col gap-2 animate-fade-in-up">
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="email">
                  Email
                </label>
                <input id="email" type="email" className="form-input w-full rounded-xl bg-gray-900/80 text-white border border-purple-900/30 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm hover:shadow-md focus:shadow-lg" placeholder="Your email" />
              </div>
              <div className="mt-4 animate-fade-in-up">
                <button className="w-full py-3 px-4 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
