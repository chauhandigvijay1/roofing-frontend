import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, BadgePercent, Phone, Calculator, ShieldCheck } from "lucide-react";
import { useBrand } from "../BrandContext";
import BookingModal from "../components/BookingModal";
import EstimateWizard from "../components/EstimateWizard";

export default function Financing() {
  const brand = useBrand();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const plans = [
    {
      icon: CreditCard,
      title: "0% APR for 12 to 18 Months",
      desc: `On approved credit. Zero interest if paid in full within the promotional period. Ideal for rapid roof restorations and storm recovery in ${brand.city}.`,
    },
    {
      icon: Calendar,
      title: "Low Payments from $130/Month",
      desc: "Flexible terms spread over 24, 36, 48, or 60 months with leading national lenders. Fixed monthly payments with zero surprises.",
    },
    {
      icon: BadgePercent,
      title: "Zero Down & Soft Credit Pull",
      desc: "Get pre-qualified in under 60 seconds with no impact on your credit score. Zero money down required to mobilize our certified crews.",
    },
  ];

  return (
    <>
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-white min-h-screen">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Affordable Ownership &bull; {brand.city}
            </span>
            <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
              Flexible Roof Financing Options
            </h1>
            <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-6"></div>
            <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto font-serif leading-relaxed">
              {brand.name} partners with top home improvement financing institutions to offer competitive interest rates, fast pre-approvals, and $0 down terms across {brand.city}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-14">
            {plans.map((p) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-stone-50 p-7 sm:p-8 rounded-3xl border border-stone-200 border-t-4 border-t-crimson text-center hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 bg-crimson/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <p.icon className="w-7 h-7 text-crimson" />
                  </div>
                  <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-3">
                    {p.title}
                  </h3>
                  <p className="text-zinc-600 text-xs sm:text-sm font-serif leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200/60 text-[11px] font-oswald uppercase tracking-wider text-emerald-700 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Instant Decision Available
                </div>
              </motion.div>
            ))}
          </div>

          {/* Easy Approval Process Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-stone-50 rounded-3xl p-8 sm:p-10 border border-stone-200 mb-14"
          >
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
                Streamlined Approval
              </span>
              <h2 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
                How Financing Works with {brand.name}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { step: "01", title: "60-Second Application", desc: "Quick paperless online form with zero hidden fees." },
                { step: "02", title: "Soft Credit Check", desc: "Check your pre-qualified rates without affecting credit score." },
                { step: "03", title: "Transparent Terms", desc: "Select the monthly installment plan that best fits your budget." },
                { step: "04", title: "Same-Day Mobilization", desc: "We schedule your roof replacement with zero delay." },
              ].map((item) => (
                <div key={item.step} className="bg-white p-5 rounded-2xl border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-crimson text-white font-oswald font-bold flex items-center justify-center text-xs mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-600 font-serif leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Calculator Studio & Pre-Approval Booking */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm text-center">
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Ready to Get Started?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
              Apply for Pre-Approval & Book Free Inspection
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-xl mx-auto font-serif mt-2 mb-8">
              Lock in competitive rates and schedule your complimentary 21-point drone roof survey with {brand.name}. Zero obligation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" /> Book Inspection with Financing
              </button>
              <a
                href={`tel:${brand.phone}`}
                className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-zinc-900 py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm border border-stone-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-crimson" /> Call Lending Desk: {brand.phone}
              </a>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{isCalculatorOpen ? "Hide Monthly Estimator ▲" : "Launch Payment Estimator ▼"}</span>
              </button>
            </div>

            {isCalculatorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-12 text-left pt-8 border-t border-stone-200"
              >
                <EstimateWizard />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService="Financing Consultation & Free 21-Point Inspection"
      />
    </>
  );
}
