import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import EmergencyBanner from "./components/EmergencyBanner";
import Navbar from "./components/Navbar";
import MegaFooter from "./components/MegaFooter";
import Chatbot from "./components/Chatbot";
import { useBrand } from "./BrandContext";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function DynamicTitle() {
  const { name } = useBrand();
  const { pathname } = useLocation();
  useEffect(() => {
    const labels: Record<string, string> = {
      "/": "Home",
      "/portfolio": "Portfolio",
      "/financing": "Financing",
      "/locations": "Locations",
      "/book": "Book Inspection",
    };
    const label = labels[pathname] || "Services";
    document.title = `${name} | ${label}`;
  }, [name, pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <DynamicTitle />
      <EmergencyBanner />
      <Navbar />
      <main className="min-h-screen bg-white font-serif antialiased">
        <Outlet />
      </main>
      <MegaFooter />
      <Chatbot />
    </>
  );
}
