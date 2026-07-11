import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import EmergencyBanner from "./components/EmergencyBanner";
import Navbar from "./components/Navbar";
import EstimateWizard from "./components/EstimateWizard";
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
    };
    const label = labels[pathname] || "Services";
    document.title = `${name} | ${label}`;
  }, [name, pathname]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const isServicePage = pathname.startsWith("/services");

  return (
    <>
      <ScrollToTop />
      <DynamicTitle />
      <EmergencyBanner />
      <Navbar />
      <main className="min-h-screen bg-white font-sans antialiased">
        <Outlet />
      </main>
      {!isServicePage && <EstimateWizard />}
      <MegaFooter />
      <Chatbot />
    </>
  );
}
