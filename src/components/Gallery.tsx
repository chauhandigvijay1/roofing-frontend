import { useMemo } from "react";
import { useBrand, getRegionalSuburbs, formatLocation } from "../BrandContext";
import { ShieldCheck, MapPin } from "lucide-react";

export default function Gallery() {
  const brand = useBrand();
  const serviceAreas =
    brand.serviceAreas && brand.serviceAreas.length > 0
      ? brand.serviceAreas
      : getRegionalSuburbs(brand.city, brand.state);

  const fallbackImages = useMemo(
    () => [
      {
        fallbackImg: "/service-storm.jpg",
        title: "Storm Leak & Structural Restoration",
        tag: "Insurance Scoping",
        location: brand.city,
      },
      {
        fallbackImg: "/service-shingle.jpg",
        title: "Complete Precision Tear-Off & Shingle System",
        tag: "50-Year Warranty",
        location: serviceAreas[0] ? formatLocation(serviceAreas[0], brand.state) : brand.city,
      },
      {
        fallbackImg: "/service-metal.jpg",
        title: "Standing Seam Architectural Metal",
        tag: "High-Tensile Metal",
        location: serviceAreas[1] ? formatLocation(serviceAreas[1], brand.state) : brand.city,
      },
      {
        fallbackImg: "/service-commercial.jpg",
        title: brand.isCommercial
          ? "Commercial Single-Ply TPO Installation"
          : "Commercial & Residential Flat Roof",
        tag: "Cool Roof TPO",
        location: serviceAreas[2] ? formatLocation(serviceAreas[2], brand.state) : brand.city,
      },
    ],
    [brand.city, brand.state, brand.isCommercial, serviceAreas]
  );

  // Blend in real crawled contractor photos without duplicate repetition
  const items = useMemo(() => {
    const crawledPhotos = brand.galleryImages || [];
    const usedPhotos = new Set<string>();
    let crawledIdx = 0;

    return fallbackImages.map((fallback) => {
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
        img: customPhoto || fallback.fallbackImg,
        fallbackImg: fallback.fallbackImg,
        title: fallback.title,
        tag: fallback.tag,
        location: fallback.location,
        isCustomPhoto: Boolean(customPhoto),
      };
    });
  }, [fallbackImages, brand.galleryImages]);

  return (
    <section id="gallery" className="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Project Showcase &bull; {brand.city}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Completed Project Transformations by {brand.name}
          </h2>
          <div className="w-14 h-1 bg-crimson mx-auto mt-3 mb-5"></div>
          <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-serif leading-relaxed">
            Authentic craftsmanship and verified transformations across {brand.city} and surrounding communities. Every installation is backed by certified manufacturer warranties and lifetime leak-free craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="group overflow-hidden rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 bg-stone-50 flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-stone-900">
                <img
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  src={item.img}
                  alt={item.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = item.fallbackImg;
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Top Overlay: Verified Contractor Logo / Proof Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {brand.logo ? (
                    <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-stone-200/60 max-w-[160px]">
                      <img
                        referrerPolicy="no-referrer"
                        src={brand.logo}
                        alt={brand.name}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="text-[10px] font-oswald uppercase font-bold text-zinc-800 truncate">
                        {brand.name}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-zinc-950/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-[10px] font-oswald uppercase tracking-wider font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Certified Project</span>
                    </div>
                  )}

                  <span className="bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-oswald uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Gradient Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-white font-oswald uppercase tracking-wider font-bold text-sm sm:text-base leading-snug">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-300 font-sans mt-1">
                    <MapPin className="w-3 h-3 text-crimson shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-zinc-500">
                <span>Verified Installation</span>
                <span className="text-emerald-700 font-medium">Lifetime Warranty</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
