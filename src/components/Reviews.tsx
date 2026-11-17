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

  const dynamicReviews: ReviewItem[] = [
    {
      author: "Robert M.",
      location: brand.city,
      rating: 5,
      project: "Full Roof Replacement",
      text: `${brand.name} replaced our entire roof after severe storms. Their crew was prompt, incredibly polite, and thoroughly rolled magnetic sweeps to catch every nail. The roof looks immaculate.`,
    },
    {
      author: "Sarah & David L.",
      location: brand.city,
      rating: 5,
      project: "Emergency Leak & Repair",
      text: `We had an active ceiling leak during a heavy storm. ${brand.name} dispatched an emergency technician within 2 hours, tarped the compromised valley, and completed the permanent architectural shingle fix the next morning.`,
    },
    {
      author: "Marcus T.",
      location: brand.city,
      rating: 5,
      project: brand.isCommercial ? "Commercial Flat TPO Restoration" : "Storm Damage & Insurance Claim",
      text: brand.isCommercial
        ? `${brand.name} installed a 60-mil TPO single-ply system on our retail facility with zero business interruption. The cooling load reduction was noticeable immediately.`
        : `Handled our insurance adjuster walk-through seamlessly. They provided detailed digital photos and made sure our replacement was approved without any hidden costs or deductible games.`,
    },
  ];

  return (
    <section className="py-24 px-6 bg-stone-100 border-t border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Verified Customer Feedback
          </span>
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Why Property Owners Trust {brand.name}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <div className="flex items-center justify-center gap-2 text-amber-500 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-zinc-900 font-oswald uppercase font-bold text-sm ml-2">
              {brand.rating || 4.9} Out of 5.0 Rating Across {brand.reviewsCount || 48}+ Projects
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {dynamicReviews.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 border border-stone-200 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-oswald uppercase tracking-wider bg-stone-100 text-zinc-700 px-2.5 py-0.5 font-bold">
                    {r.project}
                  </span>
                </div>
                <p className="text-zinc-700 font-serif leading-relaxed text-sm mb-6">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="font-oswald uppercase tracking-wider font-bold text-sm text-zinc-900">
                    {r.author}
                  </div>
                  <div className="text-xs text-zinc-500 font-serif">{r.location}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-serif">
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
