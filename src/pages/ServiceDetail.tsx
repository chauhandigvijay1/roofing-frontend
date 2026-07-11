import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft } from "lucide-react";
import EstimateWizard from "../components/EstimateWizard";

const serviceData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  faqs: { q: string; a: string }[];
  img: string;
}> = {
  "residential": {
    title: "Residential Roof Replacement",
    subtitle: "Give your home the protection it deserves.",
    description: "Our residential roofing service delivers full tear-off and replacement using premium architectural shingles or metal panels. Every project starts with a detailed inspection and ends with a meticulous clean-up. We work with you on material selection, color matching, and timeline planning to ensure your new roof enhances both curb appeal and durability.",
    highlights: [
      "Architectural & luxury shingle options",
      "Standing seam metal roofing available",
      "30-year material warranties included",
      "Color consultation & HOA approval assistance",
      "Full debris removal & magnetic sweep",
    ],
    faqs: [
      { q: "How long does a residential replacement take?", a: "Most homes are completed in 1–3 days depending on size, pitch, and weather. We provide a precise timeline upfront." },
      { q: "Do you remove the old roof first?", a: "Yes, we do a full tear-off to expose the deck, inspect for rot, and install new underlayment before shingling." },
      { q: "What brands of shingles do you use?", a: "We partner with CertainTeed, Owens Corning, and GAF to offer the best in class for every budget." },
    ],
    img: "/service-metal.jpg",
  },
  "commercial": {
    title: "Commercial Roofing",
    subtitle: "Durable systems built for business.",
    description: "We specialize in TPO, PVC, and modified bitumen roofing systems for flat and low-slope commercial buildings. Our commercial team understands the urgency of minimizing downtime — we work efficiently around your business hours to deliver a watertight, energy-efficient roof that meets all code requirements.",
    highlights: [
      "TPO & PVC single-ply membranes",
      "Modified bitumen & built-up roof systems",
      "Energy-efficient cool roof coatings",
      "Minimal operational disruption",
      "Multi-year service warranties",
    ],
    faqs: [
      { q: "Do you offer maintenance plans for commercial roofs?", a: "Yes, we offer bi-annual inspection and maintenance plans to extend the life of your commercial roof." },
      { q: "Can you work on occupied buildings?", a: "Absolutely. We coordinate with your facility manager to minimize noise, dust, and disruption during business hours." },
    ],
    img: "/service-commercial.jpg",
  },
  "storm-damage": {
    title: "Storm Damage Restoration",
    subtitle: "Fast response when you need it most.",
    description: "When severe weather hits, we mobilize immediately. Our storm damage team provides emergency tarping, leak mitigation, and complete insurance claim assistance. We work directly with your adjuster to document damage and secure maximum coverage so you can focus on getting your life back to normal.",
    highlights: [
      "24/7 emergency response",
      "Insurance claim filing assistance",
      "Hail, wind, & tornado damage expertise",
      "Temporary tarping & board-up services",
      "Full restoration with matching materials",
    ],
    faqs: [
      { q: "Will my insurance cover a full replacement?", a: "It depends on your policy. We document all damage thoroughly and advocate for you with your adjuster to maximize coverage." },
      { q: "How fast can you respond?", a: "We aim to be on-site within 2 hours of your call for emergency tarping and assessment." },
    ],
    img: "/service-storm.jpg",
  },
  "repair": {
    title: "Emergency Roof Repair",
    subtitle: "Stop leaks and prevent further damage.",
    description: "From small leaks to major structural issues, our repair team has the skills and materials to restore your roof's integrity fast. We diagnose the root cause, provide a transparent repair quote, and execute with the same quality as a full replacement — all at a fraction of the cost.",
    highlights: [
      "Same-day leak detection & repair",
      "Shingle, tile & metal repair specialists",
      "Flashing & sealant replacement",
      "Gutter & downspout repairs",
      "Preventative maintenance packages",
    ],
    faqs: [
      { q: "Can you match existing shingles?", a: "We carry a wide inventory of popular colors and styles. For older roofs, we can often source close matches or suggest a blending strategy." },
      { q: "Is a repair worth it or should I replace?", a: "We'll give you an honest assessment. If the roof is near end of life, a replacement may be more cost-effective long-term." },
    ],
    img: "/service-repair.jpg",
  },
  "maintenance": {
    title: "Roof Maintenance & Inspections",
    subtitle: "Extend the life of your roof with routine care.",
    description: "Regular maintenance is the best investment you can make for your roof. Our bi-annual inspections catch small issues before they become expensive repairs. We clean gutters, inspect sealants, check flashing, and provide a detailed report with photos so you always know the condition of your roof.",
    highlights: [
      "Bi-annual inspection & cleaning",
      "Gutter cleaning & leaf guard installation",
      "Sealant & flashing inspection",
      "Minor repair included in plans",
      "Digital report with photos",
    ],
    faqs: [
      { q: "How often should I have my roof inspected?", a: "We recommend twice a year — once in spring and once in fall — plus after any major storm." },
      { q: "Do you offer maintenance plans?", a: "Yes, we have seasonal and annual plans that include priority scheduling and discounted repairs." },
    ],
    img: "/service-shingle.jpg",
  },
  "gutters": {
    title: "Gutter Installation & Repair",
    subtitle: "Custom seamless gutters for every home.",
    description: "Protect your foundation and landscaping with custom seamless gutters from {name}. We measure, fabricate, and install on-site for a perfect fit. Choose from a variety of colors and materials, including aluminum and copper. Add gutter guards for virtually maintenance-free performance.",
    highlights: [
      "Custom seamless aluminum gutters",
      "Copper gutter systems available",
      "Gutter guard & leaf filter installation",
      "Downspout extensions & drainage",
      "Color matching to your trim & fascia",
    ],
    faqs: [
      { q: "How long does gutter installation take?", a: "Most residential gutter installations are completed in a single day." },
      { q: "Do you install gutter guards?", a: "Yes, we offer mesh, reverse curve, and foam gutter guard systems to keep debris out." },
    ],
    img: "/service-gutters.jpg",
  },
};

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const data = serviceData[serviceId || ""];

  if (!data) {
    return (
      <section className="py-32 px-6 text-center">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">Service Not Found</h1>
        <p className="text-zinc-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={data.img} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl"
          >
            {data.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-4 text-lg md:text-xl text-zinc-200 max-w-2xl"
          >
            {data.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Split Content + Sticky Sidebar */}
      <section className="py-12 px-6 bg-white">
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          {/* Left Column — Content */}
          <div className="lg:w-2/3 space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                Why choose our {data.title}?
              </h2>
              <p className="text-zinc-600 text-lg leading-relaxed mb-10">{data.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-stone-50 rounded-sm p-8 border border-stone-200"
            >
              <h3 className="text-xl font-bold text-zinc-900 mb-6">What&apos;s Included</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-zinc-700">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Service FAQs */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8"
              >
                FAQs About {data.title}
              </motion.h3>
              <div className="space-y-4">
                {data.faqs.map((f, i) => (
                  <details key={i} className="bg-white rounded-sm border border-stone-200 group">
                    <summary className="px-6 py-5 font-semibold text-zinc-900 cursor-pointer list-none flex items-center justify-between">
                      {f.q}
                      <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-6 pb-5">
                      <p className="text-zinc-600 leading-relaxed">{f.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <EstimateWizard variant="sidebar" />
          </div>
        </div>
      </section>
    </>
  );
}
