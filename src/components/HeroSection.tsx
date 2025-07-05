'use client';

import Image from 'next/image';
import Link from 'next/link';
import heroImage from '@/assets/heroSection.png';

export default function HeroSection() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-grow bg-amber-100 px-6 md:px-16 ">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-amber-900 leading-tight">
            Handcrafted Elegance <br />
            Delivered with Heart
          </h1>
          <p className="text-lg text-neutral-700 max-w-lg mx-auto md:mx-0">
            Explore our unique collection of locally made handicrafts crafted
            with passion and care.
          </p>
          <Link
            href="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg px-8 py-3 rounded-full transition"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src={heroImage} // Replace with your transparent background image path
            alt="Craft banner"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      </section>

      {/* Mini Footer/Partners */}
      <footer className="bg-yellow-900 text-white text-center text-sm py-6 px-6">
        <div className="flex flex-wrap justify-between gap-6 mt-2 text-xs sm:text-sm font-medium px-8">
          <span className="text-2xl">ROBINSONS SUPERMARKET</span>
          <span className="text-2xl">PUREGOLD</span>
          <span className="text-2xl">SAVEMORE</span>
        </div>
      </footer>
    </main>
  );
}
