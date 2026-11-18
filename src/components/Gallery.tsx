import { useState, useMemo } from "react";
import { useBrand, getRegionalSuburbs, formatLocation } from "../BrandContext";
import { ShieldCheck, MapPin } from "lucide-react";

interface GalleryItemData {
  img: string;
  fallbackImg: string;
  title: string;
  tag: string;
  location: string;
  isCustomPhoto: boolean;
}

function GalleryCard({
  item,
  brandName,
  brandLogo,
}: {
  item: GalleryItemData;
  brandName: string;
  brandLogo?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(item.img);
  const [loadFailed, setLoadFailed] = useState(false);

  const handleImageError = () => {
    if (!loadFailed) {
      setLoadFailed(true);
      setCurrentSrc(item.fallbackImg);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 bg-stone-50 flex flex-col justify-between">
      <div className="relative h-64 overflow-hidden bg-stone-900">
        <img
          loading="lazy"
          decoding="async"
          src={currentSrc}
          alt={item.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Overlay: Verified Contractor Logo / Proof Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {brandLogo ? (
            <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-stone-200/60 max-w-[160px]">
              <img
                src={brandLogo}
                alt={brandName}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                className="w-4 h-4 object-contain shrink-0"
              />
              <span className="text-[10px] font-oswald uppercase font-bold text-zinc-800 truncate">
                {brandName}
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
  );
}

export default function Gallery() {
  const brand = useBrand();
  const serviceAreas =
    brand.serviceAreas && brand.serviceAreas.length > 0
      ? brand.serviceAreas
      : getRegionalSuburbs(brand.city, brand.state);

  const fallbackImages = useMemo(
    () => [
      {
        img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_1202910862-1920w.jpg",
        title: "Storm Leak & Structural Restoration",
        tag: "Architectural Shingles",
        location: brand.city,
      },
      {
        img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_1231407160-1920w.jpg",
        title: "Complete Precision Tear-Off & Shingle System",
        tag: "50-Year Warranty",
        location: serviceAreas[0] ? formatLocation(serviceAreas[0], brand.state) : brand.city,
      },
      {
        img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_2447926003-1920w.jpg",
        title: "Standing Seam Architectural Metal",
        tag: "High-Tensile Metal",
        location: serviceAreas[1] ? formatLocation(serviceAreas[1], brand.state) : brand.city,
      },
      {
        img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_2467902073-1920w.jpg",
        title: brand.isCommercial
          ? "Commercial Single-Ply TPO Installation"
          : "Commercial & Residential Flat Roof",
        tag: "Cool Roof TPO",
        location: serviceAreas[2] ? formatLocation(serviceAreas[2], brand.state) : brand.city,
      },
    ],
    [brand.city, brand.state, brand.isCommercial, serviceAreas]
  );

  // Filter out any crawled images that are logos, icons, seals, badges, or social media icons
  const cleanCrawledPhotos = useMemo(() => {
    if (!brand.galleryImages || brand.galleryImages.length === 0) return [];
    const bannedPatterns = [
      "logo",
      "icon",
      "seal",
      "badge",
      "award",
      "bbb",
      "banner",
      "header",
      "member",
      "wpconsent",
      "facebook",
      "twitter",
      "instagram",
      "youtube",
      "wp-includes",
      "avatar",
      "lockup",
      "ommuniti",
      "chamber",
    ];
    return brand.galleryImages.filter((url) => {
      if (!url || typeof url !== "string") return false;
      const lower = url.toLowerCase();
      return !bannedPatterns.some((pattern) => lower.includes(pattern));
    });
  }, [brand.galleryImages]);

  const items: GalleryItemData[] = useMemo(() => {
    return fallbackImages.map((fallback, idx) => {
      const customPhoto = cleanCrawledPhotos[idx];
      return {
        img: customPhoto || fallback.img,
        fallbackImg: fallback.img,
        title: fallback.title,
        tag: fallback.tag,
        location: fallback.location,
        isCustomPhoto: Boolean(customPhoto),
      };
    });
  }, [fallbackImages, cleanCrawledPhotos]);

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
            <GalleryCard
              key={`${item.title}-${idx}`}
              item={item}
              brandName={brand.name}
              brandLogo={brand.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
