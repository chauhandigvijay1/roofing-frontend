import { motion } from "framer-motion";
import { useBrand } from "../BrandContext";

const projects = [
  { title: "Modern Farmhouse", location: "Austin, TX", img: "/after-roof.jpg" },
  { title: "Colonial Restoration", location: "Dallas, TX", img: "/before-roof.jpg" },
  { title: "Commercial Strip Mall", location: "Houston, TX", img: "/service-commercial.jpg" },
  { title: "Custom Metal Roof", location: "San Antonio, TX", img: "/service-metal.jpg" },
  { title: "Storm Recovery", location: "Fort Worth, TX", img: "/service-storm.jpg" },
  { title: "Luxury Shingle Estate", location: "Plano, TX", img: "/service-shingle.jpg" },
];

export default function Portfolio() {
  const { name } = useBrand();

  return (
    <section className="pt-36 pb-24 px-6 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-3">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900">Our Work</h1>
          <p className="mt-4 text-zinc-600 text-lg max-w-xl mx-auto">
            Every project tells a story. Here are some of our favorites from around Texas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-sm overflow-hidden shadow-xl shadow-stone-200/50 border border-stone-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-stone-200/50"
            >
              <img src={p.img} alt={p.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-zinc-900">{p.title}</h3>
                <p className="text-sm text-zinc-500">{p.location}</p>
                <p className="text-xs text-zinc-400 mt-1">A {name} project</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
