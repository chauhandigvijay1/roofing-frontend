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
    <section id="location" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">
            Service Area
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Proudly Serving{" "}
            <span className="text-blue-600">{city}</span> and Surrounding Areas
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
            We bring premium roofing to your neighborhood. Contact us today for
            a free onsite estimate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-xl border-4 border-white"
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
