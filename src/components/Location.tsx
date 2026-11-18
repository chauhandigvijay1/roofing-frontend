import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { useBrand, getRegionalSuburbs } from "../BrandContext";

export default function Location() {
  const brand = useBrand();

  const mapSrc = useMemo(() => {
    const encoded = encodeURIComponent(brand.city);
    return `https://maps.google.com/maps?q=${encoded}&t=m&z=11&output=embed`;
  }, [brand.city]);

  const serviceAreas =
    brand.serviceAreas && brand.serviceAreas.length > 0
      ? brand.serviceAreas
      : getRegionalSuburbs(brand.city, brand.state);

  return (
    <section id="location" className="py-16 sm:py-20 px-4 sm:px-6 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: Territory Details & Service Areas (6 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
                Local Territory Authority
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2 leading-tight">
                Proudly Serving <span className="text-crimson">{brand.city}</span> & Surrounding Areas
              </h2>
              <div className="w-16 h-1 bg-crimson mt-4 mb-4"></div>
              <p className="text-zinc-600 text-base sm:text-lg font-serif leading-relaxed">
                {brand.name} deploys fully certified, insured roofing crews throughout {brand.city}. Whether you require an emergency leak repair, comprehensive storm damage assessment, or a full turnkey roof replacement, our local dispatch is on call.
              </p>
            </div>

            {/* Service Area Badges */}
            <div>
              <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 block mb-2.5">
                Key Neighborhoods & Suburbs Served:
              </span>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.slice(0, 8).map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-oswald uppercase tracking-wider font-bold text-zinc-700 shadow-2xs hover:border-crimson hover:text-crimson transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-crimson shrink-0" />
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Service Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                <Clock className="w-4 h-4 text-crimson shrink-0" />
                <span className="text-xs font-serif text-zinc-700 font-medium leading-tight">
                  Rapid Emergency Dispatch
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-serif text-zinc-700 font-medium leading-tight">
                  Permit & Code Compliant
                </span>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={`tel:${brand.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102 active:scale-98"
              >
                <Phone className="w-4 h-4" /> Call Direct Dispatch: {brand.phone}
              </a>
              <span className="text-xs text-zinc-500 font-serif text-center sm:text-left">
                Complimentary 21-point on-site diagnostic survey
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Compact High-Definition Google Map (6 Columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 bg-white p-3 sm:p-4 rounded-3xl shadow-md border border-stone-200"
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800">
                  Active Service Radius: 45 Miles
                </span>
              </div>
              <span className="text-xs font-serif text-zinc-500">
                Centered on {brand.city}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 relative">
              <iframe
                title={`Service Area — ${brand.city}`}
                src={mapSrc}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-72 sm:h-80 border-0"
              />
            </div>

            <div className="mt-3 px-2 flex items-center justify-between text-xs font-serif text-zinc-600">
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Licensed & Insured Local Crew
              </span>
              <span className="text-zinc-500">
                On-Site Estimates Available 7 Days/Wk
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
