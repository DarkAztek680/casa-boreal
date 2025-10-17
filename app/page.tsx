import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BarreInfoSection from '@/components/BarreInfoSection';
import BenefitsSection from '@/components/BenefitsSection';
import SchedulePreview from '@/components/SchedulePreview';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <BarreInfoSection />
        <BenefitsSection />
        <SchedulePreview />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}

