import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

export default function Navbar() {
  const { name, phone } = useBrand();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-2xl font-black text-slate-900 tracking-tight">
          {name}
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Services
          </a>
          <a href="#gallery" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Gallery
          </a>
          <a href="#reviews" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Reviews
          </a>
          <a href="#location" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Location
          </a>
          <a href="#contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
            Contact
          </a>
        </div>

        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
        >
          <Phone className="w-4 h-4" />
          Call {phone}
        </a>
      </div>
    </motion.nav>
  );
}
