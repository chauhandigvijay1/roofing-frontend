import { useBrand } from "../BrandContext";
import { Shield, HardHat, Heart } from "lucide-react";

const values = [
  { icon: Shield, label: "Community Trusted", desc: "Decades of serving local families." },
  { icon: HardHat, label: "Expert Craftsmanship", desc: "Certified and continuously trained." },
  { icon: Heart, label: "Neighborhood Pride", desc: "We live and work right here." },
];

export default function LocalExperts() {
  const brand = useBrand();
  const { city, name, isDrew, isRichard, founderPhoto, gafBadge, txstBadge, bbbBadge, haaBadge, taaBadge } = brand;

  if (isDrew) {
    return (
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">
              Meet Drew Boy & The Instant Roofing Team
            </h2>
            <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
            <p className="text-zinc-600 text-lg max-w-3xl mx-auto font-serif">
              Founded by Drew Boy, holding a Master of Science in Technology Management & Building Science from Texas State University. Over 15 years carrying forward a multi-generational Central Texas roofing legacy.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-stone-50 border border-stone-200 border-t-4 border-t-crimson p-8 md:p-12 shadow-xl shadow-stone-200/50">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative shrink-0">
                {founderPhoto ? (
                  <img
                    src={founderPhoto}
                    alt="Drew Boy - Founder & Master Craftsman"
                    className="w-48 h-48 md:w-56 md:h-56 object-cover object-top border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-48 h-48 bg-stone-200 flex items-center justify-center">
                    <HardHat className="w-16 h-16 text-zinc-400" />
                  </div>
                )}
                <div className="absolute -bottom-3 -right-3 bg-crimson text-white text-xs font-oswald uppercase tracking-wider font-bold px-3 py-1 shadow-md">
                  Building Science MS
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-2xl md:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Drew Boy
                </h3>
                <p className="text-crimson font-oswald uppercase tracking-wider text-sm font-semibold">
                  Founder & Master Craftsman (MS Building Science, Texas State)
                </p>
                <p className="text-zinc-700 font-serif leading-relaxed text-sm md:text-base">
                  Combining forensic attic ventilation analysis, thermal load modeling, and certified GAF roofing systems. Every replacement in Austin is engineered beyond minimum building codes to withstand intense Central Texas UV, wind, and hail.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 border-t border-stone-200">
                  {gafBadge && (
                    <img
                      src={gafBadge}
                      alt="GAF Certified Plus"
                      className="h-12 object-contain"
                    />
                  )}
                  {txstBadge && (
                    <img
                      src={txstBadge}
                      alt="Texas State Alumni"
                      className="h-10 object-contain rounded"
                    />
                  )}
                  <span className="text-xs font-oswald uppercase tracking-wider text-zinc-500 font-medium">
                    100% Texas HB 2102 Deductible Compliant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isRichard) {
    return (
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">
              Meet Richard, David & The Paramount Roofing Team
            </h2>
            <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
            <p className="text-zinc-600 text-lg max-w-3xl mx-auto font-serif">
              Founded in 1995 by Richard W. Keathley and David, Paramount Roofing Inc. has provided 31+ years of honest craftsmanship across Greater Houston. &ldquo;Promises Made. Promises Kept.&rdquo; Built on equal partnership, zero high-pressure sales teams, and fully insured crews spanning two generations.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-stone-50 border border-stone-200 border-t-4 border-t-crimson p-8 md:p-12 shadow-xl shadow-stone-200/50">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative shrink-0">
                <div className="w-48 h-48 bg-stone-900 border-4 border-white shadow-xl flex items-center justify-center p-4">
                  <img
                    src="https://paramountroofing.com/wp-content/uploads/2021/06/Residential-Roofing-Houston-White-01-1024x372.png"
                    alt="Paramount Roofing Inc."
                    className="max-h-24 object-contain"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-crimson text-white text-xs font-oswald uppercase tracking-wider font-bold px-3 py-1 shadow-md">
                  Since 1995
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-2xl md:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Richard W. Keathley & David
                </h3>
                <p className="text-crimson font-oswald uppercase tracking-wider text-sm font-semibold">
                  Co-Owners & Founders | Paramount Roofing Inc.
                </p>
                <p className="text-zinc-700 font-serif leading-relaxed text-sm md:text-base">
                  Combining high-tensile commercial TPO, modified bitumen, and impact-resistant residential architectural shingles engineered specifically for Gulf Coast tropical humidity, severe wind storms, and heavy coastal rain.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 border-t border-stone-200">
                  {bbbBadge && (
                    <img src={bbbBadge} alt="BBB Accredited" className="h-10 object-contain" />
                  )}
                  {haaBadge && (
                    <img src={haaBadge} alt="Houston Apartment Association" className="h-10 object-contain" />
                  )}
                  {taaBadge && (
                    <img src={taaBadge} alt="Texas Apartment Association" className="h-10 object-contain" />
                  )}
                  <span className="text-xs font-oswald uppercase tracking-wider text-zinc-500 font-medium">
                    Fully Insured & Texas Windstorm Certified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">
            Meet the {name} Crew
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif">
            We&apos;re not just contractors — we&apos;re your neighbors in {city}. Every roof we build
            strengthens the community we call home.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {values.map((v) => (
            <div
              key={v.label}
              className="bg-stone-50 p-8 border border-stone-200 border-t-4 border-t-crimson hover:shadow-xl hover:shadow-stone-200/50 transition-shadow transform-gpu will-change-transform"
            >
              <div className="w-14 h-14 bg-crimson/10 flex items-center justify-center mx-auto mb-5">
                <v.icon className="w-7 h-7 text-crimson" />
              </div>
              <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2">{v.label}</h3>
              <p className="text-zinc-600 text-sm font-serif">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
