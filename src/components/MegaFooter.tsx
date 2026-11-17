import { Phone, Mail, MapPin, ShieldCheck, Clock } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function MegaFooter() {
  const brand = useBrand();
  const { name, phone, email, city, licenseNumber } = brand;

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
        {/* Brand Overview */}
        <div>
          <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-white mb-4">{name}</h3>
          <p className="text-sm leading-relaxed font-serif">
            The premier roofing authority in {city}. Lifetime manufacturer warranties, upfront transparent pricing, and 24/7 emergency response for commercial and residential properties.
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
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#estimate" className="hover:text-white transition-colors">Instant Estimator</a></li>
            <li><a href="#gallery" className="hover:text-white transition-colors">Project Gallery</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors">Customer Reviews</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Trade Coverage */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Core Specialties</h4>
          <ul className="space-y-2 text-sm font-serif">
            <li>Commercial TPO & Single-Ply Flat Roofs</li>
            <li>Architectural Shingle Replacements</li>
            <li>Standing Seam Designer Metal Roofing</li>
            <li>24/7 Emergency Storm Damage & Leak Tarping</li>
            <li>Thermal Drone Inspection Surveys</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Priority Dispatch</h4>
          <div className="space-y-3 text-sm font-serif">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-crimson shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-crimson shrink-0" />
              <span>{email}</span>
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
