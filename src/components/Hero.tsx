import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

export default function Hero() {
  const { name } = useBrand();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/before-roof.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero-video.mp4"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-40">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-crimson text-white py-1 px-4 text-sm font-oswald font-bold tracking-widest inline-block mb-6"
        >
          BBB ACCREDITED &bull; FULLY INSURED
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-oswald uppercase tracking-wider font-bold text-white leading-tight max-w-4xl"
        >
          Expert Roofing Solutions by {name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-zinc-200 max-w-2xl font-serif"
        >
          Premium craftsmanship, trusted materials, and a 100% satisfaction
          guarantee. Your home is in expert hands.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex gap-4 relative z-30"
        >
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-crimson hover:bg-crimson-dark text-white font-oswald uppercase tracking-wider font-bold transition-all duration-300 text-lg hover:scale-105 active:scale-95"
          >
            Get a Free Estimate
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-oswald uppercase tracking-wider font-bold transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            Our Services
          </a>
        </motion.div>
      </div>
    </section>
  );
}
