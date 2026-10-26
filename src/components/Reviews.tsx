import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useBrand } from "../BrandContext";

interface ReviewItem {
  name: string;
  location?: string;
  text: string;
  rating: number;
}

const reviews: ReviewItem[] = [
  {
    name: "Michael T.",
    text: "They patched my roof in under 4 hours during a rainstorm. Incredibly fast and professional. Won't call anyone else.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    text: "Full replacement was seamless. The team was punctual, cleaned up every nail, and the new roof looks stunning. Worth every penny.",
    rating: 5,
  },
  {
    name: "David R.",
    text: "After a tornado ripped through our neighborhood, they handled the insurance claim and had us back under a new roof in 3 days.",
    rating: 5,
  },
];

const drewReviews: ReviewItem[] = [
  {
    name: "Robert M.",
    location: "Lakeway, TX",
    text: "Drew Boy and his team replaced our roof in Lakeway after a severe hailstorm. As an engineer myself, I appreciated Drew's building science explanation of our attic ventilation. Outstanding craftsmanship.",
    rating: 5,
  },
  {
    name: "Sarah H.",
    location: "West Lake Hills, TX",
    text: "Instant Roofing handled our West Lake Hills home with total professionalism. Handled our insurance claim 100% by the book under Texas law. Cleaned up every single nail.",
    rating: 5,
  },
  {
    name: "David R.",
    location: "Round Rock, TX",
    text: "Emergency leak fixed at 10 PM during torrential rain in Round Rock. Drew's team arrived with an emergency tarp and saved our hardwood floors. Best roofer in Central Texas.",
    rating: 5,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Reviews() {
  const brand = useBrand();
  const currentReviews = brand.isDrew ? drewReviews : reviews;

  return (
    <section id="reviews" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
            {brand.isDrew ? "Trusted by 96+ Austin Homeowners" : "Trusted by 500+ Homeowners"}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">
            {brand.isDrew
              ? "See why Central Texas families trust Drew Boy & Instant Roofing for building science craftsmanship."
              : "See why locals choose us to protect what matters most."}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {currentReviews.map((r) => (
            <motion.div
              key={r.name}
              variants={item}
              className="bg-stone-50 p-8 border border-stone-200 border-t-4 border-t-crimson hover:shadow-xl hover:shadow-stone-200/50 transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-crimson text-crimson" />
                ))}
              </div>
              <p className="text-zinc-800 leading-relaxed mb-6 font-serif">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <p className="text-zinc-900 font-oswald uppercase tracking-wider font-bold text-sm">
                  {r.name}
                </p>
                {r.location && (
                  <span className="text-zinc-500 font-serif text-xs italic">
                    {r.location}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
