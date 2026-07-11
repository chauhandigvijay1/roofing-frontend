import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, MapPin, ThumbsUp } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Fully Licensed" },
  { icon: BadgeCheck, label: "Insured & Bonded" },
  { icon: MapPin, label: "Local Expertise" },
  { icon: ThumbsUp, label: "100% Satisfaction" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TrustRibbon() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-16 pb-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-sm shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden"
      >
        {items.map((i) => (
          <motion.div
            key={i.label}
            variants={item}
            className="flex items-center justify-center gap-3 py-6 px-4 border-r border-gray-100 last:border-r-0"
          >
            <i.icon className="w-6 h-6 text-amber-600 shrink-0" />
            <span className="text-sm font-semibold text-zinc-700">{i.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
