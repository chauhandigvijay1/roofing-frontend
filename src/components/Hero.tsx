import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

export default function Hero() {
  const { name } = useBrand();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero-video.mp4"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl"
        >
          Premium Roofing Solutions by {name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl"
        >
          Premium craftsmanship, trusted materials, and a 100% satisfaction
          guarantee. Your home is in expert hands.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 text-lg hover:scale-105 active:scale-95"
          >
            Get a Free Estimate
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Our Services
          </a>
        </motion.div>
      </div>
    </section>
  );
}
