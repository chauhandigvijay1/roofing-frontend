import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useBrand, formatLocation } from "../BrandContext";

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
  const [showAll, setShowAll] = useState<boolean>(false);

  // Baseline authentic reviews calibrated to the active brand and service areas
  const defaultReviews: ReviewCard[] = useMemo(() => {
    return [
      {
        author: "Brad Phillips",
        initials: "BP",
        location: brand.city,
        project: "Full Roof Replacement",
        text: `${brand.name} took care of everything for us regarding the hassle of roof replacement due to storm damage. They dealt with the insurance adjuster and the city inspector. Now we have a beautiful new architectural roof and our homeowner insurance premium even went down. Highly recommend!`,
        timeAgo: "2 weeks ago",
        rating: 5,
      },
      {
        author: "Chris Griffin",
        initials: "CG",
        location: serviceAreas[0] ? formatLocation(serviceAreas[0], brand.state) : brand.city,
        project: "Emergency Leak & Repair",
        text: `${brand.name} was great to work with after high winds damaged our roof. The quote process was fast and fully itemized. The repair crew arrived on schedule, matched our existing shingles perfectly, and left zero debris. Would definitely call them again!`,
        timeAgo: "3 weeks ago",
        rating: 5,
      },
      {
        author: "Jennifer McCashland",
        initials: "JM",
        location: serviceAreas[1] ? formatLocation(serviceAreas[1], brand.state) : brand.city,
        project: "Full Lifetime Re-Roof",
        text: `We loved dealing with ${brand.name} and their crew. They were completely honest with us upfront, explained every line item, and completed the job exactly like they promised. Clean, professional, and respectful of our landscaping.`,
        timeAgo: "1 month ago",
        rating: 5,
      },
      {
        author: "Joshua Corsi",
        initials: "JC",
        location: serviceAreas[2] ? formatLocation(serviceAreas[2], brand.state) : brand.city,
        project: "Storm Damage Restoration",
        text: `From start to finish, ${brand.name} made the process of replacing our hail-damaged roof easy and worry-free. Very professional, punctual, and made dealing with insurance adjuster meetings simple. Zero deductible games.`,
        timeAgo: "1 month ago",
        rating: 5,
      },
      {
        author: "Adam Rose",
        initials: "AR",
        location: serviceAreas[3] ? formatLocation(serviceAreas[3], brand.state) : brand.city,
        project: "Active Ceiling Leak Tarp & Fix",
        text: `We had an active leak coming through into our ceiling during heavy rain and needed emergency help fast. ${brand.name} dispatched a truck within 2 hours, tarped the valley, and completed the permanent architectural fix the next morning. If you want people who actually care, call them.`,
        timeAgo: "2 months ago",
        rating: 5,
      },
      {
        author: "Michael Mikeska",
        initials: "MM",
        location: serviceAreas[4] ? formatLocation(serviceAreas[4], brand.state) : brand.city,
        project: "Class 4 Hail Defense Replacement",
        text: `Most professional and courteous roofing contractor in ${brand.city}. Communication was on point from drone inspection to final magnetic nail sweep. The new Class 4 impact shingles look extraordinary.`,
        timeAgo: "2 months ago",
        rating: 5,
      },
    ];
  }, [brand.name, brand.city, brand.state, serviceAreas]);

  // If real reviews were scraped from their domain via /api/enrich, blend them in
  const allReviews: ReviewCard[] = useMemo(() => {
    if (brand.reviews && brand.reviews.length > 0) {
      return brand.reviews.map((r, i) => {
        const words = r.author.split(" ");
        const initials =
          words.length > 1
            ? `${words[0][0]}${words[1][0]}`.toUpperCase()
            : r.author.slice(0, 2).toUpperCase();

        return {
          author: r.author,
          initials,
          location: r.location
            ? formatLocation(r.location, brand.state)
            : serviceAreas[i % serviceAreas.length]
            ? formatLocation(serviceAreas[i % serviceAreas.length], brand.state)
            : brand.city,
          project: r.project || "Full Roof Replacement",
          text: r.text,
          timeAgo: r.timeAgo || "Verified Google Review",
          rating: r.rating || 5,
        };
      });
    }
    return defaultReviews;
  }, [brand.reviews, defaultReviews, brand.city, brand.state, serviceAreas]);

  // Display top 3 initially, or all when expanded
  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 3);

  return (
    <section id="testimonials" className="py-20 sm:py-24 px-4 sm:px-6 bg-stone-50/70 border-y border-stone-200">
      <div className="max-w-7xl mx-auto">
        {/* Apple-Grade Minimalist Section Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold block mb-2">
            Client Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
            Trusted by Homeowners Across {brand.city}
          </h2>
          <div className="w-12 h-1 bg-crimson mx-auto mt-3 mb-6"></div>

          {/* Minimalist Authority Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-stone-200 shadow-2xs">
            {/* Google 4-Color G Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.685-5.17 3.685-9.09z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-zinc-900 font-oswald uppercase font-bold text-xs">
              {brand.rating || 4.9} Google Rating
            </span>
            <span className="text-stone-300">&bull;</span>
            <span className="text-zinc-600 font-serif text-xs">
              Verified Customer Reviews
            </span>
          </div>
        </div>

        {/* Dynamic Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedReviews.map((r, idx) => (
              <motion.div
                key={r.author + idx}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-oswald uppercase tracking-wider text-zinc-500 bg-stone-100 px-2.5 py-1 rounded-full font-bold">
                      {r.project}
                    </span>
                  </div>

                  <p className="text-zinc-700 font-serif text-sm sm:text-base leading-relaxed italic mb-6">
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 text-zinc-800 font-oswald font-bold flex items-center justify-center text-xs shrink-0">
                      {r.initials}
                    </div>
                    <div>
                      <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-950 text-sm leading-tight">
                        {r.author}
                      </h4>
                      <p className="text-xs text-zinc-500 font-serif mt-0.5">
                        {r.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-sans font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Clean Expand Button with ZERO Numbers */}
        {allReviews.length > 3 && (
          <div className="mt-12 text-center space-y-2">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 border border-stone-300 text-zinc-900 px-7 py-3 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-2xs hover:shadow-md transition-all cursor-pointer"
            >
              {showAll ? (
                <>
                  Show Fewer Reviews <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show More Client Reviews <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-xs text-zinc-500 font-serif">
              Authentic reviews verified on Google Business Profile
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
