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

  // Authentic Systems with Harmonized Typography Copy matching Process.tsx & WhyChooseUs.tsx
  const residentialScopes: ScopeOption[] = [
    {
      title: "Architectural Shingles (50-Yr)",
      subtitle: "Lifetime GAF Timberline HDZ / Owens Corning Duration systems engineered for severe weather.",
      rate: 4.8,
      warranty: "50-Yr Lifetime",
    },
    {
      title: "Class 4 Impact Hail Defense",
      subtitle: "UL 2218 impact-rated shingles qualifying your property for up to 28% insurance discounts.",
      rate: 5.8,
      warranty: "Lifetime Impact",
    },
    {
      title: "Standing Seam Designer Metal",
      subtitle: "24-gauge concealed fastener architectural steel roofing with lifetime 50+ year resilience.",
      rate: 7.8,
      warranty: "50+ Yr Resilient",
    },
    {
      title: brand.state === "FL" ? "Florida Tile & Hurricane Engineered" : "Designer Shake & Tile System",
      subtitle: brand.state === "FL"
        ? "140+ MPH hurricane fastened Spanish clay or concrete tile designed for maximum wind defense."
        : "High-definition composite cedar shake & slate replacement with authentic dimensional depth.",
      rate: 9.2,
      warranty: "Lifetime Premium",
    },
  ];

  const commercialScopes: ScopeOption[] = [
    {
      title: "60-Mil TPO Heat-Welded Membrane",
      subtitle: "Energy Star reflective cool roof single-ply membrane with high thermal efficiency.",
      rate: 5.2,
      warranty: "20-Yr NDL",
    },
    {
      title: "Seamless Silicone Roof Coating",
      subtitle: "Liquid-applied monolithic restoration barrier over existing deck with 15-20 year leak protection.",
      rate: 4.2,
      warranty: "15-20 Yr Seal",
    },
    {
      title: "Multi-Ply Modified Bitumen",
      subtitle: "Heavy-duty dual-ply SBS asphalt system engineered for high foot traffic and mechanical decks.",
      rate: 6.2,
      warranty: "25-Yr Commercial",
    },
    {
      title: "Commercial Structural Standing Seam",
      subtitle: "Heavy-gauge industrial metal panels for large facilities, retail centers, and warehouses.",
      rate: 7.6,
      warranty: "30-Yr Warranty",
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
    const rawLow = Math.round(baseCost * 0.95);
    const rawHigh = Math.round(baseCost * 1.22);

    let incentiveAmount = 750;
    if (brand.state === "FL") {
      incentiveAmount = 1250;
    } else if (isComm) {
      incentiveAmount = Math.max(800, Math.round(sqFt * 0.40));
    } else if (
      activeScope.title.toLowerCase().includes("impact") ||
      activeScope.title.toLowerCase().includes("class 4")
    ) {
      incentiveAmount = Math.max(950, Math.round(baseCost * 0.12));
    } else {
      incentiveAmount = Math.max(650, Math.round(baseCost * 0.06));
    }

    const low = includeIncentive ? Math.max(1000, rawLow - incentiveAmount) : rawLow;
    const high = includeIncentive ? Math.max(1200, rawHigh - incentiveAmount) : rawHigh;
    const monthly = Math.round(low / 84);

    return {
      rawLow,
      rawHigh,
      low,
      high,
      sqFt,
      squares: Math.round(sqFt / 100),
      monthly,
      incentiveAmount,
      includeIncentive,
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
            : "py-12 sm:py-16 px-4 sm:px-6 bg-stone-100 border-y border-stone-200"
        }
      >
        <div className={isSidebar ? "w-full" : "max-w-7xl mx-auto"}>
          {/* Section Header with Consistent Editorial Typography */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
              Precision Cost Modeling
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
              Instant Roof Cost Calculator
            </h2>
            <div className="w-14 h-1 bg-crimson mx-auto mt-3 mb-4"></div>
            <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto font-serif leading-relaxed">
              {tradeMode === "commercial"
                ? `Commercial flat roof & single-ply TPO replacement modeling calibrated to facilities across ${brand.city}.`
                : `Transparent line-item roof replacement modeling calibrated to local ${brand.city} material & labor rates.`}
            </p>

            {/* Apple-Style Segmented Trade Pill */}
            <div className="inline-flex items-center p-1 bg-stone-200/90 rounded-full mt-5 shadow-inner border border-stone-300/60">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* LEFT COLUMN: Controls & System Scope (7 Columns) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-zinc-200/80 space-y-5">
              {/* Material Selection Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    1. Choose Roof System Material
                  </label>
                  <span className="text-xs text-zinc-500 font-sans">
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
                        className={`text-left p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-crimson bg-crimson/5 shadow-xs ring-1 ring-crimson"
                            : "border-zinc-200 hover:border-zinc-300 bg-stone-50/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
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
                          <p className="text-xs text-zinc-600 font-serif leading-relaxed mt-1 line-clamp-2">
                            {scope.subtitle}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
                          <span className="text-zinc-500 font-serif whitespace-nowrap">
                            Warranty: <strong className="font-sans font-semibold text-zinc-700">{scope.warranty}</strong>
                          </span>
                          <span className="font-oswald font-bold text-crimson text-xs whitespace-nowrap shrink-0">
                            ~${scope.rate.toFixed(2)}/sq ft
                          </span>
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
                    <label className="text-xs sm:text-sm font-oswald uppercase tracking-wider font-bold text-zinc-900 block">
                      2. Approximate Roof Footprint
                    </label>
                    <span className="text-xs text-zinc-500 font-sans block">
                      Slide to match estimated surface area
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-oswald font-bold text-crimson">
                      {calculation.sqFt.toLocaleString()} sq ft
                    </span>
                    <span className="text-xs text-zinc-500 font-sans block">
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
                  <div className="flex justify-between text-xs font-sans text-zinc-500 mt-1">
                    <span>{tradeMode === "commercial" ? "5,000 sq ft" : "1,200 sq ft (Cottage)"}</span>
                    <span>{tradeMode === "commercial" ? "25,000 sq ft" : "3,200 sq ft (Average Home)"}</span>
                    <span>{tradeMode === "commercial" ? "50,000 sq ft" : "5,500 sq ft (Estate)"}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Incentive Credit Box with Live Reactive Toggle */}
              <div
                className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                  includeIncentive
                    ? "bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/20 shadow-2xs"
                    : "bg-stone-50 border-stone-200 opacity-80"
                }`}
              >
                <input
                  type="checkbox"
                  id="incentiveCredit"
                  checked={includeIncentive}
                  onChange={(e) => setIncludeIncentive(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 border-zinc-300 rounded focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <label htmlFor="incentiveCredit" className="text-xs text-zinc-700 font-sans leading-relaxed cursor-pointer flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <strong className="text-emerald-950 font-oswald uppercase tracking-wider text-xs sm:text-sm font-bold">
                      {brand.state === "FL"
                        ? "Apply Florida Wind Mitigation Insurance Deduction"
                        : tradeMode === "commercial"
                        ? "Apply Commercial Cool Roof Energy Efficiency Credit"
                        : "Apply Impact-Resistant Class 4 Insurance Deduction"}
                    </strong>
                    <span
                      className={`text-[10px] font-oswald uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                        includeIncentive
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-zinc-600"
                      }`}
                    >
                      {includeIncentive
                        ? `-$${calculation.incentiveAmount.toLocaleString()} Applied`
                        : `Save ~$${calculation.incentiveAmount.toLocaleString()}`}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 font-sans leading-relaxed block mt-0.5">
                    {brand.state === "FL"
                      ? "Qualifies property for statutory hurricane tie-down and secondary water barrier insurance discounts."
                      : tradeMode === "commercial"
                      ? "Reflective cool roof solar coatings qualify for commercial energy rebates and reduce cooling loads."
                      : "Impact-resistant Class 4 shingles qualify for permanent homeowner insurance policy discounts up to 28%."}
                  </span>
                </label>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Sticky Calculation & Booking Studio (5 Columns) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 lg:p-6 shadow-md border border-zinc-200/90 space-y-3.5 sm:space-y-4 lg:sticky lg:top-24">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[11px] font-oswald uppercase tracking-widest text-crimson font-bold block mb-0.5">
                  Live Estimated Investment
                </span>
                <div className="text-3xl sm:text-4xl font-oswald font-bold text-zinc-950 tracking-tight transition-all">
                  ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-oswald uppercase tracking-wider font-bold">
                    As Low As ${calculation.monthly}/mo
                  </span>
                  {includeIncentive ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-oswald uppercase tracking-wider font-bold border border-emerald-200">
                      ✓ -${calculation.incentiveAmount.toLocaleString()} Savings Included
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-zinc-500 text-[10px] font-oswald uppercase tracking-wider font-medium">
                      Standard Rate (No Deduction)
                    </span>
                  )}
                </div>
              </div>

              {/* Selected Scope Summary */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5 text-xs font-sans">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Selected Scope</span>
                  <strong className="text-zinc-900 font-semibold truncate max-w-[190px]">{selectedScope}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Surface Footprint</span>
                  <strong className="text-zinc-900 font-semibold">{calculation.sqFt.toLocaleString()} sq ft ({calculation.squares} Squares)</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600">Service Territory</span>
                  <strong className="text-zinc-900 font-semibold">
                    {brand.city.includes(brand.state) ? brand.city : `${brand.city}, ${brand.state}`}
                  </strong>
                </div>
              </div>

              {/* Inclusions (Matching Why Choose Us & Process.tsx) */}
              <div className="space-y-1.5 py-0.5 font-sans">
                <span className="text-[10px] font-oswald uppercase tracking-wider text-zinc-400 font-bold block">
                  Standard Turnkey Inclusions
                </span>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Complete tear-off & structural deck inspection
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Synthetic moisture-barrier underlayment & ice shield
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Non-prorated manufacturer warranty & wind guarantee
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Triple-sweep magnetic nail cleanup around property
                  </span>
                </div>
              </div>

              {/* 1-Click Booking Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3 px-5 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-101 active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Book Free Inspection for This Estimate <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-zinc-500 font-sans text-center mt-1.5">
                  Zero deposit required &bull; Complimentary on-site diagnostic survey confirms final quote
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
