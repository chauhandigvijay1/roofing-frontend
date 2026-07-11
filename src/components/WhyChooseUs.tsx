import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useBrand } from "../BrandContext";

const points = [
  "Upfront Pricing — no hidden fees, ever.",
  "On-Time Execution — we start and finish as promised.",
  "Immaculate Clean-Up — we treat your home like our own.",
  "5-Year Workmanship Warranty on every job.",
];

export default function WhyChooseUs() {
  const { name } = useBrand();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-sm overflow-hidden shadow-xl shadow-stone-200/50"
        >
          <img
            src="/why-choose-us.jpg"
            alt="Why Choose Us"
            className="w-full h-80 md:h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">Why {name}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
            Built on Trust, Driven by Quality
          </h2>
          <div className="space-y-4">
            {points.map((p) => (
              <div key={p} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-zinc-700 text-lg">{p}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
