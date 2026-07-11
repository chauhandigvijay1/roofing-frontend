import { motion } from "framer-motion";

interface HeroProps {
  name: string | null;
}

export default function Hero({ name }: HeroProps) {
  const headline = name
    ? `Premium Roofing Services by ${name}`
    : "Premium Roofing Services";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-[#121212]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)]" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Uncompromising quality. Expert craftsmanship. Your roof deserves nothing less.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex gap-4 justify-center"
        >
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25"
          >
            Our Services
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Get a Quote
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] to-transparent" />
    </section>
  );
}
