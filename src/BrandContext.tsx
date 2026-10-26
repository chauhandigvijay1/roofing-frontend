import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface Brand {
  name: string;
  phone: string;
  email: string;
  city: string;
  isDrew: boolean;
  logo?: string;
  founderPhoto?: string;
  gafBadge?: string;
  txstBadge?: string;
  founderName?: string;
  founderTitle?: string;
  tagline?: string;
}

const BrandContext = createContext<Brand>({
  name: "Premium Roofing",
  phone: "Update Your Number",
  email: "info@roofing.com",
  city: "Texas",
  isDrew: false,
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const rawName = params.get("name") || "";
  const rawCity = params.get("city") || "";
  const isDrew = rawName.toLowerCase().includes("instant");

  const brand: Brand = isDrew
    ? {
        name: rawName || "Instant Roofing & Exteriors",
        phone: params.get("phone") || "(512) 888-9999",
        email: params.get("email") || "support@instantrfg.com",
        city: rawCity || "Austin, TX",
        isDrew: true,
        logo: "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/270a97e8-8c53-4f03-a50d-2ffc3b2566cf/Screenshot+2025-03-03+at+11.23.30%E2%80%AFPM.png?format=1500w",
        founderPhoto:
          "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/3eb6b517-2bf5-47bb-a557-1a8c2dfbc050/Drew1.jpg",
        gafBadge:
          "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/611d0070-edf6-4659-bce9-487acfef9264/Certified-Plus-4-1024x576.png",
        txstBadge:
          "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/a1b78403-8536-4516-b163-6c5b2d055042/txst-primary.jpg",
        founderName: "Drew Boy",
        founderTitle:
          "Founder & Master Craftsman (MS Building Science, Texas State)",
        tagline: "Austin's Premier Building Science Roofing Contractors",
      }
    : {
        name: rawName || "Premium Roofing",
        phone: params.get("phone") || "Update Your Number",
        email: params.get("email") || "info@roofing.com",
        city: rawCity || "Texas",
        isDrew: false,
      };

  return (
    <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
