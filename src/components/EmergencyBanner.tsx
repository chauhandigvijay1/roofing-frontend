import { useBrand } from "../BrandContext";

export default function EmergencyBanner() {
  const { city, phone } = useBrand();

  return (
    <div className="bg-red-600 text-white text-center text-sm font-medium py-2 px-4">
      🚨 Fast Roof Repair in {city} |{" "}
      <a href={`tel:${phone}`} className="underline hover:no-underline">
        Call {phone}
      </a>
    </div>
  );
}
