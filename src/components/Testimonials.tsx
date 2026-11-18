import { motion } from "framer-motion";
import { Star, CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { useBrand } from "../BrandContext";

interface ReviewCard {
  author: string;
  initials: string;
  location: string;
  project: string;
  text: string;
  timeAgo: string;
  rating: number;
}

export default function Testimonials() {
  const brand = useBrand();
  const serviceAreas = brand.serviceAreas || [];

  const reviews: ReviewCard[] = [
    {
      author: "Robert M.",
      initials: "RM",
      location: brand.city,
      project: "Full Roof Replacement",
      text: `${brand.name} replaced our entire roof after severe storms. Their crew arrived right on time, completed the tear-off and installation in 1.5 days, and thoroughly rolled magnetic sweeps around our lawn to catch every stray nail. The new roof looks immaculate.`,
      timeAgo: "2 weeks ago",
      rating: 5,
    },
    {
      author: "Sarah & David L.",
      initials: "SL",
      location: serviceAreas[0] ? `${serviceAreas[0]}, ${brand.state}` : brand.city,
      project: "Emergency Leak & Repair",
      text: `When our roof started leaking into the master bedroom during heavy rain, ${brand.name} dispatched their emergency truck in under 2 hours. Professional, honest, and zero price gouging. They completed the permanent architectural fix the next morning.`,
      timeAgo: "3 weeks ago",
      rating: 5,
    },
    {
      author: "Marcus & Elena R.",
      initials: "MR",
      location: serviceAreas[1] ? `${serviceAreas[1]}, ${brand.state}` : brand.city,
      project: brand.isCommercial ? "Commercial Flat TPO Restoration" : "Storm Damage & Insurance Claim",
      text: brand.isCommercial
        ? `${brand.name} installed a 60-mil TPO single-ply system on our commercial retail facility with zero business interruption. The cooling load reduction was noticeable immediately and their 20-year warranty gives us total peace of mind.`
        : `Handled our insurance adjuster walk-through seamlessly. They provided detailed drone scans and forensic photos, ensuring our full architectural shingle replacement was approved without any hidden fees or out-of-pocket games.`,
      timeAgo: "1 month ago",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-14 sm:py-20 px-4 sm:px-6 bg-stone-100/80 border-y border-stone-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Verified Homeowner Feedback &bull; {brand.city}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Trusted by Property Owners Across {brand.city}
          </h2>
          <div className="w-14 h-1 bg-crimson mx-auto mt-3 mb-5"></div>

          {/* Google Authority Badge & Trust Highlights */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 p-1.5 sm:p-2 bg-white rounded-2xl sm:rounded-full border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-50 rounded-full border border-stone-200">
              <span className="font-bold text-zinc-800 text-xs flex items-center gap-1">
                <span className="text-blue-500 font-extrabold">G</span>oogle Rating
              </span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-zinc-900 font-oswald uppercase font-bold text-xs">
                {brand.rating || 4.9} / 5.0 ({brand.reviewsCount || 48}+ Reviews)
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs font-serif text-zinc-600 px-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% On-Time Completion
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Magnetic Nail Sweep Guarantee
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-crimson" /> Zero Deposit Required
              </span>
            </div>
          </div>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Review Header: Stars, Google Pill & Project Scope */}
                <div className="flex items-center justify-between mb-3.5 gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-oswald uppercase tracking-wider bg-stone-100 text-zinc-700 px-2.5 py-0.5 rounded-full font-bold truncate max-w-[170px]">
                    {r.project}
                  </span>
                </div>

                {/* Review Body */}
                <p className="text-zinc-700 font-serif leading-relaxed text-sm sm:text-[14.5px] mb-5">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              {/* Reviewer Details & Verification */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-crimson/10 border border-crimson/20 text-crimson font-oswald uppercase font-bold text-xs flex items-center justify-center shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <div className="font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                      {r.author}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-serif">
                      {r.location}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-sans font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </div>
                  <div className="text-[10px] text-zinc-400 font-serif">
                    {r.timeAgo}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
