import { Shield, HardHat, Award, CheckCircle2 } from "lucide-react";
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
    label: "Forensic Integrity",
    desc: "Detailed photographic diagnostics, transparent line-item scoping, and licensed oversight.",
  },
];

export default function LocalExperts() {
  const brand = useBrand();
  const { city, name, founderPhoto, logo, founderName, founderTitle, aboutText, licenseNumber, rating } = brand;

  const displayFounderName = founderName || `${name} Project Leadership`;
  const displayFounderTitle = founderTitle || "Master Craftsmen & Certified Field Direction";
  const displayAbout =
    aboutText ||
    `Founded on honest craftsmanship and dedicated service across ${city}. Our master roofing crews specialize in hurricane-engineered residential replacements, commercial TPO flat systems, and emergency storm restorations backed by comprehensive manufacturer warranties.`;

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Leadership & Craftsmanship
          </span>
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2 mb-4">
            Meet The Experts Behind {name}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-3xl mx-auto font-serif">
            Dedicated roofing professionals committed to technical excellence, transparent communication, and lifelong protection for your home or commercial building.
          </p>
        </div>

        {/* Featured Leadership Card */}
        <div className="max-w-4xl mx-auto bg-stone-50 border border-stone-200 border-t-4 border-t-crimson p-8 md:p-12 shadow-xl shadow-stone-200/50 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative shrink-0">
              {founderPhoto ? (
                <img
                  src={founderPhoto}
                  alt={displayFounderName}
                  className="w-48 h-48 md:w-56 md:h-56 object-cover object-top border-4 border-white shadow-xl"
                />
              ) : logo ? (
                <div className="w-48 h-48 md:w-56 md:h-56 bg-white border-2 border-stone-200 shadow-lg flex flex-col items-center justify-center p-6 text-center">
                  <img src={logo} alt={name} className="max-h-20 w-auto object-contain mb-3" />
                  <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    {city}
                  </span>
                  <span className="text-[10px] text-crimson font-oswald uppercase tracking-widest font-bold mt-1">
                    Master Roofing Specialist
                  </span>
                </div>
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 bg-stone-200 flex items-center justify-center border-4 border-white shadow-xl">
                  <HardHat className="w-16 h-16 text-zinc-400" />
                </div>
              )}
              <div className="absolute -bottom-3 -right-3 bg-crimson text-white text-xs font-oswald uppercase tracking-wider font-bold px-3 py-1 shadow-md">
                {licenseNumber ? "Verified Contractor" : "Certified Master"}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <h3 className="text-2xl md:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                {displayFounderName}
              </h3>
              <p className="text-crimson font-oswald uppercase tracking-wider text-sm font-semibold">
                {displayFounderTitle}
              </p>
              <p className="text-zinc-700 font-serif leading-relaxed text-sm md:text-base">
                {displayAbout}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-oswald uppercase tracking-wider text-zinc-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{rating || 4.9}★ Verified Customer Satisfaction</span>
                </div>
                {licenseNumber && (
                  <span className="text-xs font-oswald uppercase tracking-wider text-zinc-600 bg-stone-200 px-2.5 py-1 font-medium">
                    {licenseNumber}
                  </span>
                )}
                <span className="text-xs font-oswald uppercase tracking-wider text-zinc-500 font-medium">
                  Serving {city} & Surrounding Counties
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillar Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.label} className="bg-stone-50 border border-stone-200 p-8 text-center transition-all hover:border-crimson hover:shadow-lg">
              <div className="w-14 h-14 bg-crimson/10 text-crimson rounded-full flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2">
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
