import { useMemo } from "react";
import Hero from "./components/Hero";
import Services from "./components/Services";
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
      <Hero name={name} />
      <Services />
      <Chatbot />
    </div>
  );
}

export default App;
