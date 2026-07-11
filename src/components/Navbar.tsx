import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-xl font-bold text-white tracking-tight"
        >
          <span className="text-amber-500">Roofing</span>Pro
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Services
          </a>
          <a
            href="#reviews"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Reviews
          </a>
          <a
            href="#contact"
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>

        <a
          href="tel:+15551234567"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
      </div>
    </motion.nav>
  );
}
