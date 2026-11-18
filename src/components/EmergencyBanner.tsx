import { Phone, ShieldCheck } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function EmergencyBanner() {
  const { city, phone } = useBrand();

  return (
    <div className="bg-zinc-950 text-white text-xs py-2 px-4 sm:px-6 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 hidden sm:inline-block" />
          <span className="font-oswald uppercase tracking-wider text-xs font-semibold text-zinc-200">
            Serving {city} & Surrounding Communities &bull; 24/7 Priority Emergency Dispatch
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-oswald uppercase tracking-wider">
          <span className="hidden md:inline-flex items-center gap-1.5 text-zinc-400 font-serif normal-case text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Complimentary On-Site Inspection &bull; Certified Lifetime Warranties
          </span>
          <a
            href={`tel:${phone}`}
            className="text-white hover:text-crimson-light font-bold inline-flex items-center gap-1.5 transition-colors bg-crimson hover:bg-crimson-dark px-3 py-1 rounded-full text-[11px] shadow-xs"
          >
            <Phone className="w-3 h-3 text-white" />
            <span>24/7 Dispatch: {phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
