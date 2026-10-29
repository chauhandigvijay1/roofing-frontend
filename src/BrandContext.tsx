import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface Brand {
  name: string;
  phone: string;
  email: string;
  city: string;
  isDrew: boolean;
  isRichard: boolean;
  isJim: boolean;
  logo?: string;
  founderPhoto?: string;
  mascotPhoto?: string;
  gafBadge?: string;
  txstBadge?: string;
  bbbBadge?: string;
  taaBadge?: string;
  haaBadge?: string;
  founderName?: string;
  founderTitle?: string;
  tagline?: string;
  licenseNumber?: string;
}

const BrandContext = createContext<Brand>({
  name: "Premium Roofing",
  phone: "Update Your Number",
  email: "info@roofing.com",
  city: "Texas",
  isDrew: false,
  isRichard: false,
  isJim: false,
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const rawName = params.get("name") || "";
  const rawCity = params.get("city") || "";
  const isDrew =
    rawName.toLowerCase().includes("instant") &&
    rawCity.toLowerCase().includes("austin");
  const isRichard =
    rawName.toLowerCase().includes("paramount") &&
    rawCity.toLowerCase().includes("houston");
  const isJim =
    rawName.toLowerCase().includes("ready") &&
    rawCity.toLowerCase().includes("jacksonville");

  const brand: Brand = isDrew
    ? {
        name: rawName || "Instant Roofing & Exteriors",
        phone: params.get("phone") || "(512) 888-9999",
        email: params.get("email") || "support@instantrfg.com",
        city: rawCity || "Austin, TX",
        isDrew: true,
        isRichard: false,
        isJim: false,
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
    : isRichard
    ? {
        name: rawName || "Paramount Roofing Inc.",
        phone: params.get("phone") || "(713) 748-4000",
        email: params.get("email") || "service@paramountroofing.com",
        city: rawCity || "Houston, TX",
        isDrew: false,
        isRichard: true,
        isJim: false,
        logo: "https://paramountroofing.com/wp-content/uploads/2021/11/logo.png",
        bbbBadge: "https://paramountroofing.com/wp-content/uploads/2021/06/bbb.png",
        taaBadge: "https://paramountroofing.com/wp-content/uploads/2021/06/taa.png",
        haaBadge: "https://paramountroofing.com/wp-content/uploads/2021/06/haa.png",
        founderName: "Richard W. Keathley & David",
        founderTitle:
          "Co-Owners & Principals (31+ Years Houston Commercial & Residential Roofing Heritage)",
        tagline:
          "Promises Made. Promises Kept. Houston's Commercial & Residential Roofing Authority.",
      }
    : isJim
    ? {
        name: rawName || "Ready Roofing, LLC",
        phone: params.get("phone") || "(904) 404-9849",
        email: params.get("email") || "jvjessup@gmail.com",
        city: rawCity || "Jacksonville, FL",
        isDrew: false,
        isRichard: false,
        isJim: true,
        logo: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/Ready+Roofing_+We+Nailed+It.png",
        founderPhoto:
          "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/1731678213934_11824_114204am-1920w.png",
        mascotPhoto:
          "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/Cheerful+Jack+Russell+Mascot+with+RR+Harness-1920w.png",
        founderName: "Jim Jessup",
        founderTitle: "Owner & Operator (20+ Years Construction Heritage)",
        tagline: "We Nailed It. North Florida's Trusted Hurricane-Tested Roofing Team.",
        licenseNumber: "Florida DBPR Lic. # RC29027754",
      }
    : {
        name: rawName || "Premium Roofing",
        phone: params.get("phone") || "Update Your Number",
        email: params.get("email") || "info@roofing.com",
        city: rawCity || "Texas",
        isDrew: false,
        isRichard: false,
        isJim: false,
      };

  return (
    <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
