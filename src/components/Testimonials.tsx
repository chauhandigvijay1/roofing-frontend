import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useBrand } from "../BrandContext";

const allReviews = [
  { name: "Michael T.", text: "They patched my roof during a rainstorm. Fast and professional." },
  { name: "Sarah L.", text: "Full replacement was seamless. The new roof looks stunning." },
  { name: "David R.", text: "Handled the insurance claim and had us under a new roof in 3 days." },
  { name: "Jessica M.", text: "Fair pricing, excellent communication, and immaculate cleanup." },
  { name: "Robert K.", text: "Been using them for 5 years. Never a single leak or issue." },
];

export default function Testimonials() {
  const { city } = useBrand();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % allReviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + allReviews.length) % allReviews.length);
  const next = () => setIndex((i) => (i + 1) % allReviews.length);
  const r = allReviews[index];

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

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-crimson transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-crimson transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
