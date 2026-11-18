import { motion } from "framer-motion";
import { MapPin, ShieldCheck } from "lucide-react";
import { useBrand, getRegionalSuburbs } from "../BrandContext";

export default function Portfolio() {
  const brand = useBrand();
  const serviceAreas =
    brand.serviceAreas && brand.serviceAreas.length > 0
      ? brand.serviceAreas
      : getRegionalSuburbs(brand.city, brand.state);

  const defaultProjects = [
    {
      title: "Architectural Shingle Replacement",
      location: brand.city,
      img: "/after-roof.jpg",
      scope: "50-Yr GAF Timberline HDZ",
    },
    {
      title: "Severe Storm Recovery & Replacement",
      location: serviceAreas[0] ? `${serviceAreas[0]}, ${brand.state}` : brand.city,
      img: "/before-roof.jpg",
      scope: "Full Decking & Synthetic Barrier",
    },
    {
      title: brand.isCommercial ? "Industrial TPO Flat System" : "Commercial Single-Ply Flat Roof",
      location: serviceAreas[1] ? `${serviceAreas[1]}, ${brand.state}` : brand.city,
      img: "/service-commercial.jpg",
      scope: "60-Mil Heat-Welded Membrane",
    },
    {
      title: "Custom Standing Seam Metal",
      location: serviceAreas[2] ? `${serviceAreas[2]}, ${brand.state}` : brand.city,
      img: "/service-metal.jpg",
      scope: "24-Gauge Concealed Fastener",
    },
    {
      title: "Emergency Leak & Valley Restoration",
      location: serviceAreas[3] ? `${serviceAreas[3]}, ${brand.state}` : brand.city,
      img: "/service-storm.jpg",
      scope: "Rapid Tarping & Lifetime Repair",
    },
    {
      title: "Class 4 Impact Hail Defense",
      location: serviceAreas[4] ? `${serviceAreas[4]}, ${brand.state}` : brand.city,
      img: "/service-shingle.jpg",
      scope: "UL 2218 Insurance Qualified",
    },
  ];

  // Blend in contractor's authentic jobsite drone / field imagery if crawled from domain
  const projects = defaultProjects.map((p, idx) => {
    if (brand.galleryImages && brand.galleryImages[idx]) {
      return {
        ...p,
        img: brand.galleryImages[idx],
        isCrawled: true,
      };
    }
    return { ...p, isCrawled: false };
  });

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
                <div className="overflow-hidden bg-stone-100 h-56 relative">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-oswald uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                    {p.scope}
                  </span>
                  {p.isCrawled && (
                    <span className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-xs text-white text-[10px] font-oswald uppercase tracking-wider font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow-xs">
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
                <span className="text-zinc-400">100% Passed Inspection</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
