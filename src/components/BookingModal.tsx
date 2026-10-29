import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../BrandContext";
import {
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  X,
  Download,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialAddress?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialService,
  initialAddress,
}: BookingModalProps) {
  const brand = useBrand();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<string>(
    initialService ||
      (brand.isJim
        ? "Florida Wind Mitigation Inspection"
        : brand.isDrew
        ? "Building Science Roof Inspection"
        : brand.isRichard
        ? "Commercial TPO / Flat Roof Inspection"
        : "Free Roof Replacement Inspection")
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>("Morning (9:00 AM - 11:30 AM)");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>(initialAddress || "");
  const [notes, setNotes] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Dynamic Service Catalog per Brand
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

  // Next 7 available business days
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white shadow-2xl border-2 border-stone-300 z-10 overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="bg-zinc-950 text-white px-6 py-5 flex items-center justify-between border-b-2 border-crimson">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-crimson text-white text-[10px] font-oswald uppercase tracking-widest px-2 py-0.5 font-bold">
                  Priority Dispatch
                </span>
                <span className="text-zinc-400 text-xs font-serif">
                  {brand.licenseNumber || `Serving ${brand.city}`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-oswald uppercase tracking-wider font-bold text-white mt-1">
                Schedule Roof Inspection with {brand.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-2 transition-colors"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress */}
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

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Select Your Project Scope
                </h3>
                <p className="text-xs text-zinc-600 font-serif mt-0.5">
                  Choose the primary reason for your inspection. All initial inspections are 100% free with zero obligation.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
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
                          <span className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm">
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

              <div className="flex justify-end pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-6 py-3 font-oswald uppercase tracking-wider font-bold text-sm shadow-md transition-all"
                >
                  Continue to Date & Time <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Slot Selection */}
          {step === 2 && (
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Select Preferred Inspection Date & Window
                </h3>
                <p className="text-xs text-zinc-600 font-serif mt-0.5">
                  Select an available priority window. Our field manager will arrive with complete roof diagnostic equipment.
                </p>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-2">
                  1. Choose Date
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {dateOptions.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        className={`p-2.5 text-center border transition-all ${
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

              {/* Slot Selection */}
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-2">
                  2. Choose Arrival Window
                </label>
                <div className="space-y-2.5">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot.includes(slot.time);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                        className={`w-full text-left p-3.5 border transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-crimson bg-crimson/5 shadow-sm"
                            : "border-stone-200 hover:border-stone-400 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className={`w-4 h-4 ${isSelected ? "text-crimson" : "text-zinc-500"}`} />
                          <div>
                            <div className="font-oswald uppercase tracking-wider font-bold text-zinc-900 text-sm">
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

              <div className="flex justify-between items-center pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-oswald uppercase tracking-wider text-xs font-bold"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-6 py-3 font-oswald uppercase tracking-wider font-bold text-sm shadow-md transition-all"
                >
                  Continue to Contact Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Address Intake */}
          {step === 3 && (
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">
                  Property & Contact Information
                </h3>
                <p className="text-xs text-zinc-600 font-serif mt-0.5">
                  We need this to dispatch the field team to your address and send automated SMS arrival notifications.
                </p>
              </div>

              {/* Service & Time recap pill */}
              <div className="bg-stone-50 border border-stone-200 p-3 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-zinc-500 font-serif">Selected Scope:</span>{" "}
                  <strong className="text-zinc-900 font-oswald">{selectedService}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 font-serif">Date/Time:</span>{" "}
                  <strong className="text-crimson font-oswald">
                    {selectedDate} • {selectedSlot}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Robert Miller"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Mobile Phone (For SMS Tracking) *
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
                    placeholder="Street address, City, ZIP code"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                  Special Notes or Damage Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Active leak in master bedroom, insurance claim filed, two-story steep pitch..."
                  className="w-full p-2.5 bg-white border border-stone-300 text-sm font-serif text-zinc-900 focus:border-crimson focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-600 bg-amber-50 border border-amber-200 p-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  No credit card required. Free inspection, detailed photo report, and written scope estimate.
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-oswald uppercase tracking-wider text-xs font-bold"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3 font-oswald uppercase tracking-wider font-bold text-sm shadow-lg disabled:opacity-50 transition-all"
                >
                  {submitting ? "Reserving Slot..." : "Confirm & Lock Appointment"}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Instant Confirmation & ICS Calendar Download */}
          {step === 4 && (
            <div className="p-8 text-center space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <span className="text-xs font-oswald uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 border border-emerald-200">
                  Appointment Confirmed & Reserved
                </span>
                <h3 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
                  Inspection Locked in Master Dispatch
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Confirmation Code: <strong className="text-zinc-900">{confirmationCode}</strong>
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-zinc-500 font-serif">Assigned Contractor:</span>
                  <span className="font-bold text-zinc-900 font-oswald">{brand.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-zinc-500 font-serif">Service:</span>
                  <span className="font-bold text-zinc-900 font-oswald">{selectedService}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-zinc-500 font-serif">Reserved Date & Window:</span>
                  <span className="font-bold text-crimson font-oswald">
                    {selectedDate} ({selectedSlot})
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-zinc-500 font-serif">Property Address:</span>
                  <span className="font-bold text-zinc-900 font-oswald">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-serif">Dispatch Contact:</span>
                  <span className="font-bold text-zinc-900 font-oswald">{brand.phone}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-600 font-serif max-w-md mx-auto">
                An automated SMS and calendar invite has been queued for{" "}
                <strong className="text-zinc-900">{phone}</strong>. Our lead inspector will call 30
                minutes prior to arrival.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white px-5 py-2.5 font-oswald uppercase tracking-wider font-bold text-xs shadow-md"
                >
                  <Download className="w-4 h-4" /> Add to Apple / Google Calendar (.ics)
                </button>
                <a
                  href={`tel:${brand.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-5 py-2.5 font-oswald uppercase tracking-wider font-bold text-xs shadow-md"
                >
                  <Phone className="w-4 h-4" /> Call Dispatch Now: {brand.phone}
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-serif underline"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
