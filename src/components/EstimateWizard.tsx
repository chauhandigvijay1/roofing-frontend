import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../BrandContext";
import { Calculator, ArrowRight, CheckCircle2, PhoneCall, Calendar, Building2, Home } from "lucide-react";
import BookingModal from "./BookingModal";

interface ScopeOption {
  title: string;
  rate: number;
  desc: string;
  flatLow?: number;
  flatHigh?: number;
}

export default function EstimateWizard({ variant = "full" }: { variant?: "full" | "sidebar" }) {
  const brand = useBrand();
  const isSidebar = variant === "sidebar";

  // Mode: Residential or Commercial
  const [tradeMode, setTradeMode] = useState<"residential" | "commercial">(
    brand.isCommercial ? "commercial" : "residential"
  );

  useEffect(() => {
    if (brand.isCommercial) {
      setTradeMode("commercial");
    }
  }, [brand.isCommercial]);

  // Step 0: Scope & Specs, Step 1: Summary & Contact Transfer
  const [step, setStep] = useState<0 | 1>(0);

  // Residential Scopes & Default Size (in sq ft)
  const residentialScopes: ScopeOption[] = [
    { title: "Architectural Shingles (50-Yr)", rate: 4.8, desc: "Lifetime warranty architectural shingle system" },
    { title: "Class 4 Impact Hail Resistant", rate: 5.8, desc: "Maximum insurance premium discount & hail defense" },
    { title: "Standing Seam Designer Metal", rate: 7.8, desc: "Heat-reflective architectural steel roofing" },
    { title: "Emergency Leak Repair & Tarping", rate: 0, flatLow: 450, flatHigh: 1450, desc: "Rapid 24/7 water-stop & structural mitigation" },
  ];

  // Commercial Scopes & Default Size (in sq ft)
  const commercialScopes: ScopeOption[] = [
    { title: "60-Mil TPO Single-Ply Membrane", rate: 5.2, desc: "Heat-welded commercial flat roof with cool roof solar reflectivity" },
    { title: "Silicone Commercial Roof Coating", rate: 4.2, desc: "Seamless liquid restoration membrane with 20-year leak protection" },
    { title: "Modified Bitumen Low-Slope System", rate: 6.2, desc: "Multi-ply commercial weatherproofing for heavy foot-traffic decks" },
    { title: "Commercial Standing Seam Metal", rate: 7.6, desc: "Heavy-gauge structural metal for industrial & retail facilities" },
  ];

  const currentScopes = tradeMode === "commercial" ? commercialScopes : residentialScopes;
  const [selectedScope, setSelectedScope] = useState<string>(currentScopes[0].title);
  const [resSqFt, setResSqFt] = useState<number>(2400); // 1,200 to 5,500 sq ft
  const [commSqFt, setCommSqFt] = useState<number>(12000); // 5,000 to 50,000 sq ft
  const [includeIncentive, setIncludeIncentive] = useState<boolean>(true);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Keep selected scope synchronized when switching trade mode
  const handleTradeModeChange = (mode: "residential" | "commercial") => {
    setTradeMode(mode);
    if (mode === "commercial") {
      setSelectedScope(commercialScopes[0].title);
    } else {
      setSelectedScope(residentialScopes[0].title);
    }
  };

  // Apple-Grade Dynamic Price Calculation
  const calculation = useMemo(() => {
    const isComm = tradeMode === "commercial";
    const sqFt = isComm ? commSqFt : resSqFt;
    const activeScopeObj = currentScopes.find((s) => s.title === selectedScope) || currentScopes[0];

    if (activeScopeObj.rate === 0 && "flatLow" in activeScopeObj) {
      return {
        low: activeScopeObj.flatLow || 450,
        high: activeScopeObj.flatHigh || 1450,
        savings: 0,
        monthly: 45,
        sqFt,
      };
    }

    const baseCost = sqFt * (activeScopeObj.rate || 5.0);
    const low = Math.round(baseCost * 0.95);
    const high = Math.round(baseCost * 1.22);

    let savings = 0;
    if (includeIncentive) {
      if (brand.state === "FL") {
        savings = 850; // FL statutory Wind Mitigation insurance savings
      } else if (isComm) {
        savings = Math.round(sqFt * 0.35); // Commercial Cool Roof Energy Rebate
      } else {
        savings = 620; // Class 4 Texas/General Hail discount
      }
    }

    const monthly = Math.round(low / 84); // 84-month fixed financing
    return { low, high, savings, monthly, sqFt };
  }, [tradeMode, selectedScope, resSqFt, commSqFt, includeIncentive, brand.state, currentScopes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleOpenBookingModal = () => {
    setIsBookingOpen(true);
  };

  return (
    <>
      <section
        id="estimate"
        className={
          isSidebar
            ? "py-8 px-4 bg-stone-100 border border-stone-200"
            : "py-24 px-6 bg-stone-100 border-y border-stone-200"
        }
      >
        <div className={isSidebar ? "w-full" : "max-w-4xl mx-auto"}>
          <div className={`text-center ${isSidebar ? "mb-6" : "mb-10"}`}>
            <div className="inline-flex items-center gap-2 bg-crimson/10 border border-crimson/30 px-3.5 py-1 text-crimson text-xs font-oswald uppercase tracking-widest font-bold mb-3 shadow-xs">
              <Calculator className="w-3.5 h-3.5" />
              Universal 60-Second Roof Estimator
            </div>
            <h2 className={`${isSidebar ? "text-2xl" : "text-3xl md:text-5xl"} font-oswald uppercase tracking-wider font-bold text-zinc-900`}>
              Instant Roof Cost Calculator
            </h2>
            <p className="text-zinc-600 text-sm md:text-base max-w-2xl mx-auto mt-2 font-serif">
              {brand.state === "FL"
                ? `Transparent pricing calibrated to Florida Building Code (140+ MPH) and annual Wind Mitigation insurance discounts across ${brand.city}.`
                : tradeMode === "commercial"
                ? `Commercial single-ply TPO, low-slope membrane, and energy-reflective cost modeling for facilities in ${brand.city}.`
                : `Precision residential replacement estimates calibrated to ${brand.city} building codes. Transparent line-item figures with zero high-pressure sales.`}
            </p>

            {/* Apple-Style Segmented Trade Switcher */}
            <div className="inline-flex items-center p-1 bg-stone-200 rounded-full mt-6 shadow-inner">
              <button
                type="button"
                onClick={() => handleTradeModeChange("residential")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeMode === "residential"
                    ? "bg-white text-zinc-900 shadow-md"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Home className="w-3.5 h-3.5 text-crimson" /> Residential Replacement
              </button>
              <button
                type="button"
                onClick={() => handleTradeModeChange("commercial")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeMode === "commercial"
                    ? "bg-white text-zinc-900 shadow-md"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-crimson" /> Commercial Flat / TPO
              </button>
            </div>
          </div>

          <div className={`bg-white border-2 border-stone-300 shadow-2xl ${isSidebar ? "p-4 md:p-6" : "p-6 md:p-10"} relative`}>
            {/* Progress Stepper */}
            <div className="flex gap-2 mb-8">
              {[0, 1].map((s) => (
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
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    Estimate Locked & Queued For Dispatch!
                  </h3>
                  <p className="text-zinc-600 max-w-lg mx-auto font-serif text-sm">
                    Your estimated project range of{" "}
                    <strong className="text-zinc-900 font-sans">
                      ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                    </strong>{" "}
                    ({calculation.sqFt.toLocaleString()} sq ft &bull; {selectedScope}) has been reserved. Our senior estimator has received your details for{" "}
                    <span className="text-crimson font-bold">{address || "your property"}</span> and will verify satellite/on-site measurements.
                  </p>
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenBookingModal}
                      className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white px-6 py-3 font-oswald uppercase font-bold tracking-wider text-sm shadow-md cursor-pointer transition-all"
                    >
                      <Calendar className="w-4 h-4 text-crimson" /> Pick Specific Calendar Window
                    </button>
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
                  className="space-y-8"
                >
                  {/* Scope Selection */}
                  <div>
                    <h3 className="text-base sm:text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-3">
                      1. Select System Scope ({tradeMode === "commercial" ? "Commercial Facilities" : "Residential Properties"})
                    </h3>
                    <div className={`grid ${isSidebar ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-3`}>
                      {currentScopes.map((opt) => {
                        const isSelected = selectedScope === opt.title;
                        return (
                          <button
                            key={opt.title}
                            type="button"
                            onClick={() => setSelectedScope(opt.title)}
                            className={`text-left p-4 border-2 transition-all cursor-pointer ${
                              isSelected
                                ? "border-crimson bg-crimson/5 text-zinc-900 shadow-sm"
                                : "border-stone-200 hover:border-stone-400 bg-stone-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-oswald uppercase tracking-wider font-bold text-sm sm:text-base text-zinc-900">
                                {opt.title}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected ? "border-crimson bg-crimson" : "border-stone-300 bg-white"
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                            </div>
                            <p className="text-xs text-zinc-500 font-serif mt-1">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Apple-Grade Slider Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-base sm:text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                        2. Approximate Roof Area
                      </label>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-oswald font-bold text-crimson">
                          {tradeMode === "commercial"
                            ? `${commSqFt.toLocaleString()} sq ft`
                            : `${resSqFt.toLocaleString()} sq ft (~${Math.round(resSqFt / 100)} Squares)`}
                        </span>
                      </div>
                    </div>

                    {tradeMode === "commercial" ? (
                      <div className="space-y-2 pt-2">
                        <input
                          type="range"
                          min={5000}
                          max={50000}
                          step={1000}
                          value={commSqFt}
                          onChange={(e) => setCommSqFt(Number(e.target.value))}
                          className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-crimson"
                        />
                        <div className="flex justify-between text-[11px] font-oswald uppercase tracking-wider text-zinc-500">
                          <span>5,000 sq ft</span>
                          <span>25,000 sq ft</span>
                          <span>50,000+ sq ft</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2">
                        <input
                          type="range"
                          min={1200}
                          max={5500}
                          step={100}
                          value={resSqFt}
                          onChange={(e) => setResSqFt(Number(e.target.value))}
                          className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-crimson"
                        />
                        <div className="flex justify-between text-[11px] font-oswald uppercase tracking-wider text-zinc-500">
                          <span>1,200 sq ft (12 sq)</span>
                          <span>2,800 sq ft (28 sq)</span>
                          <span>5,500 sq ft (55 sq)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* State & Scope Incentive Credit Box */}
                  <div className="bg-emerald-50/80 border border-emerald-300 p-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="incentiveCredit"
                      checked={includeIncentive}
                      onChange={(e) => setIncludeIncentive(e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="incentiveCredit" className="text-xs text-zinc-700 font-serif cursor-pointer">
                      <strong className="text-emerald-950 block font-oswald uppercase tracking-wider text-sm">
                        {brand.state === "FL"
                          ? "Include Florida Wind Mitigation Inspection Credit (-$850/yr avg savings)"
                          : tradeMode === "commercial"
                          ? "Include Commercial Cool Roof Energy Credit & 20-Year NDL Warranty Protection"
                          : "Include Class 4 Impact Hail Insurance Premium Discount (Up to 28% off)"}
                      </strong>
                      {brand.state === "FL"
                        ? "Qualifies your Florida property for statutory hurricane tie-down and secondary water barrier premium deductions."
                        : tradeMode === "commercial"
                        ? "Reflective cool roof solar coatings qualify for commercial energy rebates and reduce summer HVAC building loads."
                        : "Impact-resistant Class 4 shingles qualify for permanent homeowner insurance policy discounts."}
                    </label>
                  </div>

                  {/* Live Calculation Display Pill */}
                  <div className="bg-zinc-950 text-white p-6 border border-zinc-800 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[11px] font-oswald uppercase tracking-widest text-crimson font-bold block">
                          Live Estimated Cost Range
                        </span>
                        <div className="text-3xl sm:text-4xl font-oswald font-bold text-white mt-0.5 font-sans">
                          ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                        </div>
                        <span className="text-xs text-zinc-400 font-serif">
                          Includes complete labor, tear-off, synthetic underlayment & lifetime manufacturer warranty.
                        </span>
                      </div>
                      <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-6">
                        <span className="text-[11px] font-oswald uppercase tracking-wider text-zinc-400 block">
                          Flexible Financing
                        </span>
                        <div className="text-xl font-oswald font-bold text-emerald-400">
                          ${calculation.monthly}/mo
                        </div>
                        <span className="text-[10px] text-zinc-400 font-serif block">
                          0% APR / Fixed Term ($0 Down)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-8 py-3.5 font-oswald uppercase tracking-wider font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Lock In This Estimate & Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-stone-50 border border-stone-200 p-4 text-xs flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-zinc-500 font-serif">Scope:</span>{" "}
                      <strong className="text-zinc-900 font-oswald">{selectedScope}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-serif">Area:</span>{" "}
                      <strong className="text-zinc-900 font-oswald">{calculation.sqFt.toLocaleString()} sq ft</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-serif">Range:</span>{" "}
                      <strong className="text-crimson font-oswald">
                        ${calculation.low.toLocaleString()} - ${calculation.high.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-sm font-oswald uppercase tracking-wider font-bold text-zinc-900">
                      Reserve this estimate & dispatch inspection with {brand.name}:
                    </div>
                    <div className={`grid ${isSidebar ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}>
                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                          Direct Mobile Number (For SMS Confirmation)*
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(800) 555-0199"
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-crimson font-serif"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                          Property Address in {brand.city}*
                        </label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street Address, City, Zip"
                          className="w-full bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-crimson font-serif"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="text-xs text-zinc-600 hover:text-zinc-900 font-oswald uppercase tracking-wider font-bold"
                      >
                        &larr; Adjust Specifications
                      </button>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleOpenBookingModal}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white px-5 py-3 font-oswald uppercase tracking-wider font-bold text-xs shadow-md cursor-pointer transition-all"
                        >
                          <Calendar className="w-4 h-4 text-crimson" /> Open Booking Calendar
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3 font-oswald uppercase tracking-wider font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Lock In Estimate <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={selectedScope}
        initialAddress={address}
      />
    </>
  );
}
