import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  { slug: "residential", title: "Residential Replacement", desc: "Full tear-off and replacement with premium architectural shingles or metal panels.", img: "/service-metal.jpg" },
  { slug: "repair", title: "Emergency Repair", desc: "24/7 emergency tarping, leak stops, and storm damage mitigation to protect your home.", img: "/service-repair.jpg" },
  { slug: "storm-damage", title: "Storm Damage", desc: "Complete insurance claim assistance and restoration after hail, wind, or tornado damage.", img: "/service-storm.jpg" },
  { slug: "commercial", title: "Commercial Roofing", desc: "TPO, PVC, and modified bitumen systems for flat and low-slope commercial buildings.", img: "/service-commercial.jpg" },
  { slug: "maintenance", title: "Maintenance", desc: "Bi-annual inspections, gutter cleaning, sealant checks, and minor repairs to extend roof life.", img: "/service-shingle.jpg" },
  { slug: "gutters", title: "Gutters", desc: "Custom seamless gutter installation, gutter guards, and downspout repairs in matching colors.", img: "/service-gutters.jpg" },
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
    <section id="services" className="py-24 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">Our Services</h2>
          <p className="mt-4 text-zinc-600 text-lg max-w-xl mx-auto">From residential to commercial, we handle every roof.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`}>
              <motion.div
                variants={item}
                className="bg-white rounded-sm overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-stone-200/50 cursor-pointer"
              >
                <img src={s.img} alt={s.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{s.title}</h3>
                   <p className="text-zinc-600 text-sm leading-relaxed">{s.desc}</p>
                    <span className="mt-6 flex items-center text-sm font-bold tracking-widest uppercase text-amber-600 group-hover:text-amber-700 transition-colors">Explore Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" /></span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
