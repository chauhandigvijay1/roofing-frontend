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

export function formatLocation(loc: string, state: string): string {
  if (!loc) return "";
  let clean = loc.trim();
  // Strip duplicate trailing state (e.g., ", TX, TX", " TX, TX", ", TX TX")
  if (state) {
    clean = clean.replace(new RegExp(`,\\s*${state}\\s*,\\s*${state}$`, "i"), `, ${state}`);
    clean = clean.replace(new RegExp(`\\s+${state}\\s*,\\s*${state}$`, "i"), `, ${state}`);
    // If it already ends with ", <state>"
    if (new RegExp(`,\\s*${state}$`, "i").test(clean)) {
      return clean;
    }
    // If it already contains the full state name or state code
    if (clean.toLowerCase().includes(state.toLowerCase())) {
      return clean;
    }
    return `${clean}, ${state}`;
  }
  return clean;
}

export function getRegionalSuburbs(city: string, state: string): string[] {
  const normCity = (city || "").toLowerCase();

  // Known major metropolitan clusters
  if (normCity.includes("austin")) {
    return ["Round Rock", "Cedar Park", "Georgetown", "Pflugerville", "Lakeway", "Buda", "Kyle", "Leander"];
  }
  if (normCity.includes("dallas") || normCity.includes("fort worth") || normCity.includes("dfw") || normCity.includes("plano") || normCity.includes("frisco")) {
    return ["Plano", "Frisco", "McKinney", "Arlington", "Irving", "Garland", "Richardson", "Carrollton"];
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
  if (normCity.includes("tampa") || normCity.includes("st. petersburg") || normCity.includes("clearwater")) {
    return ["St. Petersburg", "Clearwater", "Brandon", "Riverview", "Largo", "Dunedin", "Wesley Chapel", "Palm Harbor"];
  }
  if (normCity.includes("orlando")) {
    return ["Winter Park", "Kissimmee", "Sanford", "Altamonte Springs", "Oviedo", "Winter Garden", "Clermont", "Lake Mary"];
  }
  if (normCity.includes("miami") || normCity.includes("fort lauderdale")) {
    return ["Fort Lauderdale", "Coral Gables", "Hialeah", "Pembroke Pines", "Hollywood", "Miramar", "Boca Raton", "Doral"];
  }
  if (normCity.includes("denver")) {
    return ["Aurora", "Lakewood", "Littleton", "Centennial", "Boulder", "Thornton", "Arvada", "Highlands Ranch"];
  }
  if (normCity.includes("phoenix") || normCity.includes("scottsdale")) {
    return ["Scottsdale", "Mesa", "Chandler", "Gilbert", "Glendale", "Tempe", "Peoria", "Surprise"];
  }
  if (normCity.includes("atlanta")) {
    return ["Alpharetta", "Marietta", "Roswell", "Sandy Springs", "Duluth", "Smyrna", "Johns Creek", "Dunwoody"];
  }
  if (normCity.includes("charlotte")) {
    return ["Concord", "Gastonia", "Huntersville", "Matthews", "Mooresville", "Mint Hill", "Cornelius", "Pineville"];
  }
  if (normCity.includes("nashville")) {
    return ["Franklin", "Murfreesboro", "Hendersonville", "Brentwood", "Gallatin", "Mt. Juliet", "Lebanon", "Smyrna"];
  }
  if (normCity.includes("indianapolis")) {
    return ["Carmel", "Fishers", "Noblesville", "Greenwood", "Westfield", "Plainfield", "Zionsville", "Avon"];
  }
  if (normCity.includes("columbus")) {
    return ["Dublin", "Westerville", "Grove City", "Reynoldsburg", "Hilliard", "Gahanna", "Upper Arlington", "Pickerington"];
  }
  if (normCity.includes("chicago")) {
    return ["Naperville", "Schaumburg", "Evanston", "Arlington Heights", "Oak Lawn", "Skokie", "Des Plaines", "Wheaton"];
  }

  // Dynamic regional generator for any arbitrary US city
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

function extractDomain(email: string, domainParam: string): string {
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

const BrandContext = createContext<Brand>(defaultBrand);

export function BrandProvider({ children }: { children: ReactNode }) {
  // Pre-warm backend Render instance on initial load
  useEffect(() => {
    fetch(`${BACKEND_URL}/health`, { method: "GET", mode: "cors" }).catch(() => {});
  }, []);

  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const rawName = params.get("name") || "";
  const rawCity = params.get("city") || "";
  const rawPhone = params.get("phone") || "";
  const rawEmail = params.get("email") || "";
  const rawState = params.get("state") || "";
  const rawDomain = params.get("domain") || params.get("website") || "";
  const rawLogo = params.get("logo") || "";
  const rawTagline = params.get("tagline") || "";
  const rawFounder = params.get("founder") || "";
  const rawTitle = params.get("title") || "";
  const rawPhoto = params.get("photo") || "";
  const rawLicense = params.get("license") || "";
  const rawCommercial = params.get("commercial");
  const rawRating = params.get("rating");
  const rawReviews = params.get("reviews") || params.get("reviewsCount");
  const rawYears = params.get("years") || params.get("yearsInBusiness");
  const rawAbout = params.get("about") || params.get("aboutText") || "";
  const rawAreas = params.get("areas") || params.get("serviceAreas") || "";

  const resolvedState = (rawState || extractState(rawCity) || "TX").toUpperCase();
  const targetDomain = extractDomain(rawEmail, rawDomain);

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
      name,
      phone: rawPhone || "(800) 555-ROOF",
      email: rawEmail || `contact@${targetDomain || "roofingcontractor.com"}`,
      city,
      state: resolvedState,
      domain: targetDomain || undefined,
      logo: rawLogo || (targetDomain ? `https://www.google.com/s2/favicons?domain=${targetDomain}&sz=128` : undefined),
      tagline:
        rawTagline ||
        (isCommercial
          ? "Commercial Flat Roofing, TPO Systems & Energy Efficiency Specialists"
          : resolvedState === "FL"
          ? "Hurricane-Engineered Roof Replacement & Florida Wind Mitigation Authority"
          : "Promises Made. Promises Kept. Commercial & Residential Roofing Authority."),
      aboutText:
        rawAbout ||
        `Providing certified residential replacements, commercial TPO installations, and 24/7 storm restorations backed by lifetime manufacturer warranties across ${city}.`,
      founderName: rawFounder || undefined,
      founderTitle: rawTitle || (rawFounder ? "Founder & Certified Roofing Master" : undefined),
      founderPhoto: rawPhoto || undefined,
      licenseNumber: rawLicense ? rawLicense.trim() : undefined,
      rating: parsedRating,
      reviewsCount: parsedReviews,
      yearsInBusiness: parsedYears,
      services: isCommercial
        ? [
            "Commercial TPO & Single-Ply Flat Systems",
            "Modified Bitumen & Silicone Roof Coatings",
            "Commercial Energy Efficiency & Cool Roof Credits",
            "24/7 Priority Emergency Leak Tarping",
          ]
        : resolvedState === "FL"
        ? [
            "Florida Wind Mitigation Inspections (Insurance Discount Form)",
            "140+ MPH Hurricane Architectural Shingle Systems",
            "Engineered Standing Seam Metal Roofing",
            "24/7 Emergency Storm Damage & Leak Tarping",
          ]
        : [
            "Architectural Shingle Lifetime Systems",
            "Impact-Resistant Class 4 Hail Defense",
            "Commercial TPO & Flat Roof Systems",
            "24/7 Emergency Storm Damage & Leak Tarping",
          ],
      serviceAreas: parsedAreas,
      isCommercial,
    };
  }, [
    rawName,
    rawCity,
    rawPhone,
    rawEmail,
    rawLogo,
    rawTagline,
    rawFounder,
    rawTitle,
    rawPhoto,
    rawLicense,
    rawCommercial,
    rawRating,
    rawReviews,
    rawYears,
    rawAbout,
    rawAreas,
    resolvedState,
    targetDomain,
  ]);

  const [brand, setBrand] = useState<Brand>(initialBrand);

  // Autonomous Dynamic Enrichment from backend /api/enrich
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
          logo: prev.logo || data.logo,
          founderPhoto: rawPhoto || data.founderPhoto || prev.founderPhoto,
          tagline: rawTagline || data.tagline || prev.tagline,
          aboutText: rawAbout || data.aboutText || prev.aboutText,
          rating: rawRating ? prev.rating : data.rating || prev.rating,
          reviewsCount: rawReviews ? prev.reviewsCount : data.reviewsCount || prev.reviewsCount,
          yearsInBusiness: rawYears ? prev.yearsInBusiness : data.yearsInBusiness || prev.yearsInBusiness,
          services: data.services && data.services.length > 0 ? data.services : prev.services,
          serviceAreas:
            data.serviceAreas && data.serviceAreas.length > 0
              ? data.serviceAreas.map((a: string) => formatLocation(a, prev.state))
              : prev.serviceAreas,
          reviews:
            data.reviews && data.reviews.length > 0
              ? data.reviews.map((r: any) => ({
                  ...r,
                  location: r.location ? formatLocation(r.location, prev.state) : undefined,
                }))
              : prev.reviews,
          galleryImages: data.galleryImages && data.galleryImages.length > 0 ? data.galleryImages : prev.galleryImages,
          structuredServices: data.structuredServices && data.structuredServices.length > 0 ? data.structuredServices : prev.structuredServices,
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

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  return useContext(BrandContext);
}
