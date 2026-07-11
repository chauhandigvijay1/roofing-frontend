import { BrandProvider } from "./BrandContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Gallery from "./components/Gallery";
import Services from "./components/Services";
import Reviews from "./components/Reviews";
import Location from "./components/Location";
import ContactForm from "./components/ContactForm";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <BrandProvider>
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
    </BrandProvider>
  );
}

export default App;
