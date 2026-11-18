import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Phone, Calendar } from "lucide-react";
import { useBrand } from "../BrandContext";
import BookingModal from "./BookingModal";

export default function FAQ() {
  const brand = useBrand();
  const [open, setOpen] = useState<number | null>(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Dynamically generated regional & trade-specific FAQs tailored to the active contractor
  const dynamicFaqs = useMemo(() => {
    return [
      {
        q: `How long does a typical roof replacement take with ${brand.name}?`,
        a: `Most residential roof replacements across ${brand.city} are completed within 1 to 2 business days. Our master crews arrive at 7:00 AM, complete structural tear-off, install synthetic water barriers, install shingles or metal panels, and perform triple magnetic roller sweeps around your lawn to capture every nail.`,
      },
      {
        q: `Does ${brand.name} coordinate with insurance companies for storm & hail claims?`,
        a: `Yes. We provide complete forensic documentation, aerial drone scans, and itemized damage assessments for your insurance adjuster walk-through. We coordinate directly with your adjuster to ensure your entire scope of damage is covered without any out-of-pocket deductible games.`,
      },
      {
        q: `What warranty coverage is included with my installation in ${brand.city}?`,
        a: `Every full roof replacement installed by ${brand.name} includes non-prorated lifetime manufacturer material warranties (GAF Timberline HDZ / Owens Corning Duration) alongside our dedicated workmanship guarantee.`,
      },
      {
        q: brand.state === "FL"
          ? "How much can a Florida Wind Mitigation inspection save on homeowners insurance?"
          : `Does installing a Class 4 impact roof lower insurance premiums in ${brand.state}?`,
        a: brand.state === "FL"
          ? "Most Florida property owners save between 15% and 45% (often $500 to $1,200 annually) on windstorm insurance premiums once qualified hurricane clips, nail spacing, and secondary water barriers (SWR) are certified."
          : `Yes. Installing UL 2218 Class 4 impact-resistant shingles or standing seam metal qualifies homeowners across ${brand.city} for up to 28% permanent annual discounts on their homeowner insurance policy.`,
      },
      {
        q: brand.isCommercial
          ? `Can ${brand.name} install commercial TPO membranes on occupied facilities?`
          : "Can you match my home's existing shingle color and architectural profile?",
        a: brand.isCommercial
          ? `Yes. Our commercial single-ply TPO crews coordinate directly with your facility manager to schedule work, control dust, and maintain clear access during regular business hours with minimal disruption to operations.`
          : `Yes. We stock a comprehensive palette of architectural shingle lines from GAF, Owens Corning, and CertainTeed to match your existing roof profile and home aesthetic seamlessly.`,
      },
      {
        q: `How do I schedule a complimentary on-site inspection in ${brand.city}?`,
        a: `Click 'Book Free Inspection' on this page, choose your preferred morning or afternoon window, or call our direct dispatch hotline at ${brand.phone}. Zero deposit is required upfront.`,
      },
    ];
  }, [brand.name, brand.city, brand.state, brand.phone, brand.isCommercial]);

  return (
    <>
      <section id="faq" className="py-20 sm:py-24 px-4 sm:px-6 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold block mb-2">
              Common Questions &bull; {brand.city}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
              Frequently Asked Questions
            </h2>
            <div className="w-12 h-1 bg-crimson mx-auto mt-3 mb-4"></div>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto font-serif">
              Clear, transparent answers on timelines, pricing scopes, warranties, and insurance claim coordination with {brand.name}.
            </p>
          </motion.div>

          <div className="space-y-3.5">
            {dynamicFaqs.map((f, i) => (
              <div
                key={i}
                className="bg-stone-50 rounded-2xl border border-stone-200/90 overflow-hidden transition-all hover:border-stone-300"
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <span className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm sm:text-base pr-4">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${
                      open === i ? "rotate-180 text-crimson" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 border-t border-stone-200/60 text-zinc-700 leading-relaxed font-serif text-sm">
                        <p>{f.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Quick Help Callout */}
          <div className="mt-12 p-6 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-crimson/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-crimson" />
              </div>
              <div>
                <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-950 text-sm">
                  Have a Specific Question About Your Roof?
                </h4>
                <p className="text-xs text-zinc-600 font-serif">
                  Speak directly with our local {brand.city} dispatch team.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-1.5 bg-crimson hover:bg-crimson-dark text-white px-4 py-2 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Inspection
              </button>
              <a
                href={`tel:${brand.phone}`}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-100 text-zinc-900 border border-stone-300 px-4 py-2 rounded-full font-oswald uppercase tracking-wider font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-crimson" /> {brand.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService="FAQ Consultation & Free On-Site Inspection"
      />
    </>
  );
}
