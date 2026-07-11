import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

export default function Gallery() {
  const { name } = useBrand();

  return (
    <section id="gallery" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">
            Before & After
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            See the <span className="text-blue-600">Transformation</span>
          </h2>
          <p className="mt-4 text-slate-600 text-lg max-w-xl mx-auto">
            Real results from real projects in your community.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/before-roof.jpg"
                alt="Before"
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <span className="text-white font-bold text-lg">The Damage</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/after-roof.jpg"
                alt="After"
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <span className="text-white font-bold text-lg">
                  The {name} Solution
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
