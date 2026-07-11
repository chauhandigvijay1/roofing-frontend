import { motion } from "framer-motion";

const services = [
  {
    title: "Metal Roofing",
    desc: "Premium standing seam and corrugated metal roofs that last 50+ years. Energy-efficient, fire-resistant, and beautiful.",
    img: "/service-metal.jpg",
  },
  {
    title: "Asphalt Shingles",
    desc: "Classic architectural shingles with 30-year warranties. Durable, affordable, and available in dozens of styles.",
    img: "/service-shingle.jpg",
  },
  {
    title: "Roof Repair",
    desc: "Emergency repairs, leak detection, and storm damage restoration. Same-day service available for urgent issues.",
    img: "/service-repair.jpg",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Our Services
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">
            From new installations to emergency repairs, we do it all.
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
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            >
              <img
                src={s.img}
                alt={s.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
