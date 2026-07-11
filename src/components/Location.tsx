import { useMemo } from "react";
import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

export default function Location() {
  const { city } = useBrand();

  const mapSrc = useMemo(() => {
    const encoded = encodeURIComponent(city);
    return `https://maps.google.com/maps?q=${encoded}&t=m&z=10&output=embed`;
  }, [city]);

  return (
    <section id="location" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
            Proudly Serving{" "}
            <span className="text-crimson">{city}</span> and Surrounding Areas
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif">
            We bring premium roofing to your neighborhood. Contact us today for
            a free onsite estimate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-hidden shadow-xl shadow-stone-200/50 border-4 border-white"
        >
          <iframe
            title={`Service Area — ${city}`}
            src={mapSrc}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-96"
          />
        </motion.div>
      </div>
    </section>
  );
}
