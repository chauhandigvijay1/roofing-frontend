import { useBrand } from "../BrandContext";

export default function EmergencyBanner() {
  const { city, phone } = useBrand();

  return (
    <div className="bg-crimson-dark text-white text-center text-sm font-oswald uppercase tracking-wider font-bold py-2 px-4">
      Fast Roof Repair in {city} |{" "}
      <a href={`tel:${phone}`} className="underline hover:no-underline">
        Call {phone}
      </a>
    </div>
  );
}
