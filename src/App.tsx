import { useMemo } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import Services from "./components/Services";
import Reviews from "./components/Reviews";
import ContactForm from "./components/ContactForm";
import Chatbot from "./components/Chatbot";

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const name = params.get("name");

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <Hero name={name} />
      <FeatureCards />
      <Services />
      <Reviews />
      <ContactForm />
      <Chatbot />
    </div>
  );
}

export default App;
