import { createContext, useContext, useMemo, type ReactNode } from "react";

interface Brand {
  name: string;
  phone: string;
  email: string;
  city: string;
}

const BrandContext = createContext<Brand>({
  name: "Premium Roofing",
  phone: "Update Your Number",
  email: "info@roofing.com",
  city: "Texas",
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const brand: Brand = {
    name: params.get("name") || "Premium Roofing",
    phone: params.get("phone") || "Update Your Number",
    email: params.get("email") || "info@roofing.com",
    city: params.get("city") || "Texas",
  };

  return (
    <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
