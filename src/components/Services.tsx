import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useBrand } from "../BrandContext";

interface ServiceItem {
  slug: string;
  title: string;
  desc: string;
  img: string;
  fallbackImg: string;
  tag: string;
  isRealPhoto?: boolean;
}

function ServiceCard({ s, brandName, search }: { s: ServiceItem; brandName: string; search: string }) {
  const [currentImg, setCurrentImg] = useState(s.img);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = () => {
    if (!imgFailed) {
      setImgFailed(true);
      setCurrentImg(s.fallbackImg);
    }
  };

  const showRealBadge = s.isRealPhoto && !imgFailed;

  return (
    <div className="bg-white overflow-hidden shadow-lg border-t-4 border-t-crimson transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between group rounded-b-2xl">
      <Link
        to={{ pathname: `/services/${s.slug}`, search }}
        className="block relative h-52 overflow-hidden bg-stone-900 cursor-pointer"
      >
        <img
          loading="lazy"
          src={currentImg}
          alt={s.title}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm text-white text-[10px] font-oswald uppercase tracking-wider font-bold px-2.5 py-1 shadow">
          {s.tag}
        </span>
        {showRealBadge && (
          <span className="absolute bottom-2.5 left-2.5 bg-zinc-950/85 backdrop-blur-xs text-white text-[9.5px] font-oswald uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 border border-white/10 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Jobsite Drone Photo &bull; {brandName}
          </span>
        )}
      </Link>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link to={{ pathname: `/services/${s.slug}`, search }}>
            <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2 hover:text-crimson transition-colors leading-snug">
              {s.title}
            </h3>
          </Link>
          <p className="text-zinc-600 text-sm leading-relaxed font-serif">{s.desc}</p>
        </div>
        <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <Link
            to={{ pathname: `/services/${s.slug}`, search }}
            className="inline-flex items-center gap-1.5 text-crimson hover:text-crimson-dark font-oswald uppercase tracking-wider font-bold text-xs transition-colors"
          >
            Explore Service Scope <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="#estimate"
            className="text-[11px] font-oswald uppercase tracking-wider font-medium text-zinc-400 hover:text-zinc-800 transition-colors"
          >
            Instant Estimate ↓
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const brand = useBrand();
  const { search } = useLocation();

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

  const finalServices = useMemo(() => {
    // If structured services exist
    if (brand.structuredServices && brand.structuredServices.length > 0) {
      return brand.structuredServices.map((svc, idx) => {
        let tag = "Certified Trade";
        let fallbackImg = "/service-shingle.jpg";
        const slug = svc.slug || "residential";

        if (slug === "commercial" || slug === "coatings") {
          tag = "Commercial Division";
          fallbackImg = "/service-commercial.jpg";
        } else if (slug === "metal") {
          tag = "Architectural Metal";
          fallbackImg = "/service-metal.jpg";
        } else if (slug === "storm-damage" || slug === "wind-mitigation") {
          tag = "Insurance Restoration";
          fallbackImg = "/service-storm.jpg";
        } else if (slug === "repair") {
          tag = "24/7 Rapid Dispatch";
          fallbackImg = "/service-repair.jpg";
        } else if (slug === "gutters" || slug === "drainage") {
          tag = "Drainage Systems";
          fallbackImg = "/service-gutters.jpg";
        }

        // Only assign distinct photo to distinct card
        const customPhoto = cleanCrawledPhotos[idx];
        const img = customPhoto || fallbackImg;
        const isRealPhoto = Boolean(customPhoto);

        return {
          slug,
          title: svc.title,
          desc: `Precision craftsmanship and verified installations for ${svc.title.toLowerCase()} across ${brand.city}. Backed by certified manufacturer warranties.`,
          img,
          fallbackImg,
          tag,
          isRealPhoto,
        };
      });
    }

    const baselineList: Array<{ slug: string; title: string; desc: string; fallbackImg: string; tag: string }> = brand.isCommercial
      ? [
          {
            slug: "commercial",
            title: "Commercial TPO & Single-Ply Roofing",
            desc: "Heat-welded 60-mil and 80-mil TPO membrane systems engineered for superior puncture resistance and zero-leak ponding water drainage.",
            fallbackImg: "/service-commercial.jpg",
            tag: "Commercial Authority",
          },
          {
            slug: "repair",
            title: "24/7 Priority Emergency Leak Response",
            desc: "Immediate on-site diagnostic dispatch and rapid structural leak stops for active commercial and retail facilities.",
            fallbackImg: "/service-repair.jpg",
            tag: "Emergency Dispatch",
          },
          {
            slug: "coatings",
            title: "Commercial Silicone Roof Coatings",
            desc: "Seamless liquid-applied silicone restoration membranes providing 20-year leak protection at a fraction of full tear-off costs.",
            fallbackImg: "/service-storm.jpg",
            tag: "Restoration Coating",
          },
          {
            slug: "metal",
            title: "Industrial Standing Seam Metal",
            desc: "Heavy-gauge mechanical lock standing seam roofing systems designed for maximum wind uplift ratings and long-term durability.",
            fallbackImg: "/service-metal.jpg",
            tag: "High-Tensile Metal",
          },
          {
            slug: "maintenance",
            title: "Preventative Roof Asset Management",
            desc: "Biannual commercial roof surveys, drain clearing, core sampling, and thermal imaging to guarantee NDL warranty compliance.",
            fallbackImg: "/service-shingle.jpg",
            tag: "Asset Protection",
          },
          {
            slug: "drainage",
            title: "Commercial Scuppers & Internal Drains",
            desc: "Heavy-duty commercial guttering, overflow scuppers, and downspout systems engineered for high-volume rainfall.",
            fallbackImg: "/service-gutters.jpg",
            tag: "Drainage Systems",
          },
        ]
      : brand.state === "FL"
      ? [
          {
            slug: "wind-mitigation",
            title: "Florida Wind Mitigation Inspections",
            desc: "Certified inspection forms verifying hurricane clips and secondary water barriers, saving homeowners $500 to $1,200/yr on insurance.",
            fallbackImg: "/service-storm.jpg",
            tag: "Statutory Savings",
          },
          {
            slug: "residential",
            title: "140+ MPH Hurricane Shingle Replacement",
            desc: "Class 4 impact, high-wind fastening architectural shingles engineered to withstand coastal tropical humidity and severe gusts.",
            fallbackImg: "/service-shingle.jpg",
            tag: "Hurricane Engineered",
          },
          {
            slug: "repair",
            title: "Emergency Storm Damage & Leak Tarping",
            desc: "Immediate 24/7 post-storm emergency dispatch, thorough photo documentation for insurance adjusters, and watertight structural tarping.",
            fallbackImg: "/service-repair.jpg",
            tag: "24/7 Rapid Response",
          },
          {
            slug: "metal",
            title: "Engineered Standing Seam Metal Roofing",
            desc: "Ultra-resilient European and domestic steel profiles with marine-grade fasteners for premier coastal longevity.",
            fallbackImg: "/service-metal.jpg",
            tag: "Coastal Durability",
          },
          {
            slug: "commercial",
            title: "Commercial Low-Slope & Flat TPO",
            desc: "Energy-efficient cool roof membranes reflecting solar radiation and slashing AC cooling costs.",
            fallbackImg: "/service-commercial.jpg",
            tag: "Commercial Scope",
          },
          {
            slug: "gutters",
            title: "Seamless High-Capacity Gutters",
            desc: "Heavy-gauge 6-inch seamless aluminum gutters and custom leaf protection guards designed for torrential Florida downpours.",
            fallbackImg: "/service-gutters.jpg",
            tag: "High-Capacity Drainage",
          },
        ]
      : [
          {
            slug: "residential",
            title: "Architectural Shingle Replacement",
            desc: "Full tear-off and installation backed by non-prorated lifetime manufacturer warranties and precision nail placement.",
            fallbackImg: "/service-shingle.jpg",
            tag: "Lifetime Warranty",
          },
          {
            slug: "repair",
            title: "24/7 Emergency Storm Leak Repair",
            desc: "Rapid-response tarping, emergency valley sealing, and flashing repairs to protect your home's structural integrity.",
            fallbackImg: "/service-repair.jpg",
            tag: "24/7 Priority",
          },
          {
            slug: "storm-damage",
            title: "Hail & Windstorm Restoration",
            desc: "Comprehensive 21-point roof inspection and insurance claim assistance with 100% transparency and honest estimates.",
            fallbackImg: "/service-storm.jpg",
            tag: "Insurance Scoping",
          },
          {
            slug: "metal",
            title: "Standing Seam Designer Metal",
            desc: "Ultra-durable, heat-reflective standing seam metal systems designed for extreme temperature fluctuations and high winds.",
            fallbackImg: "/service-metal.jpg",
            tag: "Maximum Durability",
          },
          {
            slug: "commercial",
            title: "Commercial Flat Roof Systems",
            desc: "TPO, PVC, and modified bitumen installations for commercial, retail, and multi-family properties.",
            fallbackImg: "/service-commercial.jpg",
            tag: "Commercial Grade",
          },
          {
            slug: "gutters",
            title: "Seamless Gutters & Attic Ventilation",
            desc: "Balanced thermodynamic attic ventilation and custom seamless aluminum gutter systems.",
            fallbackImg: "/service-gutters.jpg",
            tag: "Ventilation & Drainage",
          },
        ];

    return baselineList.map((s, idx) => {
      const customPhoto = cleanCrawledPhotos[idx];
      return {
        ...s,
        img: customPhoto || s.fallbackImg,
        isRealPhoto: Boolean(customPhoto),
      };
    });
  }, [
    brand.structuredServices,
    cleanCrawledPhotos,
    brand.isCommercial,
    brand.state,
    brand.city,
  ]);

  return (
    <section id="services" className="py-24 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Certified Trade Specialties
          </span>
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Roofing Solutions Tailored for {brand.city}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif">
            From emergency storm response to comprehensive commercial and residential replacements, {brand.name} delivers precision engineering and guaranteed workmanship.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finalServices.map((s) => (
            <ServiceCard
              key={s.slug}
              s={s}
              brandName={brand.name}
              search={search}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
