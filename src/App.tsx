import { useEffect } from "react";
import { BrandProvider, useBrand } from "./BrandContext";
import EmergencyBanner from "./components/EmergencyBanner";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustRibbon from "./components/TrustRibbon";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import Process from "./components/Process";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import LocalExperts from "./components/LocalExperts";
import Location from "./components/Location";
import FAQ from "./components/FAQ";
import EstimateWizard from "./components/EstimateWizard";
import MegaFooter from "./components/MegaFooter";
import Chatbot from "./components/Chatbot";

function AppContent() {
  const { name } = useBrand();

  useEffect(() => {
    document.title = `${name} | Premium Roofing`;
  }, [name]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <EmergencyBanner />
      <Navbar />
      <Hero />
      <TrustRibbon />
      <Services />
      <WhyChooseUs />
      <Process />
      <Gallery />
      <Testimonials />
      <LocalExperts />
      <Location />
      <FAQ />
      <EstimateWizard />
      <MegaFooter />
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <BrandProvider>
      <AppContent />
    </BrandProvider>
  );
}

export default App;
