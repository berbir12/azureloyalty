import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import LoyaltySection from "@/components/LoyaltySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AmenitiesSection />
      <LoyaltySection />
      <Footer />
    </main>
  );
};

export default Index;
