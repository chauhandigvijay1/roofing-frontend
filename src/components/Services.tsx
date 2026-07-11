import { motion } from "framer-motion";
import { Shield, RotateCw, CloudLightning } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Roof Repair",
    desc: "Fast, reliable repairs for leaks, missing shingles, and storm damage. We restore the integrity of your roof with precision.",
  },
  {
    icon: RotateCw,
    title: "Roof Replacement",
    desc: "Full tear-off and replacement using premium materials. Transform your home with a durable, beautiful new roof.",
  },
  {
    icon: CloudLightning,
    title: "Storm Damage",
    desc: "Emergency inspection and restoration after severe weather. We work directly with your insurance for a seamless claim process.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25 },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Services() {
  return (
    <section id="services" className="relative py-32 px-6">
      <div className="absolute inset-0 bg-[#121212]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Premium <span className="text-amber-500">Services</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Expertise you can trust, quality you can see.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={item}
              className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <s.icon className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {s.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
