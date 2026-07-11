import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "10+", label: "Years of Excellence" },
  { value: "5.0", label: "Average Rating" },
  { value: "100%", label: "Satisfaction Rate" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Stats() {
  return (
    <section className="bg-crimson text-white py-16 px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <p className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-wider">{s.value}</p>
            <p className="text-sm text-white/80 mt-2 font-serif">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
