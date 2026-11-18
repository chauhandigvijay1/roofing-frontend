import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, ShieldCheck, Award, Phone, Calendar } from "lucide-react";
import { useBrand } from "../BrandContext";
import EstimateWizard from "../components/EstimateWizard";
import BookingModal from "../components/BookingModal";

interface ServicePayload {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  faqs: { q: string; a: string }[];
  img: string;
  scopeTag: string;
}

export default function ServiceDetail() {
  const brand = useBrand();
  const { serviceId = "residential" } = useParams<{ serviceId: string }>();

  const rawSlug = (serviceId || "residential").toLowerCase().replace(/[^a-z0-9-]/g, "");

  // Universal Archetype Resolver: Dynamically resolves ANY service slug to deep local technical specifications
  const serviceData: ServicePayload = (() => {
    // 1. Commercial Flat / TPO / PVC / Single-Ply
    if (rawSlug.includes("commercial") || rawSlug.includes("tpo") || rawSlug.includes("flat") || rawSlug.includes("membrane")) {
      return {
        title: "Commercial TPO & Single-Ply Flat Roofing",
        subtitle: `Engineered flat roof installations and energy-efficient cool roof systems across ${brand.city}.`,
        description: `${brand.name} specializes in high-performance 60-mil and 80-mil heat-welded TPO single-ply roofing systems for warehouses, retail centers, and industrial facilities in ${brand.city}. Our commercial crews minimize operational disruption while delivering watertight membrane seams backed by 20- to 30-year No Dollar Limit (NDL) manufacturer warranties.`,
        highlights: [
          "Heat-welded 60-mil & 80-mil TPO and PVC single-ply membranes",
          "Energy Star reflective cool roof coatings that reduce AC cooling loads",
          "Engineered taper insulation systems for complete positive drainage",
          "20-year to 30-year manufacturer No Dollar Limit (NDL) warranties",
          "Minimal operational downtime with flexible off-hours commercial staging",
        ],
        faqs: [
          {
            q: `Can ${brand.name} work on occupied commercial buildings?`,
            a: "Yes. Our commercial teams coordinate directly with your facility manager to schedule work, control dust, and maintain clear access during regular business hours.",
          },
          {
            q: `Does a reflective cool roof qualify for local energy rebates in ${brand.city}?`,
            a: `Yes. Reflective white TPO and silicone coatings qualify for commercial energy efficiency rebates and reduce peak electricity demands throughout ${brand.city}.`,
          },
          {
            q: "What commercial warranties are provided?",
            a: `We provide certified manufacturer NDL warranties ranging from 20 to 30 years, alongside our ${brand.name} turnkey workmanship guarantee.`,
          },
        ],
        img: brand.galleryImages?.[0] || "/service-commercial.jpg",
        scopeTag: "Commercial TPO Division",
      };
    }

    // 2. Standing Seam & Architectural Metal Roofing
    if (rawSlug.includes("metal") || rawSlug.includes("standing-seam") || rawSlug.includes("steel")) {
      return {
        title: "Engineered Standing Seam Metal Roofing",
        subtitle: `Lifetime 50+ year architectural steel systems engineered for severe weather across ${brand.city}.`,
        description: `Experience the pinnacle of architectural resilience with custom standing seam metal roofing installed by ${brand.name}. Fabricated with heavy 24-gauge concealed-fastener steel panels, our metal systems eliminate exposed screws, resist 140+ MPH hurricane-force winds, and provide Class 4 impact hail protection for properties across ${brand.city}.`,
        highlights: [
          "24-gauge concealed-fastener mechanical lock standing seam panels",
          "Zero exposed screws, preventing thermal expansion leaks",
          "Class 4 UL 2218 impact rating (qualifies for up to 28% insurance discounts)",
          "Kynar 500 / Hylar 5000 fluoropolymer finish resistant to chalking and fading",
          "50+ year lifetime architectural durability with zero rot",
        ],
        faqs: [
          {
            q: "Does a standing seam metal roof lower my homeowners insurance?",
            a: `Yes. In ${brand.state}, standing seam roofs carry a Class 4 impact resistance rating, which qualifies homeowners for substantial annual insurance premium discounts.`,
          },
          {
            q: "Is a metal roof noisy during heavy rainfall?",
            a: "Not at all. With modern solid deck underlayment and attic insulation, exterior sound levels are identical to traditional asphalt shingles.",
          },
          {
            q: `How long does a metal roof installation take in ${brand.city}?`,
            a: "Typical residential installations are completed within 3 to 5 business days, including complete tear-off and synthetic underlayment installation.",
          },
        ],
        img: brand.galleryImages?.[1] || "/service-metal.jpg",
        scopeTag: "Architectural Metal",
      };
    }

    // 3. Storm & Hail Damage Restoration
    if (rawSlug.includes("storm") || rawSlug.includes("hail") || rawSlug.includes("tornado") || rawSlug.includes("insurance")) {
      return {
        title: "Severe Storm & Hail Damage Restoration",
        subtitle: `High-definition drone damage assessment and comprehensive insurance claim coordination in ${brand.city}.`,
        description: `When severe wind, hail, or storm weather strikes ${brand.city}, ${brand.name} mobilizes immediately. Our certified restoration specialists conduct high-resolution aerial drone inspections, document structural wind uplift and shingle damage, and coordinate directly with your insurance adjuster to secure complete replacement approval without out-of-pocket deductible surprises.`,
        highlights: [
          "High-definition aerial drone roof scans and comprehensive attic inspections",
          "Detailed itemized damage reports prepared for insurance adjuster meetings",
          "Emergency temporary tarping within 2 hours of post-storm dispatch",
          "100% honest and transparent estimates with zero deductible gimmicks",
          "Complete manufacturer warranty restoration with lifetime materials",
        ],
        faqs: [
          {
            q: `How fast can ${brand.name} respond after a severe storm?`,
            a: `Our emergency storm restoration units are on call 24/7 across ${brand.city}. Emergency tarping and water mitigation crews typically arrive within 2 hours of notification.`,
          },
          {
            q: "Will my insurance cover a complete roof replacement?",
            a: "If your roof has documented hail bruising or wind uplift exceeding policy thresholds, insurance policies cover full replacement minus your deductible. We provide complete high-resolution photo documentation to support your adjuster walk-through.",
          },
          {
            q: "Is there any cost for the storm inspection?",
            a: "No. Our 21-point drone and attic diagnostic inspection is 100% complimentary with zero deposit required.",
          },
        ],
        img: brand.galleryImages?.[2] || "/service-storm.jpg",
        scopeTag: "Storm Restoration",
      };
    }

    // 4. 24/7 Emergency Leak & Valley Repair
    if (rawSlug.includes("leak") || rawSlug.includes("repair") || rawSlug.includes("emergency") || rawSlug.includes("tarp")) {
      return {
        title: "24/7 Emergency Leak & Valley Repair",
        subtitle: `Rapid dispatch leak detection and permanent structural repairs in ${brand.city}.`,
        description: `From active ceiling drips during torrential rains to compromised valley flashing and deteriorated pipe boots, ${brand.name} delivers immediate, permanent roofing repairs throughout ${brand.city}. Our diagnostic technicians locate the hidden source of moisture, prevent mold growth, and execute flawless color-matched shingle repairs with zero price gouging.`,
        highlights: [
          "Under 2-hour priority emergency dispatch across the greater metropolitan area",
          "Precision moisture-meter detection to pinpoint hidden water entry points",
          "Commercial and residential chimney, skylight, and valley flashing rebuilds",
          "Full pipe-boot neoprene collar replacement and ice/water barrier sealing",
          "Written leak-free repair warranty backed by certified technicians",
        ],
        faqs: [
          {
            q: "How much does a localized roof repair typically cost?",
            a: `In ${brand.city}, standard localized leak repairs (pipe boots, valley resealing, or wind-blown shingle replacement) range from $350 to $1,250 depending on damage severity.`,
          },
          {
            q: "Can you match my existing shingle color?",
            a: "Yes. We maintain a large inventory of popular architectural shingle lines from GAF, Owens Corning, and CertainTeed to match your existing roof profile seamlessly.",
          },
          {
            q: "What should I do while waiting for emergency dispatch?",
            a: "Place a bucket under active drips, clear furniture, and call our direct dispatch hotline immediately. Do not attempt to climb onto a wet, slippery roof.",
          },
        ],
        img: brand.galleryImages?.[3] || "/service-repair.jpg",
        scopeTag: "24/7 Emergency Dispatch",
      };
    }

    // 5. Florida Wind Mitigation & Coastal Hurricane Code
    if (rawSlug.includes("wind") || rawSlug.includes("mitigation") || rawSlug.includes("hurricane") || rawSlug.includes("florida")) {
      return {
        title: "Florida Wind Mitigation & Hurricane Tie-Downs",
        subtitle: `Certified statutory inspection forms saving property owners up to $1,200/yr on insurance.`,
        description: `${brand.name} performs certified Florida Building Code (FBC) wind mitigation inspections and hurricane roof fortifications throughout ${brand.city}. We inspect roof-to-wall hurricane clips, secondary water resistance (SWR) underlayment barriers, and roof geometry, delivering official OIR-B1-1802 documentation to slash homeowner insurance premiums.`,
        highlights: [
          "Official OIR-B1-1802 Wind Mitigation Inspection Report for insurance carriers",
          "Verification of hurricane clips, single wraps, and structural nail spacing",
          "Secondary Water Resistance (SWR) sealed deck validation",
          "Immediate statutory insurance premium discounts ($500 to $1,200/yr)",
          "140+ MPH hurricane wind-rated architectural shingle replacements",
        ],
        faqs: [
          {
            q: "How much can a wind mitigation report save on Florida homeowners insurance?",
            a: "Most Florida property owners save between 15% and 45% (often $500 to $1,200 annually) on their wind insurance premium once qualified tie-downs and SWR barriers are certified.",
          },
          {
            q: "How long is a wind mitigation certificate valid?",
            a: "Wind mitigation inspection certificates are valid for 5 years with Florida insurance carriers.",
          },
          {
            q: `How quickly does ${brand.name} deliver the completed report?`,
            a: "We inspect on-site and transmit the certified digital report with photos directly to your insurance agent within 24 hours.",
          },
        ],
        img: brand.galleryImages?.[0] || "/service-storm.jpg",
        scopeTag: "Wind Mitigation",
      };
    }

    // 6. Seamless Gutters & Drainage
    if (rawSlug.includes("gutter") || rawSlug.includes("drainage") || rawSlug.includes("downspout")) {
      return {
        title: "Seamless Heavy-Gauge Gutters & Drainage",
        subtitle: `Custom on-site extruded 6-inch seamless aluminum systems designed for heavy rainfall.`,
        description: `Protect your home's foundation, fascia boards, and landscaping with precision seamless gutters fabricated on-site by ${brand.name}. Engineered for maximum water deflection, our 6-inch K-style aluminum gutters and custom leaf-protection guards eliminate clogs, prevent fascia rot, and protect properties throughout ${brand.city}.`,
        highlights: [
          "Custom on-site continuous extrusion with zero leaky seam joints",
          "Heavy-duty .032 gauge aluminum in 24+ factory baked-on enamel colors",
          "High-capacity 3x4 inch downspouts for torrential storm drainage",
          "Stainless steel micro-mesh leaf protection guards to eliminate cleaning",
          "Lifetime anti-clog and structural sag-free workmanship warranty",
        ],
        faqs: [
          {
            q: "How long does a gutter installation take?",
            a: "Most residential seamless gutter replacements are extruded on-site and installed in a single day.",
          },
          {
            q: "Do your gutters come with leaf protection guards?",
            a: "Yes. We offer micro-mesh surgical-grade stainless steel gutter screens that keep pine needles, leaves, and debris out while handling heavy water volume.",
          },
          {
            q: `Can ${brand.name} match our home's trim color?`,
            a: "Absolutely. We offer over 24 baked-on enamel colors designed to blend seamlessly with your fascia and trim.",
          },
        ],
        img: brand.galleryImages?.[1] || "/service-gutters.jpg",
        scopeTag: "Seamless Gutters",
      };
    }

    // 7. Commercial Silicone Fluid-Applied Coatings
    if (rawSlug.includes("coating") || rawSlug.includes("silicone") || rawSlug.includes("restoration")) {
      return {
        title: "Commercial Silicone Fluid-Applied Roof Coatings",
        subtitle: `Monolithic restoration barriers delivering 20-year leak protection at half the cost of tear-off.`,
        description: `Restore and protect your existing commercial flat roof without expensive, disruptive tear-offs. ${brand.name} applies high-solids seamless silicone coatings that create a monolithic, watertight barrier over modified bitumen, metal, or single-ply roofs across ${brand.city}. Backed by 15- to 20-year renewable warranties, silicone coatings reflect 88% of solar UV rays.`,
        highlights: [
          "Monolithic liquid-applied barrier with zero joints or mechanical fasteners",
          "Resists permanent ponding water without softening or delaminating",
          "Reflects 88% of solar radiation, reducing interior building temperatures",
          "Saves 50% to 70% compared to a complete commercial roof tear-off",
          "Tax-deductible as an operating maintenance expense in the year applied",
        ],
        faqs: [
          {
            q: "Can silicone coatings be applied over an existing roof?",
            a: "Yes. Silicone adheres exceptionally well over existing TPO, EPDM, PVC, modified bitumen, and metal roofing decks once pressure-washed and primed.",
          },
          {
            q: "How does this compare in cost to a full roof replacement?",
            a: "Silicone roof restorations typically cost half as much as a full tear-off and replacement, while offering the same 15- to 20-year leak protection.",
          },
          {
            q: "Does silicone stop ponding water leaks?",
            a: "Yes. Unlike acrylic coatings, silicone is completely impervious to standing or ponding water and will not degrade over time.",
          },
        ],
        img: brand.galleryImages?.[2] || "/service-storm.jpg",
        scopeTag: "Fluid Restoration",
      };
    }

    // 8. Default: Universal Architectural Shingle Replacement
    const formattedTitle = rawSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      title: formattedTitle.includes("Roof") ? formattedTitle : `${formattedTitle} Roofing Systems`,
      subtitle: `Certified craftsmanship and non-prorated manufacturer warranties across ${brand.city}.`,
      description: `${brand.name} delivers precision roof replacement and restoration throughout ${brand.city}. Every project begins with a complimentary 21-point on-site roof inspection, structural deck check, synthetic underlayment installation, and non-prorated manufacturer warranty coverage with zero deposit required upfront.`,
      highlights: [
        "Certified GAF Timberline HDZ and Owens Corning Duration lifetime systems",
        "Full structural deck tear-off, rot replacement, and synthetic moisture barrier",
        "130+ MPH wind warranty and Class 4 impact hail resistance options",
        "Triple-sweep magnetic nail cleanup around property perimeter",
        "Zero deposit required: complimentary on-site diagnostic survey confirms final quote",
      ],
      faqs: [
        {
          q: `How long does a roof replacement take with ${brand.name}?`,
          a: "Most residential replacements are completed within 1 to 2 business days, including full tear-off, dry-in, shingling, and clean-up.",
        },
        {
          q: `Is ${brand.name} licensed and insured in ${brand.city}?`,
          a: `Yes. ${brand.name} is fully licensed, bonded, and insured with full workers' compensation and general liability coverage compliant with municipal building codes.`,
        },
        {
          q: "How do I schedule an inspection for this service?",
          a: "Click 'Book Free Inspection' on this page, choose your preferred morning or afternoon window, and our master dispatch coordinator will confirm your appointment.",
        },
      ],
      img: brand.galleryImages?.[0] || "/service-shingle.jpg",
      scopeTag: "Turnkey Architecture",
    };
  })();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const pricingGuidance = useMemo(() => {
    if (rawSlug.includes("repair") || rawSlug.includes("leak")) {
      return {
        range: "$350 – $1,250",
        label: "Localized Leak Repair Scope",
        sub: "Complete leak stop, pipe boot replacement, or valley flashing rebuild.",
      };
    }
    if (rawSlug.includes("metal")) {
      return {
        range: "$7.80 – $9.50 / sq ft",
        label: "Architectural Standing Seam Metal",
        sub: "24-gauge concealed-fastener panels with lifetime 50+ year resilience.",
      };
    }
    if (rawSlug.includes("commercial") || rawSlug.includes("tpo")) {
      return {
        range: "$5.20 – $7.50 / sq ft",
        label: "Commercial TPO & Single-Ply Flat",
        sub: "Heat-welded 60-mil cool roof membrane with 20-30 year NDL warranty.",
      };
    }
    if (rawSlug.includes("gutter")) {
      return {
        range: "$11 – $18 / linear ft",
        label: "Seamless Heavy-Gauge Aluminum Gutters",
        sub: "Continuous on-site extrusion with micro-mesh leaf protection guards.",
      };
    }
    return {
      range: "$4.80 – $6.20 / sq ft",
      label: "Lifetime Architectural Shingle Replacement",
      sub: "GAF Timberline HDZ / Owens Corning Duration with full tear-off included.",
    };
  }, [rawSlug]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[48vh] flex items-center overflow-hidden bg-zinc-950">
        <img
          loading="lazy"
          decoding="async"
          src={serviceData.img}
          alt={serviceData.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson/20 border border-crimson/40 text-crimson-light text-xs font-oswald uppercase tracking-wider font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{serviceData.scopeTag} &bull; {brand.city}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-oswald uppercase tracking-wider font-bold text-white leading-tight max-w-3xl"
          >
            {serviceData.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-serif leading-relaxed"
          >
            {serviceData.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Split Content + High-Converting Priority Scheduling Sidebar */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-b border-stone-200">
        <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
          {/* Left Column — Deep Service Scope & Step-by-Step Execution */}
          <div className="lg:w-2/3 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
                Certified Service Scope
              </span>
              <h2 className="text-3xl md:text-4xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1 mb-4">
                Why Choose {brand.name} for {serviceData.title}?
              </h2>
              <div className="w-14 h-1 bg-crimson mb-6"></div>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-serif">
                {serviceData.description}
              </p>
            </motion.div>

            {/* 4-Step Precision Workflow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div>
                <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
                  Turnkey Engineering Standard
                </span>
                <h3 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
                  Our 4-Step Installation & Diagnostic Protocol
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                  <div className="w-8 h-8 rounded-full bg-crimson text-white font-oswald font-bold flex items-center justify-center text-xs mb-3">
                    01
                  </div>
                  <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm mb-1.5">
                    21-Point Drone & Attic Survey
                  </h4>
                  <p className="text-xs text-zinc-600 font-serif leading-relaxed">
                    Thermal infrared leak detection and high-definition aerial shingle mapping to pinpoint hidden moisture.
                  </p>
                </div>

                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                  <div className="w-8 h-8 rounded-full bg-crimson text-white font-oswald font-bold flex items-center justify-center text-xs mb-3">
                    02
                  </div>
                  <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm mb-1.5">
                    Deck Prep & Synthetic Barrier
                  </h4>
                  <p className="text-xs text-zinc-600 font-serif leading-relaxed">
                    Complete surface prep, damaged wood replacement, and high-tensile water barriers installed across valleys and eaves.
                  </p>
                </div>

                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                  <div className="w-8 h-8 rounded-full bg-crimson text-white font-oswald font-bold flex items-center justify-center text-xs mb-3">
                    03
                  </div>
                  <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm mb-1.5">
                    Certified Master Installation
                  </h4>
                  <p className="text-xs text-zinc-600 font-serif leading-relaxed">
                    Precision installation exceeding strict manufacturer specifications, certified for 130+ MPH wind defense and lifetime warranties.
                  </p>
                </div>

                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                  <div className="w-8 h-8 rounded-full bg-crimson text-white font-oswald font-bold flex items-center justify-center text-xs mb-3">
                    04
                  </div>
                  <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm mb-1.5">
                    Triple Magnetic Sweep & Sign-Off
                  </h4>
                  <p className="text-xs text-zinc-600 font-serif leading-relaxed">
                    Thorough magnetic roller sweeps to capture every stray nail, full property cleanup, and final customer walk-through certification.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Turnkey Inclusions Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs"
            >
              <div className="flex items-center gap-2 mb-5">
                <Award className="w-5 h-5 text-crimson" />
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Standard Turnkey Inclusions & Guarantees
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3.5">
                {serviceData.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-crimson shrink-0 mt-0.5" />
                    <span className="text-zinc-700 font-serif text-sm leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Local Technical FAQs */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
                  Warranty & Installation Details
                </span>
                <h3 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
                  Frequently Asked Questions
                </h3>
              </motion.div>

              <div className="space-y-3">
                {serviceData.faqs.map((f, i) => (
                  <details
                    key={i}
                    className="bg-stone-50 rounded-2xl border border-stone-200/90 group overflow-hidden transition-all"
                  >
                    <summary className="px-5 py-4 font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm text-zinc-900 cursor-pointer list-none flex items-center justify-between gap-4">
                      <span>{f.q}</span>
                      <span className="text-zinc-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                    </summary>
                    <div className="px-5 pb-4 pt-1 border-t border-stone-200/50">
                      <p className="text-zinc-600 leading-relaxed font-serif text-xs sm:text-sm">{f.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-oswald uppercase tracking-wider font-bold text-crimson hover:text-crimson-dark transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Homepage Overview
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Dedicated Priority Scheduling Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-200/90 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-crimson via-crimson-light to-amber-500" />

                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs font-oswald uppercase tracking-wider font-bold text-emerald-800">
                    Priority Dispatch Active &bull; {brand.city}
                  </span>
                </div>

                <h3 className="text-2xl font-oswald uppercase tracking-wider font-bold text-zinc-950 leading-tight">
                  Schedule Free 21-Point Inspection
                </h3>
                <p className="text-xs text-zinc-600 font-serif leading-relaxed mt-1.5">
                  Complimentary on-site drone scan, structural attic survey, and itemized scope with {brand.name}. Zero deposit required.
                </p>

                {/* Pricing Reference Box */}
                <div className="my-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <span className="text-[10px] font-oswald uppercase tracking-widest text-crimson font-bold block mb-1">
                    {pricingGuidance.label}
                  </span>
                  <div className="text-2xl font-oswald font-bold text-zinc-900">
                    {pricingGuidance.range}
                  </div>
                  <p className="text-[11px] text-zinc-500 font-serif mt-1">
                    {pricingGuidance.sub}
                  </p>
                </div>

                {/* Turnkey Inclusions Checklist */}
                <div className="space-y-2.5 mb-6 text-xs font-serif text-zinc-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Drone roof scan & infrared moisture detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Itemized written quote with zero out-of-pocket games</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Certified non-prorated manufacturer warranty</span>
                  </div>
                </div>

                {/* Primary Booking Button */}
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3.5 px-5 rounded-full font-oswald uppercase tracking-wider font-bold text-sm shadow-md transition-all hover:scale-101 active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Book Free Inspection Window
                </button>

                {/* Secondary Direct Call Button */}
                <a
                  href={`tel:${brand.phone}`}
                  className="w-full mt-2.5 inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-zinc-900 py-3 px-5 rounded-full font-oswald uppercase tracking-wider font-bold text-xs border border-stone-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-crimson" /> Call Dispatch: {brand.phone}
                </a>

                {/* Link to Bottom Calculator with Toggle */}
                <div className="mt-4 pt-3 border-t border-stone-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCalculatorOpen(true);
                      setTimeout(() => {
                        document.getElementById("service-calculator")?.scrollIntoView({ behavior: "smooth" });
                      }, 120);
                    }}
                    className="text-[11px] font-oswald uppercase tracking-wider font-bold text-zinc-500 hover:text-crimson transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    Custom Square Footage Calculator {isCalculatorOpen ? "▲" : "▼"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On-Demand Interactive Cost Calculator Studio */}
      <section id="service-calculator" className="py-12 sm:py-16 px-4 sm:px-6 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm text-center">
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Precision Cost Modeling &bull; {brand.city}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
              Interactive Investment Estimator
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto font-serif mt-2 mb-6">
              Compare certified materials, calculate square footage, and model manufacturer warranty pricing for {brand.city}.
            </p>

            <button
              type="button"
              onClick={() => setIsCalculatorOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-101 active:scale-98 cursor-pointer"
            >
              <span>{isCalculatorOpen ? "Hide Cost Estimator Studio ▲" : "Launch Interactive Cost Calculator ▼"}</span>
            </button>

            {isCalculatorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-10 text-left pt-8 border-t border-stone-200"
              >
                <EstimateWizard />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Synchronized Inspection Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={serviceData.title}
      />
    </>
  );
}
