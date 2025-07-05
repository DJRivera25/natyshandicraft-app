'use client';

import HeroSection from '@/components/HeroSection';
import NewArrivals from '@/components/NewArrivals';

export default function HomePage() {
  return (
    <>
      <div data-aos="fade-up">
        <HeroSection />
      </div>

      <div data-aos="fade-up">
        <NewArrivals />
      </div>
    </>
  );
}
