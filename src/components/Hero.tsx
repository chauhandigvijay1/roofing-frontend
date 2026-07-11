import { motion } from "framer-motion";

interface HeroProps {
  name: string | null;
}

export default function Hero({ name }: HeroProps) {
  const headline = name
    ? `Premium Roofing by ${name}`
    : "Premium Roofing Services";

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://placehold.co/1920x1080/1e293b/ffffff?text=Beautiful+Roofing+Background+Image")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-3xl"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl"
        >
          Expert craftsmanship, premium materials, and unbeatable service.
          Your home deserves the best roof in the neighborhood.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 text-lg"
          >
            Get a Free Estimate
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Our Services
          </a>
        </motion.div>
      </div>
    </section>
  );
}
