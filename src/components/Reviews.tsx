import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Reviews() {
  return (
    <section id="reviews" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">
            Social Proof
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Trusted by 500+ Homeowners
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">
            See why locals choose us to protect what matters most.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {reviews.map((r) => (
            <motion.div
              key={r.name}
              variants={item}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>
              <p className="text-slate-900 font-semibold text-sm">{r.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
