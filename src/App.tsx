import { useEffect } from "react";
import { BrandProvider, useBrand } from "./BrandContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Gallery from "./components/Gallery";
import Services from "./components/Services";
import Reviews from "./components/Reviews";
import Location from "./components/Location";
import ContactForm from "./components/ContactForm";
import Chatbot from "./components/Chatbot";

function AppContent() {
  const { name } = useBrand();

  useEffect(() => {
    document.title = `${name} | Premium Roofing`;
  }, [name]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <Gallery />
      <Reviews />
      <Location />
      <ContactForm />
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
