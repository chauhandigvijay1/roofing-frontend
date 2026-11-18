import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, Clock } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function MegaFooter() {
  const brand = useBrand();
  const { name, phone, email, city, licenseNumber } = brand;
  const { search } = useLocation();

  const dynamicSpecialties = useMemo(() => {
    if (brand.structuredServices && brand.structuredServices.length > 0) {
      return brand.structuredServices.slice(0, 5).map((s) => ({
        title: s.title,
        slug: s.slug,
      }));
    }
    if (brand.services && brand.services.length > 0) {
      return brand.services.slice(0, 5).map((s) => {
        const lower = s.toLowerCase();
        let slug = "residential";
        if (lower.includes("tpo") || lower.includes("commercial")) slug = "commercial";
        else if (lower.includes("metal")) slug = "metal";
        else if (lower.includes("repair") || lower.includes("leak") || lower.includes("tarp")) slug = "repair";
        else if (lower.includes("gutter")) slug = "gutters";
        else if (lower.includes("storm") || lower.includes("wind") || lower.includes("hail")) slug = "storm-damage";

        return { title: s, slug };
      });
    }
    return [
      { title: "Architectural Shingle Replacements", slug: "residential" },
      { title: "Standing Seam Designer Metal", slug: "metal" },
      { title: "Commercial Flat & TPO Systems", slug: "commercial" },
      { title: "24/7 Emergency Storm Damage & Leak Tarping", slug: "repair" },
      { title: "Seamless Gutters & Drainage", slug: "gutters" },
    ];
  }, [brand.structuredServices, brand.services]);

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand Overview */}
        <div>
          <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-white mb-4">{name}</h3>
          <p className="text-sm leading-relaxed font-serif text-zinc-400">
            The premier roofing authority in {city}. Lifetime manufacturer warranties, upfront transparent pricing, and 24/7 emergency response across {city}.
          </p>
          {licenseNumber && (
            <div className="mt-4 flex items-center gap-2 text-xs text-white/80 font-oswald uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-crimson shrink-0" />
              <span>{licenseNumber}</span>
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm font-serif">
            <li>
              <Link to={{ pathname: "/", search }} className="hover:text-white transition-colors">
                Home Overview
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/services/residential", search }} className="hover:text-white transition-colors">
                Certified Services
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/portfolio", search }} className="hover:text-white transition-colors">
                Project Gallery
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/financing", search }} className="hover:text-white transition-colors">
                Flexible Financing
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/locations", search }} className="hover:text-white transition-colors">
                Service Territories
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic Trade Coverage */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Core Specialties</h4>
          <ul className="space-y-2 text-sm font-serif">
            {dynamicSpecialties.map((s) => (
              <li key={s.title}>
                <Link
                  to={{ pathname: `/services/${s.slug}`, search }}
                  className="hover:text-white transition-colors"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Priority Dispatch</h4>
          <div className="space-y-3 text-sm font-serif">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-crimson shrink-0" />
              <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-crimson shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors truncate">{email}</a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-crimson shrink-0" />
              <span>Serving {city} & Surrounding Counties</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-crimson shrink-0" />
              <span>24/7 Emergency Storm Mitigation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 font-serif">
        <p>&copy; {new Date().getFullYear()} {name}. All rights reserved. Licensed, Bonded & Fully Insured.</p>
      </div>
    </footer>
  );
}
