import { useState, useMemo, useEffect } from "react";
import { useBrand } from "../BrandContext";
import {
  Calendar,
  Building2,
  Home,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import BookingModal from "./BookingModal";

interface ScopeOption {
  title: string;
  subtitle: string;
  rate: number;
  warranty: string;
}

export default function EstimateWizard({ variant = "full" }: { variant?: "full" | "sidebar" }) {
  const brand = useBrand();
  const isSidebar = variant === "sidebar";

  const [tradeMode, setTradeMode] = useState<"residential" | "commercial">(
    brand.isCommercial ? "commercial" : "residential"
  );

  useEffect(() => {
    if (brand.isCommercial) {
      setTradeMode("commercial");
    }
  }, [brand.isCommercial]);

  // Authentic Systems with Harmonized Typography Copy
  const residentialScopes: ScopeOption[] = [
    {
      title: "Architectural Shingles (50-Yr)",
      subtitle: "Lifetime GAF Timberline HDZ / Owens Corning Duration",
      rate: 4.8,
      warranty: "50-Year Non-Prorated",
    },
    {
      title: "Class 4 Impact Hail Defense",
      subtitle: "UL 2218 rated shingles with up to 28% insurance discounts",
      rate: 5.8,
      warranty: "Lifetime Impact",
    },
    {
      title: "Standing Seam Designer Metal",
      subtitle: "24-gauge concealed fastener architectural steel roofing",
      rate: 7.8,
      warranty: "50+ Year Lifetime",
    },
    {
      title: brand.state === "FL" ? "Florida Tile / Hurricane Engineered" : "Designer Shake & Tile System",
      subtitle: brand.state === "FL" ? "140+ MPH hurricane fastened Spanish clay or concrete tile" : "High-definition composite cedar shake & slate replacement",
      rate: 9.2,
      warranty: "Lifetime Premium",
    },
  ];

  const commercialScopes: ScopeOption[] = [
    {
      title: "60-Mil TPO Heat-Welded Membrane",
      subtitle: "Energy Star reflective cool roof single-ply system",
      rate: 5.2,
      warranty: "20-Year NDL Warranty",
    },
    {
      title: "Seamless Silicone Roof Coating",
      subtitle: "Liquid-applied monolithic restoration over existing roof",
      rate: 4.2,
      warranty: "15-20 Year Leak-Free",
    },
    {
      title: "Multi-Ply Modified Bitumen",
      subtitle: "Heavy-duty SBS dual-ply system for high foot traffic decks",
      rate: 6.2,
      warranty: "25-Year Commercial",
    },
    {
      title: "Commercial Structural Standing Seam",
      subtitle: "Heavy-gauge industrial metal for retail & distribution centers",
      rate: 7.6,
      warranty: "30-Year Warranty",
    },
  ];

  const currentScopes = tradeMode === "commercial" ? commercialScopes : residentialScopes;
  const [selectedScope, setSelectedScope] = useState<string>(currentScopes[0].title);
  const [resSqFt, setResSqFt] = useState<number>(2400);
  const [commSqFt, setCommSqFt] = useState<number>(12000);
  const [includeIncentive, setIncludeIncentive] = useState<boolean>(true);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleTradeModeChange = (mode: "residential" | "commercial") => {
    setTradeMode(mode);
    setSelectedScope(mode === "commercial" ? commercialScopes[0].title : residentialScopes[0].title);
  };

  const calculation = useMemo(() => {
    const isComm = tradeMode === "commercial";
    const sqFt = isComm ? commSqFt : resSqFt;
    const activeScope = currentScopes.find((s) => s.title === selectedScope) || currentScopes[0];

    const baseCost = sqFt * activeScope.rate;
    const low = Math.round(baseCost * 0.95);
    const high = Math.round(baseCost * 1.22);

    let incentiveAmount = 0;
    if (includeIncentive) {
      if (brand.state === "FL") {
        incentiveAmount = 850;
      } else if (isComm) {
        incentiveAmount = Math.round(sqFt * 0.35);
      } else {
        incentiveAmount = 620;
      }
    }

    const monthly = Math.round(low / 84);
    return {
      low,
      high,
      sqFt,
      squares: Math.round(sqFt / 100),
      monthly,
      incentiveAmount,
      activeScope,
    };
  }, [tradeMode, selectedScope, resSqFt, commSqFt, includeIncentive, brand.state, currentScopes]);

  return (
    <>
      <section
        id="estimate"
        className={
          isSidebar
            ? "py-8 px-4 bg-stone-50"
            : "py-20 px-4 sm:px-6 bg-stone-100 border-y border-stone-200"
        }
      >
        <div className={isSidebar ? "w-full" : "max-w-7xl mx-auto"}>
          {/* Section Header with Consistent Typography */}
          <div className="text-center mb-10">
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Precision Cost Modeling
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
              Instant Roof Cost Calculator
            </h2>
            <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-4"></div>
            <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto font-serif">
              {tradeMode === "commercial"
                ? `Commercial flat roof & single-ply TPO replacement modeling calibrated to facilities across ${brand.city}.`
                : `Transparent line-item roof replacement modeling calibrated to ${brand.city} municipal building codes.`}
            </p>

            {/* Apple-Style Segmented Trade Pill */}
            <div className="inline-flex items-center p-1 bg-stone-200/90 rounded-full mt-4 shadow-inner border border-stone-300/60">
              <button
                type="button"
                onClick={() => handleTradeModeChange("residential")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeMode === "residential"
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
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
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-crimson" /> Commercial Flat / TPO
              </button>
            </div>
          </div>

          {/* 2-COLUMN SINGLE-VIEWPORT INTERACTIVE STUDIO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN: Controls & System Scope (7 Columns) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-zinc-200/80 space-y-6">
              {/* Material Selection Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    1. Choose Roof System Material
                  </label>
                  <span className="text-[11px] text-zinc-500 font-serif">
                    {tradeMode === "commercial" ? "Commercial Scope" : "Residential Scope"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentScopes.map((scope) => {
                    const isSelected = selectedScope === scope.title;
                    return (
                      <button
                        key={scope.title}
                        type="button"
                        onClick={() => setSelectedScope(scope.title)}
                        className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-crimson bg-crimson/5 shadow-xs ring-1 ring-crimson"
                            : "border-zinc-200 hover:border-zinc-300 bg-stone-50/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm text-zinc-900 truncate">
                              {scope.title}
                            </span>
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-crimson bg-crimson" : "border-zinc-300 bg-white"
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-600 font-serif mt-1 leading-snug">
                            {scope.subtitle}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-500 font-serif">Warranty: {scope.warranty}</span>
                          <span className="font-oswald font-bold text-crimson">~${scope.rate.toFixed(2)}/sq ft</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smooth Area Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900 block">
                      2. Approximate Roof Footprint
                    </label>
                    <span className="text-[11px] text-zinc-500 font-serif">
                      Slide to match estimated surface area
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-oswald font-bold text-crimson">
                      {calculation.sqFt.toLocaleString()} sq ft
                    </span>
                    <span className="text-[10px] text-zinc-400 font-serif block">
                      ~{calculation.squares} Squares
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <input
                    type="range"
                    min={tradeMode === "commercial" ? 5000 : 1200}
                    max={tradeMode === "commercial" ? 50000 : 5500}
                    step={tradeMode === "commercial" ? 500 : 50}
                    value={tradeMode === "commercial" ? commSqFt : resSqFt}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (tradeMode === "commercial") {
                        setCommSqFt(val);
                      } else {
                        setResSqFt(val);
                      }
                    }}
                    className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-crimson focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] font-oswald uppercase tracking-wider text-zinc-400 mt-1 font-mono">
                    <span>{tradeMode === "commercial" ? "5,000 sq ft" : "1,200 sq ft (Cottage)"}</span>
                    <span>{tradeMode === "commercial" ? "25,000 sq ft" : "3,200 sq ft (Average)"}</span>
                    <span>{tradeMode === "commercial" ? "50,000 sq ft" : "5,500 sq ft (Estate)"}</span>
                  </div>
                </div>
              </div>

              {/* Incentive Credit Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="incentiveCredit"
                  checked={includeIncentive}
                  onChange={(e) => setIncludeIncentive(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 border-zinc-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="incentiveCredit" className="text-xs text-zinc-700 font-serif cursor-pointer">
                  <strong className="text-emerald-950 block font-oswald uppercase tracking-wider text-xs">
                    {brand.state === "FL"
                      ? "Apply Florida Wind Mitigation Insurance Deduction (-$850/yr)"
                      : tradeMode === "commercial"
                      ? "Apply Commercial Cool Roof Energy Efficiency Credit"
                      : "Apply Impact-Resistant Class 4 Insurance Deduction (Up to 28%)"}
                  </strong>
                  <span className="text-[11px] text-zinc-600">
                    {brand.state === "FL"
                      ? "Qualifies property for statutory hurricane tie-down and secondary water barrier insurance discounts."
                      : tradeMode === "commercial"
                      ? "Reflective cool roof solar coatings qualify for commercial energy rebates and reduce cooling loads."
                      : "Impact-resistant shingles qualify for verified homeowner insurance premium discounts."}
                  </span>
                </label>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Sticky Calculation & Booking Studio (5 Columns) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-zinc-200/90 space-y-5 lg:sticky lg:top-24">
              <div>
                <span className="text-[10px] font-oswald uppercase tracking-widest text-crimson font-bold block">
                  Live Estimated Investment
                </span>
                <div className="text-3xl sm:text-4xl font-oswald font-bold text-zinc-950 mt-1">
                  ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-oswald uppercase tracking-wider font-bold">
                  <span>As Low As ${calculation.monthly}/mo</span>
                  <span className="text-emerald-600 font-serif normal-case font-normal text-[11px]">(0% Down Available)</span>
                </div>
              </div>

              {/* Selected Scope Summary */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1.5 font-serif">
                <div className="flex justify-between">
                  <span className="text-zinc-500">System Scope:</span>
                  <strong className="text-zinc-900 font-oswald uppercase truncate max-w-[180px]">{selectedScope}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Surface Footprint:</span>
                  <strong className="text-zinc-900 font-oswald">{calculation.sqFt.toLocaleString()} sq ft ({calculation.squares} Squares)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Service Territory:</span>
                  <strong className="text-zinc-900 font-oswald">{brand.city}</strong>
                </div>
              </div>

              {/* Inclusions (Matching Why Choose Us Editorial Font) */}
              <div className="space-y-2 border-t border-zinc-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-serif">
                  <CheckCircle className="w-4 h-4 text-crimson shrink-0" />
                  <span>Full tear-off & structural deck inspection</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-serif">
                  <CheckCircle className="w-4 h-4 text-crimson shrink-0" />
                  <span>Synthetic underlayment & ice/water shield</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-serif">
                  <CheckCircle className="w-4 h-4 text-crimson shrink-0" />
                  <span>Non-prorated manufacturer warranty</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-700 font-serif">
                  <CheckCircle className="w-4 h-4 text-crimson shrink-0" />
                  <span>Magnetic nail sweep & clean-up guarantee</span>
                </div>
              </div>

              {/* 1-Click Booking Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Book Inspection for This Estimate <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-zinc-400 font-serif text-center mt-2">
                  Zero deposit required • On-site verification confirms final quote
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Synchronized Minimal Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={`${selectedScope} (${calculation.sqFt.toLocaleString()} sq ft estimate)`}
      />
    </>
  );
}
