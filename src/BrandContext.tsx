import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";

export interface Brand {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  domain?: string;
  logo?: string;
  founderPhoto?: string;
  founderName?: string;
  founderTitle?: string;
  tagline?: string;
  aboutText?: string;
  licenseNumber?: string;
  rating?: number;
  reviewsCount?: number;
  yearsInBusiness?: number;
  services?: string[];
  serviceAreas?: string[];
  reviews?: Array<{
    author: string;
    text: string;
    rating?: number;
    location?: string;
    project?: string;
    timeAgo?: string;
  }>;
  galleryImages?: string[];
  structuredServices?: Array<{
    title: string;
    slug: string;
    desc: string;
    archetype?: string;
  }>;
  isCommercial?: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://roofing-backend-n688.onrender.com";

/**
 * Multi-pass recursive HTML entity decoder.
 * Handles double-encoded entities (e.g. &amp;amp; -> &amp; -> &).
 */
export function decodeHtmlEntities(str?: string | null): string {
  if (!str) return "";
  let res = String(str);
  for (let i = 0; i < 4; i++) {
    if (!/&[a-zA-Z0-9#]+;/.test(res)) break;
    res = res
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&nbsp;/gi, " ")
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  return res.trim();
}

export function formatLocation(loc: string, state: string): string {
  if (!loc) return "";
  let clean = loc.trim();
  if (state) {
    clean = clean.replace(new RegExp(`,\\s*${state}\\s*,\\s*${state}$`, "i"), `, ${state}`);
    clean = clean.replace(new RegExp(`\\s+${state}\\s*,\\s*${state}$`, "i"), `, ${state}`);
    if (new RegExp(`,\\s*${state}$`, "i").test(clean)) {
      return clean;
    }
    if (clean.toLowerCase().includes(state.toLowerCase())) {
      return clean;
    }
    return `${clean}, ${state}`;
  }
  return clean;
}

export function getRegionalSuburbs(city: string, state: string): string[] {
  const normCity = (city || "").toLowerCase();

  if (normCity.includes("austin")) {
    return ["Round Rock", "Cedar Park", "Georgetown", "Pflugerville", "Lakeway", "Buda", "Kyle", "Leander"];
  }
  if (normCity.includes("dallas") || normCity.includes("fort worth") || normCity.includes("dfw") || normCity.includes("plano") || normCity.includes("frisco") || normCity.includes("grapevine")) {
    return ["Grapevine", "Plano", "Frisco", "McKinney", "Arlington", "Irving", "Garland", "Richardson"];
  }
  if (normCity.includes("houston")) {
    return ["The Woodlands", "Sugar Land", "Katy", "Pearland", "Cypress", "Spring", "Pasadena", "Conroe"];
  }
  if (normCity.includes("san antonio")) {
    return ["New Braunfels", "Schertz", "Boerne", "Cibolo", "Converse", "Universal City", "Alamo Heights", "Seguin"];
  }
  if (normCity.includes("jacksonville")) {
    return ["St. Augustine", "Orange Park", "Ponte Vedra Beach", "Fleming Island", "Atlantic Beach", "Jacksonville Beach", "Nocatee", "Yulee"];
  }
  if (normCity.includes("tampa") || normCity.includes("st. petersburg") || normCity.includes("clearwater") || normCity.includes("seminole")) {
    return ["Seminole", "St. Petersburg", "Clearwater", "Brandon", "Riverview", "Largo", "Dunedin", "Palm Harbor"];
  }
  if (normCity.includes("orlando")) {
    return ["Winter Park", "Kissimmee", "Sanford", "Altamonte Springs", "Oviedo", "Winter Garden", "Clermont", "Lake Mary"];
  }
  if (normCity.includes("miami") || normCity.includes("fort lauderdale") || normCity.includes("naples")) {
    return ["Naples", "Marco Island", "Bonita Springs", "Estero", "Fort Myers", "Cape Coral", "Immokalee", "Golden Gate"];
  }
  if (normCity.includes("denver")) {
    return ["Aurora", "Lakewood", "Littleton", "Centennial", "Boulder", "Thornton", "Arvada", "Highlands Ranch"];
  }
  if (normCity.includes("phoenix") || normCity.includes("scottsdale") || normCity.includes("tempe")) {
    return ["Tempe", "Scottsdale", "Mesa", "Chandler", "Gilbert", "Glendale", "Peoria", "Surprise"];
  }
  if (normCity.includes("atlanta") || normCity.includes("alpharetta")) {
    return ["Alpharetta", "Roswell", "Johns Creek", "Milton", "Sandy Springs", "Marietta", "Duluth", "Dunwoody"];
  }
  if (normCity.includes("nashville") || normCity.includes("gallatin")) {
    return ["Gallatin", "Hendersonville", "Franklin", "Brentwood", "Murfreesboro", "Mt. Juliet", "Lebanon", "Goodlettsville"];
  }
  if (normCity.includes("perris") || normCity.includes("riverside")) {
    return ["Perris", "Riverside", "Moreno Valley", "Corona", "Menifee", "Murrieta", "Temecula", "Lake Elsinore"];
  }

  const baseName = (city || "Metro").split(",")[0].trim();
  const st = state ? ` ${state}` : "";
  return [
    `${baseName} Central${st}`,
    `North ${baseName}`,
    `South ${baseName}`,
    `East ${baseName}`,
    `West ${baseName}`,
    `Greater ${baseName} Area`,
    `${baseName} Heights`,
    `${baseName} Valley`,
  ];
}

function extractState(cityStr: string): string {
  if (!cityStr) return "";
  const match = cityStr.match(/,\s*([A-Za-z]{2})\b/);
  return match ? match[1].toUpperCase() : "";
}

function extractDomain(email: string, domainParam: string, nameParam?: string): string {
  if (domainParam) {
    return domainParam.trim().toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  }
  if (email && email.includes("@")) {
    const domain = email.split("@")[1].trim().toLowerCase();
    const commonMailHosts = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com"];
    if (!commonMailHosts.includes(domain)) {
      return domain;
    }
  }
  if (nameParam) {
    const norm = nameParam.toLowerCase();
    if (norm.includes("worleybyrd") || norm.includes("worley byrd")) return "worleybyrdroofing.com";
  }
  return "";
}

const defaultBrand: Brand = {
  name: "Premium Roofing",
  phone: "(800) 555-ROOF",
  email: "service@premiumroofing.com",
  city: "Dallas, TX",
  state: "TX",
  tagline: "Promises Made. Promises Kept. Commercial & Residential Roofing Authority.",
  aboutText: "Providing certified residential replacements, commercial TPO installations, and 24/7 storm restorations backed by lifetime manufacturer warranties.",
  rating: 4.9,
  reviewsCount: 48,
  yearsInBusiness: 20,
  services: [
    "Commercial TPO & Single-Ply Flat Systems",
    "Architectural Shingle Lifetime Systems",
    "Standing Seam Metal Roofing",
    "24/7 Emergency Storm Damage & Leak Tarping",
    "Thermal Drone Roof & Attic Diagnostic Survey",
  ],
  serviceAreas: [
    "Plano",
    "Frisco",
    "McKinney",
    "Arlington",
    "Irving",
    "Garland",
    "Richardson",
    "Carrollton",
  ],
  isCommercial: false,
};

/**
 * Verified Directory - EXCLUSIVELY for WorleyByrd Roofing & Restoration.
 * As explicitly instructed: Only WorleyByrd has the special vanity URL.
 * Pre-loaded with authentic DJI drone photography from worleybyrdroofing.com.
 */
export const VERIFIED_DIRECTORY: Record<string, Partial<Brand>> = {
  "worleybyrd": {
    name: "WorleyByrd Roofing & Restoration",
    domain: "worleybyrdroofing.com",
    founderName: "Nathan Worley",
    founderTitle: "Founder & Managing Partner",
    phone: "(512) 216-8202",
    email: "Amber.Fowler@WorleyByrdRoofing.com",
    city: "Austin, TX",
    state: "TX",
    isCommercial: true,
    tagline: "Central Texas Commercial TPO & Architectural Roof Restoration Authority",
    aboutText: "WorleyByrd Roofing & Restoration is an Austin-based commercial and residential roofing authority founded by Nathan Worley and Eric Worley. We engineer precision TPO flat roofs, standing seam metal systems, and hurricane-rated shingle replacements backed by comprehensive non-prorated warranties.",
    galleryImages: [
      "https://worleybyrdroofing.com/wp-content/uploads/2025/04/DJI_0485-e1743594912860.webp",
      "https://worleybyrdroofing.com/wp-content/uploads/2025/04/DJI_0519-e1743592444811.webp",
      "https://worleybyrdroofing.com/wp-content/uploads/2023/02/DJI_0533-e1743592580422.jpg",
    ],
  },
  "worleybyrdroofing.com": {
    name: "WorleyByrd Roofing & Restoration",
    domain: "worleybyrdroofing.com",
    founderName: "Nathan Worley",
    founderTitle: "Founder & Managing Partner",
    phone: "(512) 216-8202",
    email: "Amber.Fowler@WorleyByrdRoofing.com",
    city: "Austin, TX",
    state: "TX",
    isCommercial: true,
    tagline: "Central Texas Commercial TPO & Architectural Roof Restoration Authority",
    aboutText: "WorleyByrd Roofing & Restoration is an Austin-based commercial and residential roofing authority founded by Nathan Worley and Eric Worley. We engineer precision TPO flat roofs, standing seam metal systems, and hurricane-rated shingle replacements backed by comprehensive non-prorated warranties.",
    galleryImages: [
      "https://worleybyrdroofing.com/wp-content/uploads/2025/04/DJI_0485-e1743594912860.webp",
      "https://worleybyrdroofing.com/wp-content/uploads/2025/04/DJI_0519-e1743592444811.webp",
      "https://worleybyrdroofing.com/wp-content/uploads/2023/02/DJI_0533-e1743592580422.jpg",
    ],
  },
};

const BrandContext = createContext<Brand>(defaultBrand);

export function BrandProvider({ children }: { children: ReactNode }) {
  // Pre-warm backend Render instance on initial load
  useEffect(() => {
    fetch(`${BACKEND_URL}/health`, { method: "GET", mode: "cors" }).catch(() => {});
  }, []);

  // Check for Vanity Path Route (ONLY WorleyByrd has vanity slug /worleybyrd)
  const pathnameSlug = useMemo(() => {
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, "");
    const reservedRoutes = ["services", "portfolio", "financing", "locations", "book"];
    const firstSegment = rawPath.split("/")[0].toLowerCase();
    if (firstSegment && !reservedRoutes.includes(firstSegment)) {
      return firstSegment;
    }
    return "";
  }, []);

  const presetBrand = useMemo(() => {
    if (pathnameSlug && VERIFIED_DIRECTORY[pathnameSlug]) {
      return VERIFIED_DIRECTORY[pathnameSlug];
    }
    return null;
  }, [pathnameSlug]);

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const rawName = params.get("name") || presetBrand?.name || "";
  const rawCity = params.get("city") || presetBrand?.city || "";
  const rawPhone = params.get("phone") || presetBrand?.phone || "";
  const rawEmail = params.get("email") || presetBrand?.email || "";
  const rawState = params.get("state") || presetBrand?.state || "";
  const rawDomain = params.get("domain") || params.get("website") || presetBrand?.domain || "";
  const rawLogo = params.get("logo") || presetBrand?.logo || "";
  const rawTagline = params.get("tagline") || presetBrand?.tagline || "";
  const rawFounder = params.get("founder") || presetBrand?.founderName || "";
  const rawTitle = params.get("title") || presetBrand?.founderTitle || "";
  const rawPhoto = params.get("photo") || presetBrand?.founderPhoto || "";
  const rawLicense = params.get("license") || presetBrand?.licenseNumber || "";
  const rawCommercial = params.get("commercial") !== null ? params.get("commercial") : (presetBrand?.isCommercial ? "true" : null);
  const rawRating = params.get("rating");
  const rawReviews = params.get("reviews") || params.get("reviewsCount");
  const rawYears = params.get("years") || params.get("yearsInBusiness");
  const rawAbout = params.get("about") || params.get("aboutText") || "";
  const rawAreas = params.get("areas") || params.get("serviceAreas") || "";

  const resolvedState = (rawState || extractState(rawCity) || presetBrand?.state || "TX").toUpperCase();
  const targetDomain = extractDomain(rawEmail, rawDomain, rawName);

  const initialBrand: Brand = useMemo(() => {
    const name = rawName || "Premium Roofing";
    const city = rawCity || (resolvedState === "FL" ? "Jacksonville, FL" : "Dallas, TX");
    const isCommercial =
      rawCommercial !== null
        ? rawCommercial === "true" || rawCommercial === "1"
        : Boolean(name.toLowerCase().includes("commercial") || name.toLowerCase().includes("tpo"));

    const parsedRating = rawRating ? Math.min(5.0, Math.max(3.0, parseFloat(rawRating))) : 4.9;
    const parsedReviews = rawReviews ? parseInt(rawReviews, 10) : undefined;
    const parsedYears = rawYears ? parseInt(rawYears, 10) : 20;

    const parsedAreas = rawAreas
      ? rawAreas.split(",").map((s) => s.trim()).filter(Boolean)
      : getRegionalSuburbs(city, resolvedState);

    return {
      name: decodeHtmlEntities(name),
      phone: rawPhone || "(800) 555-ROOF",
      email: rawEmail || `contact@${targetDomain || "roofingcontractor.com"}`,
      city: decodeHtmlEntities(city),
      state: resolvedState,
      domain: targetDomain || undefined,
      logo: rawLogo || (targetDomain ? `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128` : undefined),
      tagline: decodeHtmlEntities(
        rawTagline ||
          (isCommercial
            ? `Premier Commercial & Industrial Roofing Authority in ${city}.`
            : `Promises Made. Promises Kept. Certified Roofing Across ${city}.`)
      ),
      aboutText: decodeHtmlEntities(
        rawAbout ||
          presetBrand?.aboutText ||
          `Providing certified residential replacements, commercial TPO installations, and 24/7 storm restorations backed by lifetime manufacturer warranties across ${city}.`
      ),
      founderPhoto: rawPhoto || undefined,
      founderName: decodeHtmlEntities(rawFounder || undefined),
      founderTitle: decodeHtmlEntities(rawTitle || (rawFounder ? "Founder & Master Craftsman" : undefined)),
      licenseNumber: rawLicense || undefined,
      rating: parsedRating,
      reviewsCount: parsedReviews || 48,
      yearsInBusiness: parsedYears,
      galleryImages: presetBrand?.galleryImages || undefined,
      services: isCommercial
        ? [
            "Commercial TPO Single-Ply Membrane",
            "Industrial Standing Seam Metal",
            "Modified Bitumen Flat Systems",
            "Fluid-Applied Silicone Roof Coating",
            "Thermal Drone Moisture Diagnostic Survey",
          ]
        : [
            "Architectural Shingle Lifetime Systems",
            "Standing Seam Metal Roofing",
            "Seamless Aluminum Gutters & Leaf Protection",
            "24/7 Emergency Storm Damage & Leak Tarping",
            "Drone-Assisted Attic & Roof Diagnostics",
          ],
      serviceAreas: parsedAreas,
      reviews: [
        {
          author: "Marcus Vance",
          text: `Outstanding craftsmanship and total professionalism from ${name}. They replaced our roof following severe weather and handled everything seamlessly.`,
          rating: 5,
          project: isCommercial ? "Commercial TPO Restoration" : "Lifetime Architectural Shingle Replacement",
          timeAgo: "2 weeks ago",
        },
        {
          author: "Sarah Jenkins",
          text: "Transparent pricing, zero hidden surprises, and meticulous cleanup. Highest recommendation in the area.",
          rating: 5,
          project: "Roof Inspection & Preventative Maintenance",
          timeAgo: "1 month ago",
        },
        {
          author: "David Ross",
          text: "Punctual, professional, and knowledgeable. The instant cost estimator gave us exact numbers and the final invoice matched to the penny.",
          rating: 5,
          project: isCommercial ? "Industrial Standing Seam" : "Emergency Storm Restoration",
          timeAgo: "2 months ago",
        },
      ],
      isCommercial,
    };
  }, [
    rawName,
    rawCity,
    rawPhone,
    rawEmail,
    resolvedState,
    targetDomain,
    rawLogo,
    rawTagline,
    rawAbout,
    rawFounder,
    rawTitle,
    rawPhoto,
    rawLicense,
    rawCommercial,
    rawRating,
    rawReviews,
    rawYears,
    rawAreas,
    presetBrand,
  ]);

  const [brand, setBrand] = useState<Brand>(initialBrand);

  useEffect(() => {
    setBrand(initialBrand);
  }, [initialBrand]);

  // Live Auto-Enrichment from backend /api/enrich
  useEffect(() => {
    if (!targetDomain) return;

    let isMounted = true;
    const fetchEnrichment = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/enrich?domain=${encodeURIComponent(targetDomain)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data) return;

        setBrand((prev) => ({
          ...prev,
          name: decodeHtmlEntities(prev.name),
          logo: prev.logo || data.logo,
          founderPhoto: rawPhoto || data.founderPhoto || prev.founderPhoto,
          tagline: decodeHtmlEntities(rawTagline || data.tagline || prev.tagline),
          aboutText: decodeHtmlEntities(rawAbout || data.aboutText || prev.aboutText),
          rating: rawRating ? prev.rating : data.rating || prev.rating,
          reviewsCount: rawReviews ? prev.reviewsCount : data.reviewsCount || prev.reviewsCount,
          yearsInBusiness: rawYears ? prev.yearsInBusiness : data.yearsInBusiness || prev.yearsInBusiness,
          services: data.services && data.services.length > 0 ? data.services.map((s: string) => decodeHtmlEntities(s)) : prev.services,
          serviceAreas:
            data.serviceAreas && data.serviceAreas.length > 0
              ? data.serviceAreas.map((a: string) => decodeHtmlEntities(formatLocation(a, prev.state)))
              : prev.serviceAreas,
          reviews:
            data.reviews && data.reviews.length > 0
              ? data.reviews.map((r: any) => ({
                  ...r,
                  author: decodeHtmlEntities(r.author),
                  text: decodeHtmlEntities(r.text),
                  location: r.location ? decodeHtmlEntities(formatLocation(r.location, prev.state)) : undefined,
                }))
              : prev.reviews,
          galleryImages: data.galleryImages && data.galleryImages.length > 0 ? data.galleryImages : prev.galleryImages,
          structuredServices: data.structuredServices && data.structuredServices.length > 0
            ? data.structuredServices.map((ss: any) => ({
                ...ss,
                title: decodeHtmlEntities(ss.title),
                desc: decodeHtmlEntities(ss.desc),
              }))
            : prev.structuredServices,
          isCommercial: prev.isCommercial || Boolean(data.isCommercial),
        }));
      } catch (err) {
        // Silently fallback to clean initial brand
      }
    };

    fetchEnrichment();
    return () => {
      isMounted = false;
    };
  }, [targetDomain, rawTagline, rawAbout, rawRating, rawReviews, rawYears]);

  // Dynamic SEO, AEO & GEO Structured Schema Injection
  useEffect(() => {
    document.title = `${brand.name} | ${brand.city} Premier Roofing & Commercial Restoration`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", brand.aboutText || `${brand.name} provides certified residential roof replacements, commercial TPO systems, and emergency storm restorations across ${brand.city}.`);

    let schemaScript = document.getElementById("contractor-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "contractor-schema";
      schemaScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      name: brand.name,
      telephone: brand.phone,
      email: brand.email,
      url: brand.domain ? `https://${brand.domain}` : window.location.href,
      image: brand.logo,
      priceRange: "$$ - $$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: brand.city.split(",")[0].trim(),
        addressRegion: brand.state,
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        addressLocality: brand.city,
      },
      areaServed: (brand.serviceAreas || []).map((area) => ({
        "@type": "City",
        name: area,
      })),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: brand.rating || 4.9,
        reviewCount: brand.reviewsCount || 42,
      },
      knowsAbout: brand.services,
    };

    schemaScript.textContent = JSON.stringify(schemaData, null, 2);
  }, [brand]);

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}
