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
  isCommercial?: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://roofing-backend-n688.onrender.com";

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
  isCommercial: false,
};

const BrandContext = createContext<Brand>(defaultBrand);

export function BrandProvider({ children }: { children: ReactNode }) {
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
    const parsedReviews = rawReviews ? parseInt(rawReviews, 10) : 48;
    const parsedYears = rawYears ? parseInt(rawYears, 10) : 20;

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
          tagline: rawTagline || data.tagline || prev.tagline,
          aboutText: rawAbout || data.aboutText || prev.aboutText,
          rating: rawRating ? prev.rating : data.rating || prev.rating,
          reviewsCount: rawReviews ? prev.reviewsCount : data.reviewsCount || prev.reviewsCount,
          yearsInBusiness: rawYears ? prev.yearsInBusiness : data.yearsInBusiness || prev.yearsInBusiness,
          services: data.services && data.services.length > 0 ? data.services : prev.services,
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
