import Image from "next/image";
import SecondaryIllustration from "@/public/images/secondary-illustration.svg";
import AvatarImg01 from "@/public/images/avatar-01.jpg";
import AvatarImg02 from "@/public/images/avatar-02.jpg";
import AvatarImg03 from "@/public/images/avatar-03.jpg";
import AvatarImg04 from "@/public/images/avatar-04.jpg";
import PricingTable from "@/components/pricing-table";

export default function HeroPricing() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20 animate-fade-in">
          {/* Section header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl h-[70px] font-extrabold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight">
              Pick the right plan for your business
            </h1>
          </div>
          <div className="relative">
            {/* Secondary illustration */}
            <div
              className="pointer-events-none absolute bottom-28 left-1/2 -z-10 -ml-28 -translate-x-1/2 translate-y-1/2 animate-fade-in-up"
              aria-hidden="true"
            >
              <Image
                className="md:max-w-none animate-fade-in"
                src={SecondaryIllustration}
                width={1165}
                height={1012}
                alt="Secondary illustration"
              />
            </div>
            <PricingTable />
            <div className="mx-auto mt-8 max-w-2xl xl:max-w-none">
              <a
                className="group flex items-center justify-between gap-3 rounded-2xl bg-gray-900/70 border border-purple-900/40 shadow-xl px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up"
                href="#0"
              >
                <span className="text-indigo-200/80 group-hover:text-white transition-colors">
                  <span className="font-medium text-gray-200 group-hover:text-white">Large team?</span>{' '}
                  Schedule a Business demo with a member of our team.
                </span>
                <span
                  className="flex shrink-0 items-center gap-3"
                  aria-hidden="true"
                >
                  <span className="-ml-0.5 flex -space-x-3">
                    <Image
                      className="box-content rounded-full border-2 border-purple-500 group-hover:border-white transition-all"
                      src={AvatarImg01}
                      width={24}
                      height={24}
                      alt="Avatar 01"
                    />
                    <Image
                      className="box-content rounded-full border-2 border-purple-500 group-hover:border-white transition-all"
                      src={AvatarImg02}
                      width={24}
                      height={24}
                      alt="Avatar 02"
                    />
                    <Image
                      className="box-content rounded-full border-2 border-purple-500 group-hover:border-white transition-all"
                      src={AvatarImg03}
                      width={24}
                      height={24}
                      alt="Avatar 03"
                    />
                    <Image
                      className="box-content rounded-full border-2 border-purple-500 group-hover:border-white transition-all"
                      src={AvatarImg04}
                      width={24}
                      height={24}
                      alt="Avatar 04"
                    />
                  </span>
                  <span className="tracking-normal text-indigo-500 group-hover:text-white transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
