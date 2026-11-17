import { ShieldCheck, BadgeCheck, MapPin, ThumbsUp } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function TrustRibbon() {
  const brand = useBrand();
  const items = [
    {
      icon: ShieldCheck,
      label: brand.licenseNumber || (brand.state === "FL" ? "Florida DBPR Certified" : "Fully Licensed & Insured"),
    },
    {
      icon: BadgeCheck,
      label: brand.state === "FL" ? "140+ MPH Hurricane Fastening" : "Class 4 Impact Certified",
    },
    {
      icon: MapPin,
      label: `Local ${brand.city} Craftsmanship`,
    },
    {
      icon: ThumbsUp,
      label: `${brand.rating || 4.9}★ Verified Satisfaction`,
    },
  ];

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-16 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 bg-crimson text-white overflow-hidden shadow-2xl">
        {items.map((i) => (
          <div key={i.label} className="flex items-center justify-center gap-3 py-6 px-4 border-r border-white/20 last:border-r-0">
            <i.icon className="w-6 h-6 shrink-0" />
            <span className="text-xs md:text-sm font-oswald uppercase tracking-wider font-bold text-center">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
