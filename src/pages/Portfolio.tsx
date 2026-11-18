import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Calendar, Phone, Calculator } from "lucide-react";
import { useBrand, getRegionalSuburbs, formatLocation } from "../BrandContext";
import BookingModal from "../components/BookingModal";
import EstimateWizard from "../components/EstimateWizard";

export default function Portfolio() {
  const brand = useBrand();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const serviceAreas =
    brand.serviceAreas && brand.serviceAreas.length > 0
      ? brand.serviceAreas
      : getRegionalSuburbs(brand.city, brand.state);

  const defaultProjects = useMemo(
    () => [
      {
        title: "Architectural Shingle Replacement",
        location: brand.city,
        fallbackImg: "/service-shingle.jpg",
        scope: "50-Yr GAF Timberline HDZ",
      },
      {
        title: "Severe Storm Recovery & Replacement",
        location: serviceAreas[0] ? formatLocation(serviceAreas[0], brand.state) : brand.city,
        fallbackImg: "/service-storm.jpg",
        scope: "Full Decking & Synthetic Barrier",
      },
      {
        title: brand.isCommercial ? "Industrial TPO Flat System" : "Commercial Single-Ply Flat Roof",
        location: serviceAreas[1] ? formatLocation(serviceAreas[1], brand.state) : brand.city,
        fallbackImg: "/service-commercial.jpg",
        scope: "60-Mil Heat-Welded Membrane",
      },
      {
        title: "Custom Standing Seam Metal",
        location: serviceAreas[2] ? formatLocation(serviceAreas[2], brand.state) : brand.city,
        fallbackImg: "/service-metal.jpg",
        scope: "24-Gauge Concealed Fastener",
      },
      {
        title: "Emergency Leak & Valley Restoration",
        location: serviceAreas[3] ? formatLocation(serviceAreas[3], brand.state) : brand.city,
        fallbackImg: "/service-repair.jpg",
        scope: "Rapid Tarping & Lifetime Repair",
      },
      {
        title: "Class 4 Impact Hail Defense",
        location: serviceAreas[4] ? formatLocation(serviceAreas[4], brand.state) : brand.city,
        fallbackImg: "/why-choose-us.jpg",
        scope: "UL 2218 Insurance Qualified",
      },
    ],
    [brand.city, brand.state, brand.isCommercial, serviceAreas]
  );

  const projects = useMemo(() => {
    const crawledPhotos = brand.galleryImages || [];
    const usedPhotos = new Set<string>();
    let crawledIdx = 0;

    return defaultProjects.map((p) => {
      let customPhoto: string | undefined;

      while (crawledIdx < crawledPhotos.length) {
        const candidate = crawledPhotos[crawledIdx++];
        if (candidate && !usedPhotos.has(candidate)) {
          customPhoto = candidate;
          usedPhotos.add(candidate);
          break;
        }
      }

      return {
        ...p,
        img: customPhoto || p.fallbackImg,
        isCrawled: Boolean(customPhoto),
      };
    });
  }, [defaultProjects, brand.galleryImages]);

  return (
    <>
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-stone-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Architectural Project Gallery
            </span>
            <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
              Completed Projects by {brand.name}
            </h1>
            <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-6"></div>
            <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif leading-relaxed">
              Every project tells a story of craftsmanship. Here is a curated selection of residential replacements and commercial systems completed across the greater {brand.city} metropolitan area.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-stone-200 border-t-4 border-t-crimson transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden bg-stone-900 h-56 relative">
                    <img
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      src={p.img}
                      alt={p.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = p.fallbackImg;
                        const badge = target.parentElement?.querySelector(".jobsite-photo-badge");
                        if (badge) (badge as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-oswald uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                      {p.scope}
                    </span>
                    {p.isCrawled && (
                      <span className="jobsite-photo-badge absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] font-oswald uppercase tracking-wider font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Field Jobsite Photo &bull; {brand.name}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-1.5">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-sans mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-crimson shrink-0" />
                      <span>{p.location}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans">
                      Turnkey project certified by {brand.name}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-emerald-700">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Manufacturer Warranty
                  </span>
                  <span className="text-zinc-400">Verified Craftsmanship</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Executive CTA Box */}
          <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center">
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Ready to Upgrade Your Roof?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
              Schedule Your Free 21-Point Inspection in {brand.city}
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto font-serif mt-2 mb-8">
              Complimentary high-definition drone roof scan, attic moisture survey, and itemized scope with {brand.name}. Zero deposit required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" /> Book Free Inspection Window
              </button>
              <a
                href={`tel:${brand.phone}`}
                className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-zinc-900 py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm border border-stone-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-crimson" /> Call: {brand.phone}
              </a>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{isCalculatorOpen ? "Hide Cost Studio ▲" : "Launch Cost Calculator ▼"}</span>
              </button>
            </div>

            {isCalculatorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-12 text-left pt-8 border-t border-stone-200"
              >
                <EstimateWizard />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService="Portfolio Project Consultation & Free Drone Inspection"
      />
    </>
  );
}
