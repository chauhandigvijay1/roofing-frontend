import { motion } from "framer-motion";
import { MapPin, Phone, ShieldCheck, Clock } from "lucide-react";
import { useBrand, getRegionalSuburbs, formatLocation } from "../BrandContext";

export default function Locations() {
  const brand = useBrand();
  const serviceAreas =
    brand.serviceAreas && brand.serviceAreas.length > 0
      ? brand.serviceAreas
      : getRegionalSuburbs(brand.city, brand.state);

  return (
    <section className="pt-36 pb-24 px-6 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Verified Service Territories
          </span>
          <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Areas We Proudly Serve
          </h1>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-6"></div>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif leading-relaxed">
            {brand.name} provides certified residential roof replacements, commercial TPO systems, and rapid emergency dispatch across the greater {brand.city} metropolitan area.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceAreas.map((area, idx) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white p-6 border border-stone-200 border-t-4 border-t-crimson shadow-sm hover:shadow-xl transition-all rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-crimson/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-crimson" />
                  </div>
                  <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 leading-snug">
                    {formatLocation(area, brand.state)}
                  </h3>
                </div>

                <div className="space-y-1.5 mb-5 text-xs text-zinc-600 font-serif">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Under 2-hour priority dispatch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full manufacturer warranty coverage</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`tel:${brand.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-oswald uppercase tracking-wider font-bold text-crimson hover:text-crimson-dark transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{brand.phone}</span>
                </a>
                <span className="text-[10px] font-oswald uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Active Hub
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
