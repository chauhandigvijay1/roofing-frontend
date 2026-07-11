import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-slate-900 tracking-tight">
          <span className="text-blue-600">Roofing</span>Pro
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Services
          </a>
          <a href="#reviews" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Reviews
          </a>
          <a href="#contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Contact
          </a>
        </div>

        <a
          href="tel:+15551234567"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
        >
          <Phone className="w-4 h-4" />
          Call Now: (555) 123-4567
        </a>
      </div>
    </motion.nav>
  );
}
