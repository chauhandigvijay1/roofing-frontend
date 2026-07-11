import { motion } from "framer-motion";
import { Shield, HardHat, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Licensed Experts",
    desc: "Fully insured and certified contractors with decades of combined experience in residential roofing.",
  },
  {
    icon: HardHat,
    title: "Quality Materials",
    desc: "We source only the best shingles, metal panels, and underlayment from trusted American manufacturers.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Emergency repairs available around the clock. We respond within 2 hours, no matter the weather.",
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

export default function FeatureCards() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-24 pb-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-8"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-100 hover:shadow-3xl transition-shadow duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center mb-6">
              <f.icon className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
            <p className="text-slate-600 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
