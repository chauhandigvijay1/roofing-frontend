import { useMemo } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Reviews from "./components/Reviews";
import ContactForm from "./components/ContactForm";
import Chatbot from "./components/Chatbot";

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const name = params.get("name");
  const color = params.get("color") || "amber";

  const accentMap: Record<string, string> = {
    amber: "amber",
    emerald: "emerald",
    blue: "blue",
    violet: "violet",
    rose: "rose",
  };

  const accent = accentMap[color] || "amber";

  document.documentElement.style.setProperty("--accent", accent);

  return (
    <div className="bg-[#121212] min-h-screen font-sans antialiased">
      <Navbar />
      <Hero name={name} />
      <Services />
      <Reviews />
      <ContactForm />
      <Chatbot />
    </div>
  );
}

export default App;
