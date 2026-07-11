import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

export default function Location() {
  const { city } = useBrand();

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
            title="Service Area"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3387751.9197551715!2d-100.074161812083!3d31.99734517898663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864070360b823869%3A0x1e7a0d1c7a0e0c1!2sTexas%2C+USA!5e0!3m2!1sen!2s!4v1"
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
