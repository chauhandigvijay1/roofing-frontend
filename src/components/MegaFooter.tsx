import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function MegaFooter() {
  const { name, phone, email, city } = useBrand();

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-white mb-4">{name}</h3>
          <p className="text-sm leading-relaxed font-serif">
            The #1 roofers in {city}. Premium craftsmanship, trusted materials,
            and a 100% satisfaction guarantee on every project.
          </p>
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
              <span>Serving {city} & Surrounding Areas</span>
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
          &copy; {new Date().getFullYear()} {name}. All rights reserved. | The #1 roofers in {city}
        </div>
      </div>
    </footer>
  );
}
