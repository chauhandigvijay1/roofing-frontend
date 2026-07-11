import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 10, suffix: "+", label: "Years of Excellence" },
  { value: 5.0, suffix: "", label: "Average Rating", decimals: 1 },
  { value: 100, suffix: "%", label: "Satisfaction Rate" },
];

function CountUp({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (v) => setDisplay(v.toFixed(decimals)),
      });
      return controls.stop;
    }
  }, [inView, value, decimals]);

  return (
    <p ref={ref} className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-wider">
      {display}{suffix}
    </p>
  );
}

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
    <section className="bg-crimson text-white py-12 px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            className="group transition-transform duration-300 hover:scale-110"
          >
            <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            <p className="text-sm text-white/80 mt-2 font-serif">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
