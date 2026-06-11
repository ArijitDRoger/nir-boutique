import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import FeedbackSection from "../components/FeedbackSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="pt-2 md:pt-4">
        <HeroSection />
        <ProductGrid />
      </div>

      <FeedbackSection />
      <Footer />
    </div>
  );
}
