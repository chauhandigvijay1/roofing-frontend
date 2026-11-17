import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useBrand } from "../BrandContext";

export default function Testimonials() {
  const brand = useBrand();

  const testimonials = [
    {
      author: "Michael T.",
      location: brand.city,
      text: `${brand.name} replaced our roof after a destructive hail storm. The line-item estimate was completely transparent, cleanup was flawless, and the new architectural shingles look extraordinary.`,
    },
    {
      author: "Sarah & David L.",
      location: brand.city,
      text: `When our roof started leaking into the master bedroom during heavy rain, ${brand.name} dispatched their emergency truck in under 2 hours. Professional, honest, and zero price gouging.`,
    },
    {
      author: "Marcus & Elena R.",
      location: brand.city,
      text: `Outstanding communication from initial drone inspection through final walkthrough. They coordinated directly with our insurance adjuster and got our entire roof approved. Cannot recommend them enough!`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-12 h-12 bg-crimson/20 border border-crimson/40 text-crimson rounded-full flex items-center justify-center mx-auto mb-6">
          <Quote className="w-6 h-6" />
        </div>

        <h2 className="text-3xl md:text-5xl font-oswald uppercase tracking-wider font-bold mb-4">
          Trusted by Property Owners Across {brand.city}
        </h2>
        <div className="w-16 h-1 bg-crimson mx-auto mb-10"></div>

        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              <div className="flex justify-center text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-lg md:text-xl font-serif text-zinc-300 italic leading-relaxed">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </p>
              <div className="pt-2">
                <span className="font-oswald uppercase tracking-wider font-bold text-white block">
                  {testimonials[currentIndex].author}
                </span>
                <span className="text-xs text-zinc-500 font-serif">
                  {testimonials[currentIndex].location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
            }
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === i ? "bg-crimson w-6" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="p-2 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
