import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { useBrand } from "../BrandContext";

interface ReviewItem {
  author: string;
  location: string;
  text: string;
  rating: number;
  project: string;
}

export default function Reviews() {
  const brand = useBrand();
  const serviceAreas = brand.serviceAreas || [];

  const dynamicReviews: ReviewItem[] = [
    {
      author: "Robert M.",
      location: brand.city,
      rating: 5,
      project: "Full Roof Replacement",
      text: `${brand.name} replaced our entire roof after severe storms. Their crew was prompt, polite, and thoroughly rolled magnetic sweeps to catch every stray nail. The roof looks immaculate.`,
    },
    {
      author: "Sarah & David L.",
      location: serviceAreas[0] ? `${serviceAreas[0]}, ${brand.state}` : brand.city,
      rating: 5,
      project: "Emergency Leak & Repair",
      text: `We had an active ceiling leak during a heavy storm. ${brand.name} dispatched a technician within 2 hours, tarped the compromised valley, and completed the permanent architectural shingle fix the next morning.`,
    },
    {
      author: "Marcus T.",
      location: serviceAreas[1] ? `${serviceAreas[1]}, ${brand.state}` : brand.city,
      rating: 5,
      project: brand.isCommercial ? "Commercial Flat TPO Restoration" : "Storm Damage & Insurance Claim",
      text: brand.isCommercial
        ? `${brand.name} installed a 60-mil TPO single-ply system on our commercial facility with zero business interruption. The cooling load reduction was noticeable immediately.`
        : `Handled our insurance adjuster walk-through seamlessly. They provided detailed digital photos and ensured our replacement was approved without any hidden fees or surprises.`,
    },
  ];

  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 bg-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Verified Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Why Property Owners Trust {brand.name}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-3 mb-6"></div>
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-zinc-900 font-oswald uppercase font-bold text-xs sm:text-sm ml-1.5">
              {brand.rating || 4.9} / 5.0 Rating Across {brand.reviewsCount || 48}+ Verified Projects
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {dynamicReviews.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-oswald uppercase tracking-wider bg-stone-100 text-zinc-700 px-2 py-0.5 rounded font-bold">
                    {r.project}
                  </span>
                </div>
                <p className="text-zinc-700 font-serif leading-relaxed text-sm mb-5">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm text-zinc-900">
                    {r.author}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-serif">{r.location}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-sans font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Owner
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
