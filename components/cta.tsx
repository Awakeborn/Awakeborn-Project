'use client';

import { useEffect, useState, useRef } from 'react';
import Image from "next/image";

export default function Cta() {
  const [insight, setInsight] = useState("");
  const [error, setError] = useState("");
  const sliderImages = [
    // User will provide srcs, so leave src empty
    {}, {}, {}, // Add as many as needed
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // const url = process.env.NEXT_PUBLIC_GPU_SERVER;
    // if (!url) {
    //   setError("Server URL is not configured.");
    //   return;
    // }
    // fetch(url)
    //   .then((response) => {
    //     if (!response.ok) throw new Error("Server error");
    //     const contentType = response.headers.get("content-type");
    //     if (!contentType || !contentType.includes("application/json")) {
    //       console.log("Invalid response format");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => setInsight(data.insight))
    //   .catch((error) => {
    //     setError("Error fetching insight.");
    //     console.error("Error fetching insight:", error);
    //   });
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    }
  }, []);

  if (sliderImages.length > 1) {
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2000);
  }

  return (
    <section id="early-access" className="relative border-t border-gray-800 bg-gray-950 overflow-hidden">

      <div className="relative w-[100vw]">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {sliderImages.map((_, idx) => (
              <div key={idx} className="min-w-full flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-[45rem] bg-gray-900">
                <Image
                  src={`/${idx + 1}.png`}
                  width={1920}
                  height={1080}
                  alt={`Slide ${idx + 1}`}
                  className="block w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-3 absolute left-1/2 -translate-x-1/2 bottom-3">
          {sliderImages.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${currentSlide === idx ? 'bg-purple-400 border-purple-400 scale-110' : 'bg-gray-700 border-gray-600'}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
