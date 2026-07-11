import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

function Counter({ end, suffix = "", inView }: { end: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, inView]);

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
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-16 pb-16" ref={ref}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
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
              <Counter end={stat.end} suffix={stat.suffix} inView={inView} />
            </p>
            <p className="mt-2 text-sm text-slate-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
