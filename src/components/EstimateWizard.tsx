import { useState, useMemo, useEffect } from "react";
import { useBrand } from "../BrandContext";
import {
  Calendar,
  Building2,
  Home,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Wrench,
  Download,
  ChevronLeft,
} from "lucide-react";
import BookingModal from "./BookingModal";

interface ScopeOption {
  id: string;
  title: string;
  subtitle: string;
  rate: number;
  warranty: string;
  icon: any;
}

export default function EstimateWizard({ variant = "full" }: { variant?: "full" | "sidebar" }) {
  const brand = useBrand();
  const isSidebar = variant === "sidebar";

  // Step 1: System Material | Step 2: Footprint & Regional Credits
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  const [tradeMode, setTradeMode] = useState<"residential" | "commercial">(
    brand.isCommercial ? "commercial" : "residential"
  );

  useEffect(() => {
    if (brand.isCommercial) {
      setTradeMode("commercial");
    }
  }, [brand.isCommercial]);

  // Dynamic Scopes Engine: Binds to brand.structuredServices & URL domain
  const dynamicScopes = useMemo(() => {
    const isFL = brand.state === "FL";
    const isComm = tradeMode === "commercial";
    const rawList = brand.structuredServices || [];

    if (isComm) {
      const commStructured = rawList.filter((s) => {
        const lower = s.title.toLowerCase();
        return (
          lower.includes("commercial") ||
          lower.includes("tpo") ||
          lower.includes("flat") ||
          lower.includes("coating") ||
          lower.includes("silicone") ||
          lower.includes("membrane")
        );
      });

      if (commStructured.length >= 2) {
        return commStructured.slice(0, 4).map((s, idx) => {
          let rate = 5.2;
          let warranty = "20-Yr NDL";
          let icon = Building2;
          const lower = s.title.toLowerCase();
          if (lower.includes("silicone") || lower.includes("coating")) {
            rate = 4.2;
            warranty = "15-20 Yr Seal";
            icon = Layers;
          } else if (lower.includes("metal") || lower.includes("standing seam")) {
            rate = 7.6;
            warranty = "30-Yr Commercial";
            icon = Wrench;
          } else if (lower.includes("mod") || lower.includes("bitumen")) {
            rate = 6.2;
            warranty = "25-Yr Commercial";
            icon = Building2;
          }
          return {
            id: `comm-dyn-${idx}`,
            title: s.title,
            subtitle: s.desc || "Certified cool-roof single-ply system engineered for high thermal efficiency and zero-leak reliability.",
            rate,
            warranty,
            icon,
          };
        });
      }

      return [
        {
          id: "comm-tpo",
          title: "60-Mil TPO Heat-Welded Membrane",
          subtitle: "Energy Star reflective cool-roof single-ply membrane engineered for high thermal efficiency and puncture defense.",
          rate: 5.2,
          warranty: "20-Yr NDL",
          icon: Building2,
        },
        {
          id: "comm-silicone",
          title: "Seamless Silicone Restoration Coating",
          subtitle: "Liquid-applied monolithic silicone barrier extending existing commercial roof life by 15-20 years with zero tear-off.",
          rate: 4.2,
          warranty: "15-20 Yr Seal",
          icon: Layers,
        },
        {
          id: "comm-modbit",
          title: "Multi-Ply Modified Bitumen System",
          subtitle: "Dual-ply SBS rubberized asphalt system engineered for heavy foot traffic, mechanical equipment decks, and flat roofs.",
          rate: 6.2,
          warranty: "25-Yr Commercial",
          icon: Building2,
        },
        {
          id: "comm-metal",
          title: "Commercial Structural Standing Seam",
          subtitle: "Heavy-gauge architectural steel panels with concealed fasteners engineered for facilities, retail centers, and complexes.",
          rate: 7.6,
          warranty: "30-Yr Warranty",
          icon: Wrench,
        },
      ];
    }

    // Residential Scopes from brand.structuredServices
    const resStructured = rawList.filter((s) => {
      const lower = s.title.toLowerCase();
      return (
        !lower.includes("commercial") &&
        !lower.includes("tpo") &&
        !lower.includes("flat") &&
        !lower.includes("coating")
      );
    });

    if (resStructured.length >= 2) {
      return resStructured.slice(0, 4).map((s, idx) => {
        let rate = 4.8;
        let warranty = "50-Yr Lifetime";
        let icon = Home;
        const lower = s.title.toLowerCase();
        if (lower.includes("metal") || lower.includes("standing seam")) {
          rate = 7.8;
          warranty = "50+ Yr Resilient";
          icon = Wrench;
        } else if (lower.includes("tile") || lower.includes("slate") || lower.includes("shake")) {
          rate = 8.9;
          warranty = isFL ? "50-Yr Hurricane" : "Lifetime Premium";
          icon = Sparkles;
        } else if (lower.includes("impact") || lower.includes("hail") || lower.includes("class 4")) {
          rate = 5.8;
          warranty = "Lifetime Impact";
          icon = ShieldCheck;
        } else if (lower.includes("wind") || lower.includes("mitigation") || lower.includes("hurricane")) {
          rate = 5.6;
          warranty = "140 MPH Wind";
          icon = ShieldCheck;
        }
        return {
          id: `res-dyn-${idx}`,
          title: s.title,
          subtitle: s.desc || "Certified architectural system engineered to local municipal building codes and lifetime warranty standards.",
          rate,
          warranty,
          icon,
        };
      });
    }

    // Default residential scopes tailored by state
    const scopes: ScopeOption[] = [
      {
        id: "res-shingle",
        title: "Lifetime Architectural Shingles",
        subtitle: "High-definition multi-dimensional shingle systems engineered for severe weather and backed by non-prorated warranty.",
        rate: 4.8,
        warranty: "50-Yr Lifetime",
        icon: Home,
      },
    ];

    if (isFL) {
      scopes.push({
        id: "res-hurricane",
        title: "140+ MPH Hurricane-Fortified Shingle",
        subtitle: "High-wind engineered 6-nail reinforced installation with secondary water barrier (SWR) underlayment for coastal defense.",
        rate: 5.6,
        warranty: "140 MPH Wind",
        icon: ShieldCheck,
      });
    } else {
      scopes.push({
        id: "res-impact",
        title: "Class 4 Impact Hail Defense",
        subtitle: "UL 2218 impact-rated SBS asphalt shingles qualifying your home for up to 28% annual insurance premium discounts across Texas.",
        rate: 5.8,
        warranty: "Lifetime Impact",
        icon: ShieldCheck,
      });
    }

    scopes.push({
      id: "res-metal",
      title: "Standing Seam Designer Metal",
      subtitle: "24-gauge concealed-fastener architectural steel roofing providing unmatched durability, modern aesthetics, and 50+ year longevity.",
      rate: 7.8,
      warranty: "50+ Yr Resilient",
      icon: Wrench,
    });

    if (isFL) {
      scopes.push({
        id: "res-tile",
        title: "Florida Tile & Concrete Barrel System",
        subtitle: "Mechanically fastened and foam-adhered Spanish tile engineered to resist severe coastal winds, heavy salt spray, and UV heat.",
        rate: 9.4,
        warranty: "50-Yr Hurricane",
        icon: Sparkles,
      });
    } else {
      scopes.push({
        id: "res-shake",
        title: "Designer Shake & Composite Tile",
        subtitle: "Class A fire-rated composite shake replicating authentic dimensional depth without high wood maintenance or rot risks.",
        rate: 8.9,
        warranty: "Lifetime Premium",
        icon: Sparkles,
      });
    }

    return scopes;
  }, [brand.state, brand.structuredServices, tradeMode]);

  const [selectedScope, setSelectedScope] = useState<string>(dynamicScopes[0].title);
  const [resSqFt, setResSqFt] = useState<number>(2400);
  const [commSqFt, setCommSqFt] = useState<number>(12000);
  const [includeIncentive, setIncludeIncentive] = useState<boolean>(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleTradeModeChange = (mode: "residential" | "commercial") => {
    setTradeMode(mode);
    setActiveStep(1);
  };

  useEffect(() => {
    setSelectedScope(dynamicScopes[0].title);
  }, [dynamicScopes]);

  // Size Presets
  const resPresets = [
    { label: "1,600 sq ft", value: 1600, desc: "Cottage / Ranch" },
    { label: "2,400 sq ft", value: 2400, desc: "Standard Home" },
    { label: "3,500 sq ft", value: 3500, desc: "Spacious Home" },
    { label: "5,000 sq ft", value: 5000, desc: "Estate Residence" },
  ];

  const commPresets = [
    { label: "5,000 sq ft", value: 5000, desc: "Retail Facility" },
    { label: "12,000 sq ft", value: 12000, desc: "Commercial Deck" },
    { label: "25,000 sq ft", value: 25000, desc: "Business Center" },
    { label: "50,000 sq ft", value: 50000, desc: "Industrial Complex" },
  ];

  const currentPresets = tradeMode === "commercial" ? commPresets : resPresets;
  const currentSqFt = tradeMode === "commercial" ? commSqFt : resSqFt;

  const calculation = useMemo(() => {
    const isComm = tradeMode === "commercial";
    const sqFt = isComm ? commSqFt : resSqFt;
    const activeScope = dynamicScopes.find((s) => s.title === selectedScope) || dynamicScopes[0];

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
  }, [tradeMode, selectedScope, resSqFt, commSqFt, includeIncentive, brand.state, dynamicScopes]);

  const incentiveInfo = useMemo(() => {
    if (brand.state === "FL") {
      return {
        title: "Florida Statutory Wind Mitigation Credit (OIR-B1-1802)",
        desc: "Certified secondary water barrier and hurricane clips qualify for statutory homeowner insurance discounts.",
      };
    }
    if (tradeMode === "commercial") {
      return {
        title: "Commercial Energy Star Cool Roof Rebate & Section 179",
        desc: "Reflective single-ply cool-roof membranes qualify for municipal utility rebates and direct operating write-offs.",
      };
    }
    if (brand.state === "TX") {
      return {
        title: "Texas TDI Class 4 Hail Insurance Reduction (Up to 28%)",
        desc: "Certified UL 2218 impact-resistant shingle installations qualify for annual policy premium discounts up to 28%.",
      };
    }
    return {
      title: "Certified Manufacturer Lifetime Warranty Rebate",
      desc: "Licensed installer credentials qualify your project for non-prorated manufacturer coverage and local rebates.",
    };
  }, [brand.state, tradeMode]);

  // Executive Printable / PDF Takeoff Scope Generator (SOW Deliverable #1)
  const handleDownloadPdfBrief = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${brand.name} - Preliminary Project Scope Brief</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #18181b; padding: 40px; margin: 0; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #8B0000; padding-bottom: 18px; margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: bold; text-transform: uppercase; color: #18181b; margin: 0; }
            .subtitle { font-size: 13px; color: #71717a; margin-top: 4px; }
            .badge { display: inline-block; background: #ecfdf5; color: #065f46; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; border: 1px solid #a7f3d0; text-transform: uppercase; margin-bottom: 8px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #8B0000; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .card { background: #f4f4f5; border-radius: 12px; padding: 16px; border: 1px solid #e4e4e7; }
            .card-label { font-size: 11px; color: #71717a; text-transform: uppercase; }
            .card-value { font-size: 18px; font-weight: bold; color: #18181b; margin-top: 4px; }
            .price-box { background: #fafaf9; border: 2px solid #8B0000; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
            .price-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #8B0000; }
            .price-val { font-size: 32px; font-weight: bold; color: #18181b; margin: 8px 0; }
            .price-sub { font-size: 12px; color: #059669; font-weight: bold; }
            .inclusions { list-style: none; padding: 0; margin: 0; }
            .inclusions li { font-size: 13px; padding: 6px 0; border-bottom: 1px solid #f4f4f5; display: flex; align-items: center; }
            .inclusions li::before { content: "✓ "; color: #8B0000; font-weight: bold; margin-right: 8px; }
            .footer { border-top: 1px solid #e4e4e7; padding-top: 20px; font-size: 11px; color: #71717a; text-align: center; margin-top: 32px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="badge">Official Preliminary Takeoff Scope</div>
              <h1 class="title">${brand.name}</h1>
              <div class="subtitle">${brand.city} • Direct Dispatch: ${brand.phone} • ${brand.email || "service@" + (brand.domain || "contractor.com")}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: #71717a;">DATE COMPILED</div>
              <div style="font-size: 14px; font-weight: bold;">${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div style="font-size: 11px; color: #059669; margin-top: 4px;">4–5 Day Rapid Deployment SLA</div>
            </div>
          </div>

          <div class="price-box">
            <div class="price-title">Estimated Investment Planning Bracket</div>
            <div class="price-val">$${calculation.low.toLocaleString()} &ndash; $${calculation.high.toLocaleString()}</div>
            <div class="price-sub">As Low As $${calculation.monthly}/mo with Qualified Financing &bull; Includes $${calculation.incentiveAmount.toLocaleString()} Local Incentive Credit</div>
          </div>

          <div class="section">
            <div class="section-title">Project Specifications</div>
            <div class="grid">
              <div class="card">
                <div class="card-label">Selected System Scope</div>
                <div class="card-value" style="font-size: 15px;">${selectedScope}</div>
              </div>
              <div class="card">
                <div class="card-label">Surface Area / Footprint</div>
                <div class="card-value">${calculation.sqFt.toLocaleString()} sq ft (${calculation.squares} Squares)</div>
              </div>
              <div class="card">
                <div class="card-label">Market Calibration</div>
                <div class="card-value" style="font-size: 15px;">${brand.city}, ${brand.state}</div>
              </div>
              <div class="card">
                <div class="card-label">Warranty Protection</div>
                <div class="card-value" style="font-size: 15px; color: #8B0000;">${calculation.activeScope.warranty} Non-Prorated</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Standard Turnkey Inclusions & Compliance</div>
            <ul class="inclusions">
              <li>Complete tear-off, forensic structural deck inspection & municipal code compliance</li>
              <li>Synthetic moisture-barrier underlayment, ice/water shield & neoprene pipe-boot flashings</li>
              <li>Non-prorated manufacturer warranty & triple-sweep magnetic nail cleanup certification</li>
              <li>${brand.state === "FL" ? "Florida OIR-B1-1802 Wind Mitigation Inspection certification" : brand.state === "TX" ? "Texas HB 2102 statutory deductible compliance and adjuster scoping" : "Full manufacturer certified installation and storm resilience standards"}</li>
            </ul>
          </div>

          <div class="footer">
            Zero deposit required &bull; Complimentary on-site diagnostic survey confirms final firm proposal &bull; ${brand.name}
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
      <section
        id="estimate"
        className={
          isSidebar
            ? "py-6 px-4 bg-stone-50"
            : "py-6 sm:py-8 px-4 sm:px-6 bg-stone-100/70 border-y border-stone-200"
        }
      >
        <div className={isSidebar ? "w-full" : "max-w-7xl mx-auto"}>
          {/* STREAMLINED APPLE HEADER: Clean, Single-Row Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5 border-b border-stone-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-oswald uppercase tracking-widest text-crimson font-bold">
                  Takeoff Scoping Engine • {brand.city.toUpperCase()}
                </span>
                <span className="text-zinc-300 hidden sm:inline">•</span>
                <span className="text-[11px] text-zinc-500 font-serif hidden sm:inline">
                  Calibrated to local building codes & crew labor
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-0.5">
                Instant Roof Cost Calculator
              </h2>
            </div>

            {/* Apple-Style Segmented Switcher */}
            <div className="inline-flex items-center p-1 bg-stone-200/90 rounded-full shadow-2xs border border-stone-300/70 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => handleTradeModeChange("residential")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeMode === "residential"
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Home className="w-3.5 h-3.5 text-crimson" /> Residential
              </button>
              <button
                type="button"
                onClick={() => handleTradeModeChange("commercial")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tradeMode === "commercial"
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-crimson" /> Commercial Flat / TPO
              </button>
            </div>
          </div>

          {/* TWO-COLUMN STUDIO DESIGNED TO FIT IN A SINGLE SCREEN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* LEFT COLUMN: 2-Step Breathable Studio (7 Columns) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/90 space-y-4">
              {/* Stepper Tabs Bar */}
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      activeStep === 1
                        ? "bg-crimson text-white shadow-2xs"
                        : "bg-stone-100 text-zinc-600 hover:bg-stone-200"
                    }`}
                  >
                    <span>1. System Material</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      activeStep === 2
                        ? "bg-crimson text-white shadow-2xs"
                        : "bg-stone-100 text-zinc-600 hover:bg-stone-200"
                    }`}
                  >
                    <span>2. Size & Incentives</span>
                  </button>
                </div>

                <span className="text-[11px] font-serif text-zinc-400 hidden sm:inline">
                  Step {activeStep} of 2
                </span>
              </div>

              {/* STEP 1: Choose Roof System Material (Spacious, Breathable Cards) */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                      Select Material Specification
                    </span>
                    <span className="text-xs text-zinc-500 font-sans">
                      {tradeMode === "commercial" ? "Commercial Scope" : "Residential Scope"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dynamicScopes.map((scope) => {
                      const isSelected = selectedScope === scope.title;
                      const Icon = scope.icon;
                      return (
                        <button
                          key={scope.id}
                          type="button"
                          onClick={() => setSelectedScope(scope.title)}
                          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "border-crimson bg-crimson/5 shadow-2xs ring-1 ring-crimson"
                              : "border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-white"
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                    isSelected ? "bg-crimson text-white" : "bg-stone-200/80 text-zinc-700"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                                  {scope.title}
                                </span>
                              </div>
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? "border-crimson bg-crimson" : "border-stone-300 bg-white"
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-600 font-serif leading-relaxed mt-2 line-clamp-2">
                              {scope.subtitle}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                            <span className="text-zinc-500 font-serif">
                              {scope.warranty}
                            </span>
                            <span className="font-oswald font-bold text-crimson text-xs">
                              ${scope.rate.toFixed(2)} / sq ft
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue Button to Step 2 */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer shadow-xs"
                    >
                      <span>Configure Footprint & Incentives</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Approximate Footprint & Local Incentives */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900 block">
                        Approximate Roof Footprint
                      </span>
                      <span className="text-xs text-zinc-500 font-serif">
                        Select standard preset or drag precision slider
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

                  {/* Tactile Size Presets */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {currentPresets.map((preset) => {
                      const isPresetSelected = currentSqFt === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            if (tradeMode === "commercial") {
                              setCommSqFt(preset.value);
                            } else {
                              setResSqFt(preset.value);
                            }
                          }}
                          className={`p-3 text-center rounded-xl border transition-all cursor-pointer ${
                            isPresetSelected
                              ? "border-crimson bg-crimson text-white font-bold shadow-2xs"
                              : "border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-zinc-700"
                          }`}
                        >
                          <div className="text-xs font-oswald uppercase tracking-wider font-bold">
                            {preset.label}
                          </div>
                          <div
                            className={`text-[10px] font-serif mt-0.5 truncate ${
                              isPresetSelected ? "text-white/80" : "text-zinc-500"
                            }`}
                          >
                            {preset.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Smooth Slider */}
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
                      <span>{tradeMode === "commercial" ? "5,000 sq ft" : "1,200 sq ft"}</span>
                      <span>{tradeMode === "commercial" ? "25,000 sq ft" : "3,200 sq ft (Average)"}</span>
                      <span>{tradeMode === "commercial" ? "50,000 sq ft" : "5,500 sq ft"}</span>
                    </div>
                  </div>

                  {/* Apple-Style Local Incentive & Rebate Toggle */}
                  <div
                    onClick={() => setIncludeIncentive(!includeIncentive)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      includeIncentive
                        ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/20 shadow-2xs"
                        : "bg-stone-50 border-stone-200/80 hover:bg-stone-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          includeIncentive ? "bg-emerald-600 text-white" : "bg-stone-200 text-zinc-500"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-oswald uppercase tracking-wider font-bold text-xs text-zinc-900 truncate">
                            {incentiveInfo.title}
                          </span>
                          <span
                            className={`text-[10px] font-oswald uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
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
                        <p className="text-[11px] text-zinc-600 font-serif leading-snug mt-0.5 line-clamp-1">
                          {incentiveInfo.desc}
                        </p>
                      </div>
                    </div>

                    {/* Apple Toggle Switch */}
                    <div
                      className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                        includeIncentive ? "bg-emerald-600" : "bg-stone-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          includeIncentive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Back to Step 1 */}
                  <div className="pt-1 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-800 text-xs font-oswald uppercase tracking-wider font-bold cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Change Selected Material
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Apple-Grade Investment Summary & Dual Actions (5 Columns) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-200/90 space-y-4 lg:sticky lg:top-20">
              <div>
                <span className="text-[11px] font-oswald uppercase tracking-widest text-crimson font-bold block">
                  Estimated Investment Planning Bracket
                </span>
                <div className="text-3xl font-oswald font-bold text-zinc-950 tracking-tight transition-all mt-0.5">
                  ${calculation.low.toLocaleString()} &ndash; ${calculation.high.toLocaleString()}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-oswald uppercase tracking-wider font-bold">
                    As Low As ${calculation.monthly} / mo
                  </span>
                  {includeIncentive && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-oswald uppercase tracking-wider font-bold border border-emerald-200">
                      ✓ -${calculation.incentiveAmount.toLocaleString()} Savings Applied
                    </span>
                  )}
                </div>
              </div>

              {/* Transparent Scope Details Card */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs font-sans">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-zinc-500 font-serif">Selected Scope:</span>
                  <strong className="text-zinc-900 font-semibold text-right max-w-[210px]">
                    {selectedScope}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-serif">Surface Footprint:</span>
                  <strong className="text-zinc-900 font-semibold">
                    {calculation.sqFt.toLocaleString()} sq ft ({calculation.squares} Squares)
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-serif">Service Territory:</span>
                  <strong className="text-zinc-900 font-semibold">
                    {brand.city.includes(brand.state) ? brand.city : `${brand.city}, ${brand.state}`}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-serif">Warranty Protection:</span>
                  <strong className="text-crimson font-semibold">
                    {calculation.activeScope.warranty} Non-Prorated
                  </strong>
                </div>
              </div>

              {/* Turnkey Inclusions */}
              <div className="space-y-1.5 font-sans pt-0.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Complete tear-off, structural deck inspection & disposal
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Synthetic moisture-barrier underlayment & ice shield
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" />
                  <span className="text-zinc-700 text-xs leading-snug">
                    Non-prorated manufacturer warranty & magnetic cleanup
                  </span>
                </div>
              </div>

              {/* Dual Direct Actions: Booking + PDF Download */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-3.5 px-6 rounded-full font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-101 active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Lock Estimate & Book Free Inspection <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdfBrief}
                  className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-zinc-800 py-2.5 px-4 rounded-full font-oswald uppercase tracking-wider font-bold text-xs border border-stone-300 transition-all cursor-pointer"
                  title="Download instant printable PDF brief for HOA, insurance, or corporate board"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-600" /> Download Scope Brief (.PDF)
                </button>

                <p className="text-[11px] text-zinc-500 font-serif text-center mt-1">
                  Zero deposit required &bull; Complimentary on-site diagnostic survey confirms final quote
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Synchronized Apple-Grade Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={`${selectedScope} (${calculation.sqFt.toLocaleString()} sq ft estimate)`}
        initialEstimate={`$${calculation.low.toLocaleString()} – $${calculation.high.toLocaleString()}`}
      />
    </>
  );
}
