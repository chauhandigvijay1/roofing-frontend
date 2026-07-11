import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does a typical roof replacement take?",
    a: "Most residential replacements are completed in 1–3 days depending on the size, pitch, and weather conditions. We always provide a precise timeline in your free estimate.",
  },
  {
    q: "Do you work with insurance companies?",
    a: "Yes. We help you document storm damage, file claims, and communicate with your adjuster so you get maximum coverage with minimal hassle.",
  },
  {
    q: "What payment options do you offer?",
    a: "We accept cash, check, credit cards, and offer flexible financing through approved lenders. Payment is due upon completion and your satisfaction.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-stone-50 rounded-sm border border-stone-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-zinc-900">{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-zinc-600 leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
