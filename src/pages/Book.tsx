import { useState } from "react";
import { useBrand } from "../BrandContext";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  Download,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Check,
} from "lucide-react";

export default function Book() {
  const brand = useBrand();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<string>(
    brand.isJim
      ? "Florida Wind Mitigation Inspection"
      : brand.isDrew
      ? "Building Science Roof Inspection"
      : brand.isRichard
      ? "Commercial TPO / Flat Roof Inspection"
      : "Free Roof Replacement Inspection"
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>("Morning (9:00 AM - 11:30 AM)");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const services = brand.isJim
    ? [
        {
          id: "wind-mit",
          title: "Florida Wind Mitigation Inspection",
          subtitle: "Official DBPR form to qualify for $500–$1,200/yr insurance savings",
          tag: "Recommended for Florida Homeowners",
          badge: "FL DBPR Certified",
        },
        {
          id: "storm-leak",
          title: "Emergency Storm Leak & Tarping",
          subtitle: "Priority 24/7 hurricane & tropical storm leak response",
          tag: "Same-Day Dispatch",
          badge: "Emergency Priority",
        },
        {
          id: "shingle-replace",
          title: "Full Shingle Roof Replacement",
          subtitle: "140+ MPH hurricane-rated architectural shingle system",
          tag: "Turnkey Replacement",
          badge: "Lifetime Warranty",
        },
        {
          id: "metal-tile",
          title: "Worthouse Metal Tile Installation",
          subtitle: "Premium European steel roofing engineered for coastal winds",
          tag: "Maximum Durability",
          badge: "Class 4 Impact",
        },
        {
          id: "commercial-tpo",
          title: "Commercial TPO & Flat Coating",
          subtitle: "Commercial silicone and single-ply membranes across Jax",
          tag: "Commercial Scope",
          badge: "Commercial Grade",
        },
      ]
    : brand.isDrew
    ? [
        {
          id: "building-science",
          title: "Building Science Forensic Roof Inspection",
          subtitle: "Attic thermodynamic ventilation modeling & thermal roof imaging",
          tag: "Drew Boy Specialty",
          badge: "MS Building Science",
        },
        {
          id: "gaf-plus",
          title: "GAF Certified Plus Shingle Replacement",
          subtitle: "50-year non-prorated manufacturer warranty on Timberline HDZ",
          tag: "GAF Certified Plus",
          badge: "50-Yr Warranty",
        },
        {
          id: "hail-defense",
          title: "Class 4 Impact Hail Defense (Armorshield II)",
          subtitle: "Maximum Austin insurance premium reduction and hail resistance",
          tag: "Class 4 Impact",
          badge: "Hail Tested",
        },
        {
          id: "hb2102",
          title: "Texas HB 2102 Insurance Claim Restoration",
          subtitle: "100% Texas law compliant forensic damage scoping with adjuster",
          tag: "Deductible Compliant",
          badge: "HB 2102 Integrity",
        },
      ]
    : brand.isRichard
    ? [
        {
          id: "commercial-flat",
          title: "Commercial Flat Roof (TPO / PVC / Mod-Bit)",
          subtitle: "31+ years Houston commercial authority for retail & industrial",
          tag: "Commercial Specialist",
          badge: "31+ Years Houston",
        },
        {
          id: "residential-shingle",
          title: "Residential Architectural Shingle Replacement",
          subtitle: "High-wind hurricane fastening for Houston & Gulf Coast humidity",
          tag: "Promises Kept",
          badge: "BBB A+ Accredited",
        },
        {
          id: "tdi-inspection",
          title: "Gulf Coast Windstorm & TDI Inspection",
          subtitle: "Certified windstorm inspection for Harris, Fort Bend & Gulf Coast",
          tag: "TDI Certified",
          badge: "Windstorm Rated",
        },
        {
          id: "emergency-houston",
          title: "Houston Emergency Roof Leak Repair",
          subtitle: "Immediate diagnostic and leak stop across Greater Houston",
          tag: "Fast Response",
          badge: "Fully Insured",
        },
      ]
    : [
        {
          id: "standard-inspect",
          title: "Free 21-Point Roof Inspection",
          subtitle: "Comprehensive forensic examination of shingles, flashing & deck",
          tag: "100% Free",
          badge: "Zero Obligation",
        },
        {
          id: "full-replace",
          title: "Complete Roof Replacement",
          subtitle: "Architectural shingles with 25-50 year non-prorated warranties",
          tag: "Most Popular",
          badge: "Licensed & Insured",
        },
        {
          id: "leak-repair",
          title: "Emergency Roof Leak Repair",
          subtitle: "Rapid-response tarping and structural seal for storm damage",
          tag: "Fast Dispatch",
          badge: "Emergency Service",
        },
        {
          id: "commercial-roof",
          title: "Commercial Roof Maintenance & TPO",
          subtitle: "Commercial-grade flat roof repair and restoration systems",
          tag: "Commercial Scope",
          badge: "Commercial Grade",
        },
      ];

  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split("T")[0];
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { iso, weekday, monthDay };
  });

  const slots = [
    { id: "morning", label: "Morning Window", time: "9:00 AM - 11:30 AM", badge: "High Demand" },
    { id: "afternoon", label: "Afternoon Window", time: "2:00 PM - 4:30 PM", badge: "Optimal Light" },
    { id: "urgent", label: "Priority Immediate", time: "First Available Dispatch Window", badge: "Emergency" },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const code = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationCode(code);
      setSubmitting(false);
      setStep(4);
    }, 600);
  };

  const handleDownloadCalendar = () => {
    const cleanDate = selectedDate.replace(/-/g, "");
    const startTime = "140000Z";
    const endTime = "160000Z";
    const title = `${brand.name} - Roof Inspection Appointment (${selectedService})`;
    const description = `Confirmed Roof Inspection with ${brand.name} for ${name}. Service: ${selectedService}. Address: ${address}. Dispatch Line: ${brand.phone}. Confirmation: ${confirmationCode}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Roofing Appointment Scheduler//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${address || brand.city}`,
      `DTSTART:${cleanDate}T${startTime}`,
      `DTEND:${cleanDate}T${endTime}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Roof-Inspection-${confirmationCode || "Confirmed"}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const inspectionChecklist = [
    "Full attic moisture, thermal leak & thermodynamic ventilation check",
    "High-resolution digital drone / physical shingle & valley inspection",
    "Flashings, plumbing boot collars, drip edges & gutter integrity",
    "Written forensic condition report with itemized repair / replacement options",
    "100% Free with zero high-pressure sales obligations",
  ];

  return (
    <div className="pt-24 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page Top Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-crimson/10 border border-crimson/30 px-3.5 py-1 text-crimson text-xs font-oswald uppercase tracking-widest font-bold mb-3">
            <CalendarIcon className="w-3.5 h-3.5" />
            Official Inspection Reservation Portal
          </div>
          <h1 className="text-3xl sm:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 leading-tight">
            Schedule Your Free Roof Inspection with {brand.name}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 font-serif">
            {brand.isJim
              ? "Lock in your Florida Wind Mitigation or storm recovery inspection with Jim Jessup. Serving Jacksonville, St. Augustine, Orange Park & Northeast Florida."
              : brand.isDrew
              ? "Lock in your Austin building science roof and attic inspection with Drew Boy. 100% Texas HB 2102 compliant."
              : brand.isRichard
              ? "Lock in your Greater Houston commercial or residential roof evaluation with Richard Keathley and David. 31+ years of promises kept."
              : "Lock in your comprehensive 21-point roof inspection with our licensed master craftsmen. Guaranteed on-time arrival and transparent reporting."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Card (7 cols) */}
          <div className="lg:col-span-8 bg-white border-2 border-stone-300 shadow-xl overflow-hidden">
            {/* Step Indicator Header */}
            <div className="bg-zinc-950 text-white px-6 py-4 flex items-center justify-between border-b-2 border-crimson">
              <span className="font-oswald uppercase tracking-wider font-bold text-sm">
                Live Reservation Dispatch System
              </span>
              <span className="text-xs text-zinc-400 font-serif">
                Direct Line: <strong className="text-white">{brand.phone}</strong>
              </span>
            </div>

            <div className="bg-stone-100 border-b border-stone-200 px-6 py-3 flex items-center justify-between text-xs font-oswald uppercase tracking-wider">
              <span className={step >= 1 ? "text-crimson font-bold" : "text-zinc-400"}>
                1. Service Scope
              </span>
              <span className="text-stone-300">/</span>
              <span className={step >= 2 ? "text-crimson font-bold" : "text-zinc-400"}>
                2. Date & Time
              </span>
              <span className="text-stone-300">/</span>
              <span className={step >= 3 ? "text-crimson font-bold" : "text-zinc-400"}>
                3. Property Intake
              </span>
              <span className="text-stone-300">/</span>
              <span className={step >= 4 ? "text-emerald-600 font-bold" : "text-zinc-400"}>
                4. Confirmation
              </span>
            </div>

            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    Step 1: Choose Your Project Scope
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 font-serif mt-1">
                    Select the service you would like inspected or estimated. All initial inspections are 100% free with zero obligation.
                  </p>
                </div>

                <div className="space-y-3">
                  {services.map((s) => {
                    const isSelected = selectedService === s.title;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.title)}
                        className={`w-full text-left p-4 border transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? "border-crimson bg-crimson/5 shadow-sm"
                            : "border-stone-200 hover:border-stone-400 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm sm:text-base">
                              {s.title}
                            </span>
                            <span className="text-[10px] font-oswald uppercase font-bold tracking-wider px-2 py-0.5 bg-stone-200 text-zinc-800">
                              {s.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 font-serif mt-1">{s.subtitle}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "border-crimson bg-crimson text-white"
                              : "border-stone-300 bg-white"
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3.5 font-oswald uppercase tracking-wider font-bold text-sm shadow-md transition-all"
                  >
                    Continue to Date & Window <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Slot */}
            {step === 2 && (
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    Step 2: Choose Preferred Date & Window
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 font-serif mt-1">
                    Select an arrival window that fits your schedule. Our field specialist will bring complete diagnostic tools.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-2">
                    1. Inspection Date
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {dateOptions.map((d) => {
                      const isSelected = selectedDate === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDate(d.iso)}
                          className={`p-3 text-center border transition-all ${
                            isSelected
                              ? "border-crimson bg-crimson text-white shadow-md"
                              : "border-stone-200 bg-white hover:border-stone-400 text-zinc-800"
                          }`}
                        >
                          <div className="text-[10px] font-oswald uppercase tracking-wider">
                            {d.weekday}
                          </div>
                          <div className="text-xs font-bold font-oswald mt-0.5">{d.monthDay}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-2">
                    2. Arrival Window
                  </label>
                  <div className="space-y-3">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot.includes(slot.time);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                          className={`w-full text-left p-4 border transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-crimson bg-crimson/5 shadow-sm"
                              : "border-stone-200 hover:border-stone-400 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Clock
                              className={`w-4 h-4 ${isSelected ? "text-crimson" : "text-zinc-500"}`}
                            />
                            <div>
                              <div className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm sm:text-base">
                                {slot.label}
                              </div>
                              <div className="text-xs text-zinc-600 font-serif">{slot.time}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-oswald uppercase font-bold px-2 py-0.5 bg-stone-100 text-zinc-700">
                            {slot.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-oswald uppercase tracking-wider text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3.5 font-oswald uppercase tracking-wider font-bold text-sm shadow-md transition-all"
                  >
                    Continue to Property Intake <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Property Details */}
            {step === 3 && (
              <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    Step 3: Property Details & SMS Dispatch Intake
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 font-serif mt-1">
                    Provide the physical address where our roofing lead will conduct the on-site inspection.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-3.5 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-zinc-500 font-serif">Selected Scope:</span>{" "}
                    <strong className="text-zinc-900 font-oswald">{selectedService}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-serif">Reserved Slot:</span>{" "}
                    <strong className="text-crimson font-oswald">
                      {selectedDate} • {selectedSlot}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Anderson"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                      Mobile Phone (SMS Notifications) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(904) 555-0199"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Property Address in {brand.city} *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Ocean Blvd, Jacksonville, FL 32250"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Special Roof Notes (Active leak, roof age, insurance adjuster date)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any details that will help our inspector prepare..."
                    className="w-full p-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-600 bg-amber-50 border border-amber-200 p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    100% Free Inspection. No credit card or advance fee required for scheduling.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-oswald uppercase tracking-wider text-xs font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Date & Window
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-8 py-3.5 font-oswald uppercase tracking-wider font-bold text-sm shadow-lg disabled:opacity-50 transition-all"
                  >
                    {submitting ? "Reserving Slot..." : "Confirm & Lock My Inspection Slot"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <span className="text-xs font-oswald uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3.5 py-1 border border-emerald-200">
                    Inspection Confirmed & Reserved
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-3">
                    Your Inspection is Dispatched to {brand.name}
                  </h2>
                  <p className="text-sm text-zinc-500 font-mono mt-1">
                    Master Reservation Code:{" "}
                    <strong className="text-zinc-900 text-base">{confirmationCode}</strong>
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-5 max-w-lg mx-auto text-left space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-zinc-500 font-serif">Certified Contractor:</span>
                    <span className="font-bold text-zinc-900 font-oswald">{brand.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-zinc-500 font-serif">Selected Scope:</span>
                    <span className="font-bold text-zinc-900 font-oswald">{selectedService}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-zinc-500 font-serif">Inspection Window:</span>
                    <span className="font-bold text-crimson font-oswald">
                      {selectedDate} • {selectedSlot}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="text-zinc-500 font-serif">Property Location:</span>
                    <span className="font-bold text-zinc-900 font-oswald">{address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-serif">Direct Dispatch Line:</span>
                    <span className="font-bold text-zinc-900 font-oswald">{brand.phone}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 font-serif max-w-md mx-auto">
                  We have queued automated SMS arrival updates for{" "}
                  <strong className="text-zinc-900">{phone}</strong>. Our lead inspector will give you
                  a courtesy call prior to dispatch.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                  <button
                    type="button"
                    onClick={handleDownloadCalendar}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white px-6 py-3 font-oswald uppercase tracking-wider font-bold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download .ICS Calendar Invite
                  </button>
                  <a
                    href={`tel:${brand.phone}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-6 py-3 font-oswald uppercase tracking-wider font-bold text-xs shadow-md"
                  >
                    <Phone className="w-4 h-4" /> Call Dispatch: {brand.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Credential & Checklist Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Guarantee Box */}
            <div className="bg-white border-2 border-stone-300 p-6 shadow-md">
              <div className="flex items-center gap-2 text-crimson font-oswald uppercase tracking-wider font-bold text-sm mb-3">
                <ShieldCheck className="w-5 h-5 text-crimson" />
                The {brand.name} Standard
              </div>
              <p className="text-xs text-zinc-600 font-serif leading-relaxed mb-4">
                {brand.isJim
                  ? "Over 20 years of hurricane-tested Northeast Florida craftsmanship. Florida DBPR Lic. # RC29027754 with a 4.9-star rating across Duval and St. Johns."
                  : brand.isDrew
                  ? "Building science roofing engineering from Drew Boy (Texas State MS). 100% Texas HB 2102 compliant with full insurance forensic integrity."
                  : brand.isRichard
                  ? "31+ years of Houston roofing heritage (Since 1995). BBB A+ accredited and HAA/TAA commercial and residential authority."
                  : "Certified roofing specialists committed to honest assessments, non-prorated warranties, and 100% customer satisfaction."}
              </p>

              <div className="border-t border-stone-200 pt-4 space-y-2.5">
                <h3 className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  What&apos;s Included In Every Free Inspection:
                </h3>
                {inspectionChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 font-serif">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Immediate Help? Box */}
            <div className="bg-zinc-950 text-white p-6 border-t-4 border-t-crimson shadow-md">
              <span className="text-[10px] font-oswald uppercase tracking-widest text-crimson font-bold">
                Active Leak Emergency?
              </span>
              <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-white mt-1">
                Same-Day Emergency Tarping
              </h3>
              <p className="text-xs text-zinc-400 font-serif mt-2 leading-relaxed">
                If your roof is actively leaking or has sustained catastrophic wind damage, do not wait for an appointment. Call our direct line immediately.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <a
                  href={`tel:${brand.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-4 py-2.5 font-oswald uppercase tracking-wider font-bold text-xs"
                >
                  <Phone className="w-4 h-4" /> Direct Line: {brand.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
