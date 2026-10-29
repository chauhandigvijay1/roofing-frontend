import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function MegaFooter() {
  const brand = useBrand();
  const { name, phone, email, city, isJim, licenseNumber } = brand;

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-white mb-4">{name}</h3>
          <p className="text-sm leading-relaxed font-serif">
            {isJim
              ? "We Nailed It! Northeast Florida's trusted hurricane-tested roofing team serving Duval, St. Johns, Clay, Nassau, and Flagler counties."
              : `The #1 roofers in ${city}. Premium craftsmanship, trusted materials, and a 100% satisfaction guarantee on every project.`}
          </p>
          {licenseNumber && (
            <div className="mt-4 flex items-center gap-2 text-xs text-white/80 font-oswald uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-crimson shrink-0" />
              <span>{licenseNumber}</span>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm font-serif">
            <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="#process" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
            <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
            <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Contact Info</h4>
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
              <span>
                {isJim
                  ? "5105 Philips Hwy, Suite 205, Jacksonville, FL 32207"
                  : `Serving ${city} & Surrounding Areas`}
              </span>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-sm font-oswald uppercase tracking-wider font-bold text-white mb-4">Hours</h4>
          <div className="space-y-2 text-sm font-serif">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-crimson shrink-0" />
              <div>
                <p>Mon – Fri: 7 AM – 7 PM</p>
                <p>Sat: 8 AM – 4 PM</p>
                <p>Sun: Emergency Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-zinc-500 font-serif">
          &copy; {new Date().getFullYear()} {name}. All rights reserved. | {isJim ? "Florida DBPR Lic. # RC29027754" : `The #1 roofers in ${city}`}
        </div>
      </div>
    </footer>
  );
}
