import { useState, useMemo, useEffect } from "react";
import { useBrand } from "../BrandContext";
import {
  Calculator,
  ArrowRight,
  Calendar,
  Building2,
  Home,
  ShieldCheck,
} from "lucide-react";
import BookingModal from "./BookingModal";

interface ScopeOption {
  title: string;
  subtitle: string;
  rate: number; // price per sq ft
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

  // Authentic, Real-World Trade Systems
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
      title: brand.state === "FL" ? "Florida Tile / Wind Engineered" : "Designer Shake & Tile System",
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
  const [resSqFt, setResSqFt] = useState<number>(2400); // 1,200 to 5,500 sq ft
  const [commSqFt, setCommSqFt] = useState<number>(12000); // 5,000 to 50,000 sq ft
  const [includeIncentive, setIncludeIncentive] = useState<boolean>(true);

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Synchronize scope selection when changing trade
  const handleTradeModeChange = (mode: "residential" | "commercial") => {
    setTradeMode(mode);
    setSelectedScope(mode === "commercial" ? commercialScopes[0].title : residentialScopes[0].title);
  };

  // Real-Time Apple-Grade Dynamic Calculation
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
        incentiveAmount = 850; // Florida Wind Mitigation statutory premium discount
      } else if (isComm) {
        incentiveAmount = Math.round(sqFt * 0.35); // Cool Roof Commercial Energy Rebate
      } else {
        incentiveAmount = 620; // Texas / Midwest Class 4 Hail Premium Credit
      }
    }

    const monthly = Math.round(low / 84); // 84-month 0% down financing estimate
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

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  return (
    <>
      <section
        id="estimate"
        className={
          isSidebar
            ? "py-8 px-4 bg-stone-50"
            : "py-24 px-4 sm:px-6 bg-gradient-to-b from-stone-100 to-white border-y border-stone-200"
        }
      >
        <div className={isSidebar ? "w-full" : "max-w-4xl mx-auto"}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-crimson/10 border border-crimson/25 text-crimson text-xs font-oswald uppercase tracking-widest font-bold mb-3 shadow-xs">
              <Calculator className="w-3.5 h-3.5" />
              <span>Apple-Grade Precision Roof Estimator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
              Instant Roof Cost Calculator
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto mt-2 font-serif">
              {tradeMode === "commercial"
                ? `Commercial flat roof & single-ply TPO replacement modeling calibrated to facilities across ${brand.city}.`
                : `Transparent line-item roof replacement modeling calibrated to ${brand.city} municipal building codes.`}
            </p>

            {/* Apple-Style Segmented Trade Pill */}
            <div className="inline-flex items-center p-1 bg-stone-200/90 rounded-full mt-6 shadow-inner border border-stone-300/60">
              <button
                type="button"
                onClick={() => handleTradeModeChange("residential")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeMode === "residential"
                    ? "bg-white text-zinc-900 shadow-md ring-1 ring-black/5"
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
                    ? "bg-white text-zinc-900 shadow-md ring-1 ring-black/5"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-crimson" /> Commercial Flat / TPO
              </button>
            </div>
          </div>

          {/* Calculator Card Container with Apple-Grade Curves */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-zinc-200/80 space-y-8">
            {/* Step 1: Scope Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs sm:text-sm font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  1. Choose System Material
                </label>
                <span className="text-xs text-zinc-500 font-serif">
                  {tradeMode === "commercial" ? "Commercial Membrane" : "Residential Shingle & Metal"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentScopes.map((scope) => {
                  const isSelected = selectedScope === scope.title;
                  return (
                    <button
                      key={scope.title}
                      type="button"
                      onClick={() => setSelectedScope(scope.title)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-crimson bg-crimson/5 shadow-xs ring-2 ring-crimson/80"
                          : "border-zinc-200 hover:border-zinc-300 bg-stone-50/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-oswald uppercase tracking-wider font-bold text-sm text-zinc-900">
                            {scope.title}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-crimson bg-crimson" : "border-zinc-300 bg-white"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 font-serif mt-1">{scope.subtitle}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-serif">Warranty: {scope.warranty}</span>
                        <span className="font-oswald font-bold text-crimson">~${scope.rate.toFixed(2)}/sq ft</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Apple-Style Smooth Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-oswald uppercase tracking-wider font-bold text-zinc-900 block">
                    2. Approximate Roof Area
                  </label>
                  <span className="text-xs text-zinc-500 font-serif">
                    Drag the slider to match your property's footprint
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-oswald font-bold text-crimson">
                    {calculation.sqFt.toLocaleString()} sq ft
                  </div>
                  <span className="text-xs text-zinc-400 font-serif block">
                    ~{calculation.squares} Roofing Squares
                  </span>
                </div>
              </div>

              {/* Slider with Apple Curves & Accent */}
              <div className="pt-2">
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
                  className="w-full h-2.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-crimson focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-oswald uppercase tracking-wider text-zinc-400 mt-2 font-mono">
                  <span>{tradeMode === "commercial" ? "5,000 sq ft" : "1,200 sq ft (Cottage)"}</span>
                  <span>{tradeMode === "commercial" ? "25,000 sq ft" : "3,200 sq ft (Avg Home)"}</span>
                  <span>{tradeMode === "commercial" ? "50,000 sq ft" : "5,500 sq ft (Estate)"}</span>
                </div>
              </div>
            </div>

            {/* Step 3: Incentive Credit Toggle */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex items-start gap-3">
              <input
                type="checkbox"
                id="incentiveCredit"
                checked={includeIncentive}
                onChange={(e) => setIncludeIncentive(e.target.checked)}
                className="mt-1 w-4 h-4 text-emerald-600 border-zinc-300 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="incentiveCredit" className="text-xs text-zinc-700 font-serif cursor-pointer">
                <strong className="text-emerald-950 block font-oswald uppercase tracking-wider text-sm">
                  {brand.state === "FL"
                    ? "Apply Florida Wind Mitigation Insurance Discount (-$850/yr)"
                    : tradeMode === "commercial"
                    ? "Apply Commercial Cool Roof Energy Efficiency Credit"
                    : "Apply Impact-Resistant Class 4 Insurance Discount (Up to 28%)"}
                </strong>
                <span>
                  {brand.state === "FL"
                    ? "Secondary water barrier & hurricane fastener documentation qualify your property for statutory insurance deductions."
                    : tradeMode === "commercial"
                    ? "Solar-reflective white membranes reduce HVAC load and qualify for commercial utility rebates."
                    : "High-impact shingles qualify for verified homeowner insurance premium discounts."}
                </span>
              </label>
            </div>

            {/* Apple-Style Live Estimated Price Banner (Curved rounded-3xl) */}
            <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-oswald uppercase tracking-widest text-crimson font-bold block">
                    Calculated Project Investment
                  </span>
                  <div className="text-3xl sm:text-5xl font-oswald font-bold text-white mt-1">
                    ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                  </div>
                  <p className="text-xs text-zinc-400 font-serif mt-1">
                    Includes tear-off, synthetic underlayment, drip edge, flashing, certified labor & cleanup.
                  </p>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6 shrink-0">
                  <span className="text-[10px] font-oswald uppercase tracking-wider text-zinc-400 block">
                    As Low As
                  </span>
                  <div className="text-2xl sm:text-3xl font-oswald font-bold text-emerald-400">
                    ${calculation.monthly}/mo
                  </div>
                  <span className="text-[11px] text-zinc-400 font-serif block">
                    0% Down • Flexible Financing
                  </span>
                </div>
              </div>

              {/* Conversion CTA Button */}
              <div className="pt-6 mt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-400 font-serif flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free on-site drone & attic verification confirms exact line-item quote</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3.5 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Book Inspection for This Estimate <ArrowRight className="w-4 h-4" />
                </button>
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
