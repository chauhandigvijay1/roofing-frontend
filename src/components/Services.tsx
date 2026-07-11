import { motion } from "framer-motion";

const services = [
  {
    title: "Asphalt Shingles",
    desc: "Classic, durable, and affordable. We install architectural shingles with 30-year warranties for lasting curb appeal.",
    img: "https://placehold.co/600x400/f8fafc/334155?text=Asphalt+Shingles",
  },
  {
    title: "Metal Roofing",
    desc: "Premium standing seam and corrugated metal roofs that last 50+ years. Energy-efficient and fire-resistant.",
    img: "https://placehold.co/600x400/f8fafc/334155?text=Metal+Roofing",
  },
  {
    title: "Roof Repair",
    desc: "Fast, reliable emergency repairs for leaks, storm damage, and missing shingles. Same-day service available.",
    img: "https://placehold.co/600x400/f8fafc/334155?text=Roof+Repair",
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
    <section id="services" className="py-32 px-6 bg-slate-50">
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
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300"
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
