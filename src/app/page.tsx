import HeroSection from '@/components/HeroSection';
import NewArrivals from '@/components/NewArrivals';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestSellingProducts from '@/components/BestSellingProducts';
import Footer from '@/components/Footer';
import NewsletterOverlay from '@/components/NewsletterOverlay';

export default function HomePage() {
  return (
    <>
      <div data-aos="fade-up">
        <HeroSection />
      </div>
      <div data-aos="fade-up">
        <FeaturedProducts />
      </div>
      <div data-aos="fade-up">
        <BestSellingProducts />
      </div>
      <div data-aos="fade-up" className="pb-32">
        <NewArrivals />
      </div>
      {/* Overlay container for NewArrivals and NewsletterOverlay */}
      <div className="relative">
        <NewsletterOverlay />
      </div>
      <div className="mt-[-48px]">
        <Footer />
      </div>
    </>
  );
}
