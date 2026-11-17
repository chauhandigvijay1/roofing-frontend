import { useEffect, useRef, useState } from "react";
import { motion, animate, useInView } from "framer-motion";
import { useBrand } from "../BrandContext";

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
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Stats() {
  const brand = useBrand();

  const statsList = [
    { value: brand.reviewsCount || 48, suffix: "+", label: "Verified 5-Star Reviews" },
    { value: 20, suffix: "+", label: `Years Serving ${brand.city}` },
    { value: brand.rating || 4.9, suffix: "", label: "Google Customer Rating", decimals: 1 },
    { value: 100, suffix: "%", label: "Licensed & Guaranteed" },
  ];

  return (
    <section className="bg-zinc-900 text-white py-16 border-y border-zinc-800">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        {statsList.map((s) => (
          <motion.div key={s.label} variants={item}>
            <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
            <p className="text-zinc-400 text-xs md:text-sm font-oswald uppercase tracking-wider mt-2 font-bold">
              {s.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
