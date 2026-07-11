import { motion } from "framer-motion";

const services = [
  { title: "Residential Replacement", desc: "Full tear-off and replacement with premium architectural shingles or metal panels.", img: "/service-metal.jpg" },
  { title: "Emergency Repair", desc: "24/7 emergency tarping, leak stops, and storm damage mitigation to protect your home.", img: "/service-repair.jpg" },
  { title: "Storm Damage", desc: "Complete insurance claim assistance and restoration after hail, wind, or tornado damage.", img: "https://placehold.co/600x400/1e293b/ffffff?text=Storm+Damage" },
  { title: "Commercial Roofing", desc: "TPO, PVC, and modified bitumen systems for flat and low-slope commercial buildings.", img: "https://placehold.co/600x400/1e293b/ffffff?text=Commercial+Roofing" },
  { title: "Maintenance", desc: "Bi-annual inspections, gutter cleaning, sealant checks, and minor repairs to extend roof life.", img: "https://placehold.co/600x400/1e293b/ffffff?text=Maintenance" },
  { title: "Gutters", desc: "Custom seamless gutter installation, gutter guards, and downspout repairs in matching colors.", img: "https://placehold.co/600x400/1e293b/ffffff?text=Gutters" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Our Services</h2>
          <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">From residential to commercial, we handle every roof.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={item}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <img src={s.img} alt={s.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
