import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Stats() {
  const { city } = useBrand();

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-16 pb-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {[
          { label: `Roofs Replaced in ${city}`, end: 500, suffix: "+" },
          { label: "Years of Experience", end: 25, suffix: "+" },
          { label: "5-Star Reviews", end: 1200, suffix: "+" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="py-10 text-center border-r border-gray-100 last:border-r-0"
          >
            <p className="text-4xl md:text-5xl font-extrabold text-blue-600">
              <Counter end={stat.end} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-slate-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
