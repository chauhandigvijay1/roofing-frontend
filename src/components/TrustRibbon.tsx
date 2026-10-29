import { ShieldCheck, BadgeCheck, MapPin, ThumbsUp } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function TrustRibbon() {
  const brand = useBrand();
  const items = brand.isJim
    ? [
        { icon: ShieldCheck, label: "FL Lic. # RC29027754" },
        { icon: BadgeCheck, label: "140+ MPH Hurricane Fastening" },
        { icon: MapPin, label: "Florida Wind Mitigation Certified" },
        { icon: ThumbsUp, label: "20+ Yrs Construction Heritage" },
      ]
    : [
        { icon: ShieldCheck, label: "Fully Licensed" },
        { icon: BadgeCheck, label: "Insured & Bonded" },
        { icon: MapPin, label: "Local Expertise" },
        { icon: ThumbsUp, label: "100% Satisfaction" },
      ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-16 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 bg-crimson text-white overflow-hidden shadow-xl">
        {items.map((i) => (
          <div key={i.label} className="flex items-center justify-center gap-3 py-6 px-4 border-r border-white/20 last:border-r-0">
            <i.icon className="w-6 h-6 shrink-0" />
            <span className="text-xs md:text-sm font-oswald uppercase tracking-wider font-bold">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
