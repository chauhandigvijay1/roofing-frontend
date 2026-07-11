import { motion } from "framer-motion";
import { ClipboardList, FileText, HardHat, HeartHandshake } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Free Inspection", desc: "We assess your roof and identify all issues with a detailed walkthrough." },
  { icon: FileText, title: "Transparent Quote", desc: "You get a clear, line-item estimate with no surprises or hidden costs." },
  { icon: HardHat, title: "Expert Execution", desc: "Our crew installs with precision, using top-tier materials and safety protocols." },
  { icon: HeartHandshake, title: "Peace of Mind", desc: "We walk the site, clean everything, and hand you a completed roof you'll love." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Process() {
  return (
    <section id="process" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">4 Simple Steps</h2>
          <p className="mt-4 text-zinc-600 text-lg max-w-xl mx-auto">From inspection to completion — we make it effortless.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-4 gap-8"
        >
          {steps.map((s, i) => (
            <motion.div key={s.title} variants={item} className="text-center relative">
              <div className="w-16 h-16 rounded-sm bg-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-600/20">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <div className="absolute top-0 left-[60%] w-full hidden md:block">
                {i < steps.length - 1 && (
                  <div className="h-0.5 bg-amber-200 mt-8 -ml-4" />
                )}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-2">{s.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
