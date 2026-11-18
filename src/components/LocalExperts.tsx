import { useState, useMemo } from "react";
import { Shield, HardHat, Award, CheckCircle2, UserCheck, ShieldCheck, Building2 } from "lucide-react";
import { useBrand, decodeHtmlEntities } from "../BrandContext";

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
  const { city, name, founderPhoto, founderName, founderTitle, aboutText, licenseNumber, rating, logo } = brand;

  const [photoFailed, setPhotoFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const cleanName = useMemo(() => decodeHtmlEntities(name), [name]);
  const cleanCity = useMemo(() => decodeHtmlEntities(city), [city]);
  const hasFounder = Boolean(founderName && founderName.trim().length > 0);

  const displayFounderName = useMemo(() => {
    if (hasFounder) return decodeHtmlEntities(founderName);
    return `${cleanName} Operations & Project Leadership`;
  }, [hasFounder, founderName, cleanName]);

  const displayFounderTitle = useMemo(() => {
    if (founderTitle) return decodeHtmlEntities(founderTitle);
    if (hasFounder) return "Founder & Managing Partner";
    return "Certified Field Direction & Master Craftsmen";
  }, [founderTitle, hasFounder]);

  const displayAbout = useMemo(() => {
    if (aboutText && aboutText.trim().length > 20) {
      return decodeHtmlEntities(aboutText);
    }
    return `Founded on honest craftsmanship and dedicated service across ${cleanCity}. Our master roofing crews specialize in hurricane-engineered residential replacements, commercial TPO flat systems, and emergency storm restorations backed by comprehensive manufacturer warranties.`;
  }, [aboutText, cleanCity]);

  // Generate clean 2-letter monogram for fallback crest (e.g., "RW", "NW", "RO")
  const monogram = useMemo(() => {
    const target = hasFounder && founderName ? founderName : cleanName;
    const parts = target.replace(/[^a-zA-Z\s]/g, "").trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
  }, [hasFounder, founderName, cleanName]);

  return (
    <section className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson/10 border border-crimson/25 text-crimson text-xs font-oswald uppercase tracking-widest font-bold mb-3 shadow-xs">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{hasFounder ? "Executive Leadership" : "Certified Field Direction"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1 mb-3">
            Meet The Leadership Behind {cleanName}
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-serif">
            Dedicated roofing professionals committed to technical excellence, transparent communication, and lifelong protection across {cleanCity}.
          </p>
        </div>

        {/* Apple-Grade Featured Leadership Card */}
        <div className="max-w-4xl mx-auto bg-stone-50/70 border border-stone-200/90 rounded-3xl p-6 sm:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Visual Portrait / Verified Brand Logo / Executive Monogram */}
            <div className="relative shrink-0">
              {founderPhoto && !photoFailed ? (
                /* 1. Verified Founder Portrait (When explicit valid photo is provided) */
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-stone-100">
                  <img
                    src={founderPhoto}
                    alt={displayFounderName}
                    onError={() => setPhotoFailed(true)}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 right-2.5 text-center text-[10px] font-oswald uppercase tracking-wider text-white font-bold bg-zinc-950/70 backdrop-blur-xs py-1 rounded-md">
                    {hasFounder ? `Executive Lead • ${cleanCity}` : `Field Direction • ${cleanCity}`}
                  </span>
                </div>
              ) : logo && !logoFailed ? (
                /* 2. Official Verified Brand Logo Card (Strict Priority: If no founder DP, show Logo) */
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                    <img
                      src={logo}
                      alt={cleanName}
                      onError={() => setLogoFailed(true)}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-stone-900/90 backdrop-blur-xs py-1.5 px-2 text-center">
                    <span className="text-[10px] font-oswald uppercase tracking-wider text-stone-200 font-bold block truncate px-2">
                      {hasFounder ? `${displayFounderName} • ${cleanCity}` : `Certified Team • ${cleanCity}`}
                    </span>
                  </div>
                </div>
              ) : (
                /* 3. Luxury Architectural Monogram Crest (Final Bulletproof Fallback) */
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-stone-900 via-zinc-900 to-stone-950 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-2xl bg-crimson/20 border border-crimson/40 text-white flex items-center justify-center mb-2 shadow-inner">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-2xl font-oswald font-bold tracking-widest text-white">
                    {monogram}
                  </span>
                  <span className="text-[9px] font-oswald uppercase tracking-widest text-stone-300 mt-1">
                    Master Craftsmen
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-zinc-950/80 backdrop-blur-xs py-1.5 px-2 text-center">
                    <span className="text-[10px] font-oswald uppercase tracking-wider text-stone-300 font-bold block truncate px-2">
                      {hasFounder ? `${displayFounderName} • ${cleanCity}` : `${cleanCity} Leadership`}
                    </span>
                  </div>
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
                  Serving {cleanCity} &amp; Surrounding Counties
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
