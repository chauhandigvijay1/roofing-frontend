import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useBrand } from "../BrandContext";

const services = [
  { slug: "residential", title: "Residential Replacement", desc: "Full tear-off and replacement with premium architectural shingles or metal panels.", img: "/service-metal.jpg" },
  { slug: "repair", title: "Emergency Repair", desc: "24/7 emergency tarping, leak stops, and storm damage mitigation to protect your home.", img: "/service-repair.jpg" },
  { slug: "storm-damage", title: "Storm Damage", desc: "Complete insurance claim assistance and restoration after hail, wind, or tornado damage.", img: "/service-storm.jpg" },
  { slug: "commercial", title: "Commercial Roofing", desc: "TPO, PVC, and modified bitumen systems for flat and low-slope commercial buildings.", img: "/service-commercial.jpg" },
  { slug: "maintenance", title: "Maintenance", desc: "Bi-annual inspections, gutter cleaning, sealant checks, and minor repairs to extend roof life.", img: "/service-shingle.jpg" },
  { slug: "gutters", title: "Gutters", desc: "Custom seamless gutter installation, gutter guards, and downspout repairs in matching colors.", img: "/service-gutters.jpg" },
];

const drewServices = [
  {
    slug: "residential",
    title: "GAF Timberline HDZ Replacement",
    desc: "Full architectural shingle tear-off backed by 50-year non-prorated GAF manufacturer warranties.",
    img: "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/c25268a4-76c2-43cf-bac0-a079410be069/IMG_0199.jpg"
  },
  {
    slug: "storm-damage",
    title: "Class 4 Impact Hail Defense",
    desc: "Armorshield II impact shingles engineered for Central Texas hail storms, saving up to 28% on insurance premiums.",
    img: "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/bb9c5f7a-7707-4c88-8a04-d6d45f487c33/IMG_1842.png"
  },
  {
    slug: "repair",
    title: "24/7 Emergency Storm Tarping",
    desc: "Sub-2-hour priority dispatch across Greater Austin for active ceiling leaks and emergency mitigation.",
    img: "https://images.squarespace-cdn.com/content/v1/67c0d49644e97311a2d0e480/1780249406513-PWPDN8Q1A0GIX2IVU99R/unsplash-image--1l0iZaM8ms.jpg"
  },
  {
    slug: "metal",
    title: "Standing Seam Metal Roofing",
    desc: "Ultra-durable, heat-reflective standing seam metal systems designed for extreme Texas heat and wind.",
    img: "/service-metal.jpg"
  },
  {
    slug: "commercial",
    title: "Commercial Flat Roofing",
    desc: "TPO, EPDM, and silicone roof coatings engineered for Austin commercial and multi-family structures.",
    img: "/service-commercial.jpg"
  },
  {
    slug: "insurance-compliance",
    title: "Texas HB 2102 Deductible Restoration",
    desc: "100% legal, transparent insurance claim processing and deductible compliance to protect your claim integrity.",
    img: "/service-shingle.jpg"
  }
];

export default function Services() {
  const brand = useBrand();
  const currentServices = brand.isDrew ? drewServices : services;

  return (
    <section id="services" className="py-24 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">Our Services</h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">
            {brand.isDrew
              ? "Building science roofing systems engineered for Central Texas climate."
              : "From residential to commercial, we handle every roof."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ contentVisibility: "auto" }}>
          {currentServices.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`} className="block">
              <div className="bg-white overflow-hidden shadow-lg border-t-4 border-t-crimson transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer transform-gpu will-change-transform">
                <div className="overflow-hidden bg-stone-100 h-48">
                  <img loading="lazy" decoding="async" src={s.img} alt={s.title} className="w-full h-full object-cover" style={{ transform: "translateZ(0)" }} />
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2">{s.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed font-serif">{s.desc}</p>
                  <span className="mt-6 flex items-center text-sm font-oswald uppercase tracking-wider font-bold text-crimson group-hover:text-crimson-dark transition-colors">Explore Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
