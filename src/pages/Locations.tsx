import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { useBrand } from "../BrandContext";

const cities = [
  "Dallas",
  "Fort Worth",
  "Austin",
  "Houston",
  "San Antonio",
  "Plano",
];

export default function Locations() {
  const { name, phone } = useBrand();

  return (
    <section className="pt-36 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">Areas We Serve</h1>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">
            {name} is proud to serve homeowners and businesses across Texas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-8 border border-stone-100 border-t-4 border-t-crimson shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-crimson shrink-0" />
                <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900">{city}</h3>
              </div>
              <a href={`tel:${phone}`} className="flex items-center gap-2 text-zinc-600 hover:text-crimson transition-colors font-serif">
                <Phone className="w-4 h-4" />
                <span>{phone}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
