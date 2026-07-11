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
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">Our Services</h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">From residential to commercial, we handle every roof.</p>
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
                className="bg-white overflow-hidden shadow-lg border-t-4 border-t-crimson transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
              >
                <img src={s.img} alt={s.title} className="w-full h-48 object-cover" />
                <div className="p-8">
                  <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2">{s.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed font-serif">{s.desc}</p>
                  <span className="mt-6 flex items-center text-sm font-oswald uppercase tracking-wider font-bold text-crimson group-hover:text-crimson-dark transition-colors">Explore Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" /></span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
