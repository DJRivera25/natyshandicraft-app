'use client';

import Image from 'next/image';
import Link from 'next/link';
import heroImage from '@/assets/heroSection.png';

export default function HeroSection() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex flex-col md:flex-row items-center justify-between flex-grow bg-gradient-to-br from-amber-100 via-yellow-50 to-white px-4 sm:px-6 md:px-16 py-8 sm:py-12 overflow-hidden">
        {/* Decorative SVG Accent */}
        <svg
          className="absolute left-0 top-0 w-60 h-60 sm:w-80 sm:h-80 opacity-20 -z-10"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="#F59E42" />
        </svg>
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-5 sm:space-y-7 z-10">
          <span className="inline-block bg-amber-200 text-amber-800 font-semibold px-3 sm:px-4 py-1 rounded-full text-sm sm:text-base tracking-wide mb-2 animate-fade-in">
            Discover Local Artistry
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-amber-900 leading-tight drop-shadow-lg animate-fade-in">
            Handcrafted Elegance <br />
            <span className="text-amber-500">Delivered with Heart</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-700 max-w-lg mx-auto md:mx-0 animate-fade-in">
            Explore our unique collection of locally made handicrafts crafted
            with passion and care. Support artisans and bring home something
            truly special.
          </p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-lg transition transform hover:scale-105 animate-bounce-in"
          >
            <span className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-bag sm:w-6 sm:h-6"
              >
                <path d="M6 2v2" />
                <path d="M18 2v2" />
                <rect width="16" height="20" x="4" y="4" rx="2" />
                <path d="M9 10a3 3 0 0 0 6 0" />
              </svg>
              Shop Now
            </span>
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-8 sm:mt-10 md:mt-0 flex justify-center z-10">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-br from-amber-200 to-yellow-100 flex items-center justify-center shadow-xl">
            <Image
              src={heroImage}
              alt="Craft banner"
              width={360}
              height={360}
              className="object-contain drop-shadow-2xl rounded-full"
              priority
            />
            {/* Animated ring */}
            <span className="absolute inset-0 rounded-full border-4 border-amber-300 animate-pulse-slow"></span>
          </div>
        </div>
      </section>

      {/* Mini Footer/Partners */}
      <footer className="bg-yellow-900 text-white text-center text-sm py-4 sm:py-6 px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-2 text-xs sm:text-base lg:text-lg font-bold px-4 sm:px-8">
          <span className="tracking-wider opacity-90 hover:opacity-100 transition">
            ROBINSONS SUPERMARKET
          </span>
          <span className="tracking-wider opacity-90 hover:opacity-100 transition">
            PUREGOLD
          </span>
          <span className="tracking-wider opacity-90 hover:opacity-100 transition">
            SAVEMORE
          </span>
        </div>
      </footer>
    </main>
  );
}
