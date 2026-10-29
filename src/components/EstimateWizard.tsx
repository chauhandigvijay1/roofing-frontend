import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../BrandContext";
import { Calculator, ShieldCheck, ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";

export default function EstimateWizard({ variant = "full" }: { variant?: "full" | "sidebar" }) {
  const brand = useBrand();
  const isSidebar = variant === "sidebar";
  const [step, setStep] = useState(0);
  const [scope, setScope] = useState<string>("Architectural Shingles");
  const [size, setSize] = useState<number>(25); // 25 squares default (~2,500 sq ft)
  const [windMitigation, setWindMitigation] = useState<boolean>(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic Price Calculation Logic
  const calculation = useMemo(() => {
    let basePerSquare = 440; // $440/sq standard architectural
    if (scope.includes("Metal")) basePerSquare = 720;
    if (scope.includes("TPO") || scope.includes("Commercial")) basePerSquare = 620;
    if (scope.includes("Repair") || scope.includes("Leak")) return { low: 450, high: 1450, savings: 0, monthly: 45 };
    const low = Math.round(size * basePerSquare * 0.95);
    const high = Math.round(size * basePerSquare * 1.25);
    const savings = windMitigation ? 850 : 0;
    const monthly = Math.round(low / 84); // 84-month fixed financing
    return { low, high, savings, monthly };
  }, [scope, size, windMitigation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={isSidebar ? "py-6 px-4 bg-stone-100 border border-stone-200" : "py-20 px-6 bg-stone-100 border-y border-stone-200"}>
      <div className={isSidebar ? "w-full" : "max-w-4xl mx-auto"}>
        <div className={`text-center ${isSidebar ? "mb-6" : "mb-10"}`}>
          <div className="inline-flex items-center gap-2 bg-crimson/10 border border-crimson/30 px-3 py-1 text-crimson text-xs font-oswald uppercase tracking-widest font-bold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Instant 60-Second Roof Estimator
          </div>
          <h2 className={`${isSidebar ? "text-2xl" : "text-3xl md:text-5xl"} font-oswald uppercase tracking-wider font-bold text-zinc-900`}>
            Calculate Your Roof Replacement Cost
          </h2>
          <p className="text-zinc-600 text-sm md:text-base max-w-2xl mx-auto mt-2 font-serif">
            {brand.isJim
              ? "Get an instant Florida Building Code (140+ MPH) estimate and calculate your annual Wind Mitigation insurance discount."
              : "Transparent pricing in seconds. No high-pressure sales calls."}
          </p>
        </div>

        <div className={`bg-white border-2 border-stone-300 shadow-2xl ${isSidebar ? "p-4 md:p-6" : "p-6 md:p-10"} relative`}>
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 transition-all duration-300 ${
                  step >= s ? "bg-crimson" : "bg-stone-200"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Estimate Reserved & Dispatched!
                </h3>
                <p className="text-zinc-600 max-w-lg mx-auto font-serif text-sm">
                  Your estimated project range of{" "}
                  <strong className="text-zinc-900">
                    ${calculation.low.toLocaleString()} - ${calculation.high.toLocaleString()}
                  </strong>{" "}
                  has been locked. {brand.isJim ? "Jim Jessup" : "Our lead estimator"} has received your property details at{" "}
                  <span className="text-crimson font-bold">{address || "your address"}</span> and will confirm your on-site measurement window.
                </p>
                <div className="pt-4">
                  <a
                    href={`tel:${brand.phone}`}
                    className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-6 py-3 font-oswald uppercase font-bold tracking-wider text-sm shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" /> Direct Dispatch: {brand.phone}
                  </a>
                </div>
              </motion.div>
            ) : step === 0 ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Step 1: Select Your Project Type
                </h3>
                <div className={`grid ${isSidebar ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
                  {[
                    { title: "Architectural Shingles", desc: "140+ MPH hurricane wind-rated architectural shingle system" },
                    { title: "Worthouse Metal Tile", desc: "High-tensile storm resistance at half the cost of concrete tile" },
                    { title: "Commercial TPO Flat Roof", desc: "Single-ply membrane & silicone coatings for commercial buildings" },
                    { title: "Emergency Leak / Storm Tarp", desc: "Active water intrusion repair & emergency structural tarping" },
                  ].map((opt) => (
                    <button
                      key={opt.title}
                      type="button"
                      onClick={() => {
                        setScope(opt.title);
                        setStep(1);
                      }}
                      className={`text-left p-4 border-2 transition-all duration-200 ${
                        scope === opt.title
                          ? "border-crimson bg-crimson/5 text-zinc-900"
                          : "border-stone-200 hover:border-crimson/50 bg-stone-50"
                      }`}
                    >
                      <div className="font-oswald uppercase tracking-wider font-bold text-base text-zinc-900">
                        {opt.title}
                      </div>
                      <div className="text-xs text-zinc-500 font-serif mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Step 2: Approximate Property Size & Insurance Credits
                </h3>
                <div className="space-y-4">
                  <div className={`grid ${isSidebar ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-3"} gap-3`}>
                    {[
                      { squares: 15, label: "~1,500 sq ft", sub: "15 Squares" },
                      { squares: 25, label: "~2,500 sq ft", sub: "25 Squares" },
                      { squares: 35, label: "~3,500+ sq ft", sub: "35+ Squares" },
                    ].map((s) => (
                      <button
                        key={s.squares}
                        type="button"
                        onClick={() => setSize(s.squares)}
                        className={`p-3 text-center border-2 transition-all ${
                          size === s.squares
                            ? "border-crimson bg-crimson/5 font-bold"
                            : "border-stone-200 bg-stone-50 hover:border-stone-400"
                        }`}
                      >
                        <div className="font-oswald text-base text-zinc-900">{s.label}</div>
                        <div className="text-[11px] text-zinc-500 font-serif">{s.sub}</div>
                      </button>
                    ))}
                  </div>
                  {/* Florida Wind Mitigation Discount Toggle */}
                  <div className="bg-emerald-50 border border-emerald-300 p-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="windMit"
                      checked={windMitigation}
                      onChange={(e) => setWindMitigation(e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="windMit" className="text-xs text-zinc-700 font-serif cursor-pointer">
                      <strong className="text-emerald-900 block font-oswald uppercase tracking-wider text-sm">
                        Include Florida Wind Mitigation Inspection Credit (-$850/yr avg savings)
                      </strong>
                      Qualifies your home for statutory Florida insurance discounts through hurricane tie-downs and secondary water barriers.
                    </label>
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-xs text-zinc-500 hover:text-zinc-900 font-serif"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-crimson hover:bg-crimson-dark text-white px-6 py-2.5 font-oswald uppercase font-bold tracking-wider text-sm flex items-center gap-2"
                    >
                      View Live Estimate &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Live Real-Time Calculation Screen */}
                <div className="bg-zinc-900 text-white p-6 border-2 border-zinc-800 shadow-inner">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
                        Calculated Estimate Range
                      </span>
                      <div className="text-3xl md:text-4xl font-oswald font-bold text-white mt-0.5">
                        ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-[11px] font-oswald uppercase tracking-wider text-zinc-400">
                        Estimated Financing
                      </span>
                      <div className="text-xl font-oswald font-bold text-emerald-400">
                        ${calculation.monthly}/mo ($0 Down)
                      </div>
                    </div>
                  </div>
                  {calculation.savings > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300 font-serif">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      Estimated Florida Wind Mitigation Insurance Discount: <strong>-${calculation.savings}/year</strong>
                    </div>
                  )}
                </div>
                {/* Final 1-Click Dispatch Intake */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-sm font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    Lock in this estimate & schedule on-site verification with {brand.isJim ? "Jim Jessup" : "our team"}:
                  </div>
                  <div className={`grid ${isSidebar ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
                    <div>
                      <label className="block text-xs text-zinc-500 font-serif mb-1">Direct Phone Number (For SMS Confirmation)*</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(904) 555-0199"
                        className="w-full bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-crimson"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 font-serif mb-1">Property Address & City*</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street Address, Jacksonville, FL"
                        className="w-full bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-crimson"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-zinc-500 hover:text-zinc-900 font-serif"
                    >
                      &larr; Adjust Roof Specs
                    </button>
                    <button
                      type="submit"
                      className="bg-crimson hover:bg-crimson-dark text-white px-8 py-3.5 font-oswald uppercase tracking-wider font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Lock In Estimate & Dispatch Inspection <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
