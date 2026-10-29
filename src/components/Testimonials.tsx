import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useBrand } from "../BrandContext";

const genericReviews = [
  { name: "Michael T.", text: "They patched my roof during a rainstorm. Fast and professional." },
  { name: "Sarah L.", text: "Full replacement was seamless. The new roof looks stunning." },
  { name: "David R.", text: "Handled the insurance claim and had us under a new roof in 3 days." },
  { name: "Jessica M.", text: "Fair pricing, excellent communication, and immaculate cleanup." },
  { name: "Robert K.", text: "Been using them for 5 years. Never a single leak or issue." },
];

const jimTestimonials = [
  {
    name: "Mark & Brenda S. — St. Augustine, FL",
    text: "Concrete tile roof replaced with Worthouse metal for half the price of $100k competing bids after Hurricane Ian. We nailed it!",
  },
  {
    name: "Dave & Cheryl M. — Orange Park, FL",
    text: "Jim's suggestion of an energy-efficient solar vent dropped our power bill. Polite crew that protected our animals.",
  },
  {
    name: "Marcus T. — Jacksonville, FL",
    text: "5 ceiling leaks fixed the very next business day during storm season. Best roofer in Duval County.",
  },
];

const drewTestimonials = [
  {
    name: "Robert M. — Lakeway, TX",
    text: "Replaced our roof in Lakeway after a severe hailstorm. As an engineer, I appreciated Drew's building science approach.",
  },
  {
    name: "Sarah H. — West Lake Hills, TX",
    text: "Handled our insurance claim 100% by the book under Texas law. Cleaned up every single nail.",
  },
  {
    name: "David R. — Round Rock, TX",
    text: "Emergency leak fixed at 10 PM during torrential rain. Best roofer in Central Texas.",
  },
];

const richardTestimonials = [
  {
    name: "Michael T. — Katy, TX",
    text: "Paramount Roofing replaced our entire roof after severe wind storms in Katy. Prompt, professional, and precise.",
  },
  {
    name: "David R. — Sugar Land, TX",
    text: "Replaced our commercial flat roof with zero downtime for our business. Honest communication and fair pricing.",
  },
  {
    name: "Elena G. — The Woodlands, TX",
    text: "Outstanding emergency leak repair and roof inspection. True Houston roofing experts for over 31 years.",
  },
];

export default function Testimonials() {
  const brand = useBrand();
  const { city } = brand;
  const reviews = brand.isJim
    ? jimTestimonials
    : brand.isDrew
    ? drewTestimonials
    : brand.isRichard
    ? richardTestimonials
    : genericReviews;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [brand]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const r = reviews[index] || reviews[0];

  return (
    <section id="testimonials" className="py-24 px-6 bg-stone-50">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">
            Trusted by Homeowners in {city}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
        </motion.div>

        <div className="relative bg-white shadow-xl shadow-stone-200/50 border border-stone-200 p-10 mt-10">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-crimson text-crimson" />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-zinc-700 text-lg leading-relaxed mb-6 font-serif"
            >
              &ldquo;{r.text}&rdquo;
            </motion.p>
          </AnimatePresence>

          <p className="text-zinc-900 font-oswald uppercase tracking-wider font-bold">{r.name}</p>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-crimson transition-colors" aria-label="Previous review">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-crimson transition-colors" aria-label="Next review">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
