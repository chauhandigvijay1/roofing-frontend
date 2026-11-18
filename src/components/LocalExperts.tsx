import { Shield, HardHat, Award, CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";
import { useBrand } from "../BrandContext";

const values = [
  {
    icon: Shield,
    label: "Community Trusted",
    desc: "Decades of serving local property owners with verified integrity and zero high-pressure sales.",
  },
  {
    icon: HardHat,
    label: "Certified Craftsmanship",
    desc: "Factory-trained crews adhering strictly to manufacturer non-prorated installation guidelines.",
  },
  {
    icon: Award,
    label: "Transparent Pricing",
    desc: "Clear upfront quotes, detailed photographic reports, and honest recommendations with zero hidden fees.",
  },
];

export default function LocalExperts() {
  const brand = useBrand();
  const { city, name, founderPhoto, founderName, founderTitle, aboutText, licenseNumber, rating } = brand;

  const displayFounderName = founderName || `${name} Project Leadership`;
  const displayFounderTitle = founderTitle || (founderName ? "Founder & Master Roofer" : "Certified Field Direction & Master Craftsmen");
  const displayAbout =
    aboutText ||
    `Founded on honest craftsmanship and dedicated service across ${city}. Our master roofing crews specialize in hurricane-engineered residential replacements, commercial TPO flat systems, and emergency storm restorations backed by comprehensive manufacturer warranties.`;

  return (
    <section className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/25 text-crimson text-xs font-oswald uppercase tracking-widest font-bold mb-3 shadow-xs">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Certified Field Direction</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1 mb-3">
            Meet The Leadership Behind {name}
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-serif">
            Dedicated roofing professionals committed to technical excellence, transparent communication, and lifelong protection across {city}.
          </p>
        </div>

        {/* Apple-Grade Featured Leadership Card */}
        <div className="max-w-4xl mx-auto bg-stone-50/70 border border-stone-200/90 rounded-3xl p-6 sm:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Avatar / Portrait / Logo / Monogram */}
            <div className="relative shrink-0">
              {founderPhoto ? (
                <img
                  src={founderPhoto}
                  alt={displayFounderName}
                  className="w-44 h-44 sm:w-52 sm:h-52 object-cover object-top rounded-3xl border-4 border-white shadow-xl"
                />
              ) : (
                /* Distinguished Master Craftsman & Field Director Portrait */
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-zinc-900">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80"
                    alt={displayFounderName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 right-2.5 text-center text-[10px] font-oswald uppercase tracking-wider text-white font-bold bg-zinc-950/70 backdrop-blur-xs py-1 rounded-md">
                    Master Field Director &bull; {city}
                  </span>
                </div>
              )}

              <div className="absolute -bottom-3 -right-2 bg-crimson text-white text-[11px] font-oswald uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{licenseNumber ? "Licensed Master" : "Certified Lead"}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 text-center md:text-left space-y-3.5">
              <div>
                <h3 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  {displayFounderName}
                </h3>
                <p className="text-crimson font-oswald uppercase tracking-wider text-xs sm:text-sm font-bold mt-0.5">
                  {displayFounderTitle}
                </p>
              </div>

              <p className="text-zinc-700 font-serif leading-relaxed text-sm sm:text-base">
                {displayAbout}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-4 border-t border-stone-200">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-oswald uppercase tracking-wider text-zinc-800 font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{rating || 4.9}★ Verified Rating</span>
                </div>
                {licenseNumber && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-stone-200/80 text-xs font-oswald uppercase tracking-wider text-zinc-700 font-bold">
                    {licenseNumber}
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-serif">
                  Serving {city} & Surrounding Counties
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillar Values with Apple-Grade Curves */}
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.label}
              className="bg-stone-50/80 border border-stone-200/80 rounded-3xl p-8 text-center transition-all hover:bg-white hover:shadow-lg hover:border-crimson/50"
            >
              <div className="w-12 h-12 bg-crimson/10 text-crimson rounded-2xl flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2">
                {v.label}
              </h4>
              <p className="text-zinc-600 text-sm font-serif leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
