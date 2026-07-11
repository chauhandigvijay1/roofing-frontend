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
    <section id="reviews" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[#121212]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-500 text-sm font-semibold tracking-widest uppercase mb-3">
            Social Proof
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trusted by <span className="text-amber-500">500+</span> Homeowners
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
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
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-500"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>
              <p className="text-white font-semibold text-sm">{r.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
