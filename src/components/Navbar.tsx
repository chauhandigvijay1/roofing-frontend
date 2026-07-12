import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, ChevronDown, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

const services = [
  { label: "Residential Replacement", path: "/services/residential" },
  { label: "Emergency Repair", path: "/services/repair" },
  { label: "Storm Damage", path: "/services/storm-damage" },
  { label: "Commercial Roofing", path: "/services/commercial" },
  { label: "Maintenance", path: "/services/maintenance" },
  { label: "Gutters", path: "/services/gutters" },
];

const company = [
  { label: "Portfolio", path: "/portfolio" },
  { label: "Financing", path: "/financing" },
  { label: "Locations", path: "/locations" },
];

export default function Navbar() {
  const { name, phone } = useBrand();
  const { pathname } = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200"
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-oswald uppercase tracking-wider font-black text-zinc-900">
          {name}
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("services")}
          >
            <button
              className={`flex items-center gap-1 px-4 py-2 text-sm font-oswald uppercase tracking-wider font-bold transition-colors ${
                isActive("/services") ? "text-crimson bg-crimson/5" : "text-zinc-600 hover:text-crimson hover:bg-stone-50"
              }`}
            >
              Services <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openDropdown === "services" && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-xl shadow-stone-200/50 border border-stone-100 py-3 z-50">
                {services.map((s) => (
                  <Link
                    key={s.path}
                    to={s.path}
                    className={`block px-5 py-2.5 text-sm font-oswald uppercase tracking-wider transition-colors ${
                      pathname === s.path ? "text-crimson bg-crimson/5 font-bold" : "text-zinc-700 hover:text-crimson hover:bg-stone-50"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/"
            className={`px-4 py-2 text-sm font-oswald uppercase tracking-wider font-bold transition-colors ${
              pathname === "/" ? "text-crimson bg-crimson/5" : "text-zinc-600 hover:text-crimson hover:bg-stone-50"
            }`}
          >
            Home
          </Link>

          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("company")}
          >
            <button
              className={`flex items-center gap-1 px-4 py-2 text-sm font-oswald uppercase tracking-wider font-bold transition-colors ${
                isActive("/portfolio") || isActive("/financing") || isActive("/locations") ? "text-crimson bg-crimson/5" : "text-zinc-600 hover:text-crimson hover:bg-stone-50"
              }`}
            >
              Company <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {openDropdown === "company" && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-xl shadow-stone-200/50 border border-stone-100 py-3 z-50">
                {company.map((c) => (
                  <Link
                    key={c.path}
                    to={c.path}
                    className={`block px-5 py-2.5 text-sm font-oswald uppercase tracking-wider transition-colors ${
                      pathname === c.path ? "text-crimson bg-crimson/5 font-bold" : "text-zinc-700 hover:text-crimson hover:bg-stone-50"
                    }`}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-crimson text-crimson font-oswald uppercase tracking-wider font-bold text-sm hover:bg-crimson hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson text-white font-oswald uppercase tracking-wider font-bold text-sm shadow-lg hover:scale-105 transition-transform"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
