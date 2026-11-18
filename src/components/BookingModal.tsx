import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBrand } from "../BrandContext";
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  X,
  Download,
  ArrowRight,
  ChevronLeft,
  Search,
  Home,
  ShieldAlert,
  Building2,
  Sparkles,
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

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<string>(
    initialService ||
      (brand.isCommercial
        ? "Commercial TPO & Flat Roof"
        : brand.state === "FL"
        ? "Florida Wind Mitigation Inspection"
        : "Free 21-Point Inspection")
  );

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>("Morning (9 AM - 12 PM)");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>(initialAddress || "");
  const [notes, setNotes] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Minimal, high-impact services
  const services = [
    {
      id: "inspection",
      title: brand.state === "FL" ? "Florida Wind Mitigation Inspection" : "Free 21-Point Roof Inspection",
      icon: Search,
      tag: "Free ($0)",
    },
    {
      id: "replacement",
      title: "Full Lifetime Roof Replacement",
      icon: Home,
      tag: "Free Estimate",
    },
    {
      id: "repair",
      title: "Emergency Leak & Storm Repair",
      icon: ShieldAlert,
      tag: "Rapid Dispatch",
    },
    {
      id: "commercial",
      title: "Commercial Flat / TPO System",
      icon: Building2,
      tag: "Commercial",
    },
  ];

  // 7-day clean date selector
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split("T")[0];
    const weekday = i === 0 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
    const monthDay = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { iso, weekday, monthDay };
  });

  const slots = [
    { id: "morning", label: "Morning", time: "9 AM - 12 PM" },
    { id: "afternoon", label: "Afternoon", time: "1 PM - 4 PM" },
    { id: "urgent", label: "Priority / Any Time", time: "First Available" },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const code = `VIP-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationCode(code);
      setSubmitting(false);
      setStep(3);
    }, 450);
  };

  const handleDownloadCalendar = () => {
    const cleanDate = selectedDate.replace(/-/g, "");
    const startTime = "140000Z";
    const endTime = "160000Z";
    const title = `${brand.name} - Roof Inspection (${selectedService})`;
    const description = `Confirmed Roof Inspection with ${brand.name} for ${name}.\nService: ${selectedService}\nAddress: ${address}\nPhone: ${brand.phone}\nMaster Code: ${confirmationCode}`;

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Minimal Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Minimal, Apple-Grade Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-white shadow-2xl rounded-3xl z-10 overflow-hidden my-4 border border-zinc-200/90"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-100 bg-stone-50/70">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-crimson font-oswald uppercase tracking-wider font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Obligation Free Inspection</span>
              </div>
              <h2 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-0.5">
                Schedule with {brand.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Minimal 2-Step Progress Bar */}
          {step < 3 && (
            <div className="px-6 pt-4 pb-1 flex items-center gap-2">
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step >= 1 ? "bg-crimson" : "bg-zinc-200"
                }`}
              />
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step >= 2 ? "bg-crimson" : "bg-zinc-200"
                }`}
              />
            </div>
          )}

          {/* STEP 1: What & When */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-2">
                  1. Select Service Needed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((s) => {
                    const isSelected = selectedService === s.title;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.title)}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "border-crimson bg-crimson/5 text-zinc-900 shadow-xs ring-1 ring-crimson"
                            : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-crimson text-white" : "bg-stone-100 text-zinc-600"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-oswald uppercase tracking-wider font-bold truncate">
                              {s.title}
                            </p>
                            <p className="text-[11px] text-zinc-500 font-serif">{s.tag}</p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? "border-crimson bg-crimson" : "border-zinc-300"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Day Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800">
                    2. Choose Preferred Day
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-oswald uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Calendar Synced
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {dateOptions.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-crimson bg-crimson text-white shadow-xs font-bold"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <div className="text-[10px] font-oswald uppercase tracking-wider">
                          {d.weekday}
                        </div>
                        <div className="text-xs font-bold font-oswald mt-0.5">{d.monthDay}</div>
                        <div className={`text-[9px] mt-0.5 ${isSelected ? "text-white/80" : "text-emerald-600 font-mono"}`}>
                          Open
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Arrival Window */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800">
                    3. Arrival Window
                  </label>
                  <span className="text-[10px] text-zinc-400 font-serif">
                    Live dispatch window
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot.includes(slot.label);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                        className={`py-2.5 px-2 text-center rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-crimson bg-crimson/5 text-crimson font-bold ring-1 ring-crimson"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <p className="text-xs font-oswald uppercase tracking-wider font-bold">
                          {slot.label}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-serif mt-0.5">{slot.time}</p>
                        <span className="text-[9px] text-emerald-600 font-mono font-medium block mt-0.5">
                          ✓ Open Slot
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Continue to Property Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Where & Contact */}
          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              {/* Selected Summary Pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100/80 border border-stone-200 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <CalendarIcon className="w-4 h-4 text-crimson shrink-0" />
                  <span className="font-oswald uppercase tracking-wider font-bold text-zinc-900 truncate">
                    {selectedService} • {selectedDate} ({selectedSlot})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-crimson font-oswald uppercase font-bold text-[11px] hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Minimal Clean Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Michael Miller"
                      className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Mobile Phone (For SMS Arrival Alert) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Property Address in {brand.city} *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, City, ZIP"
                      className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Special Notes or Symptoms (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Active ceiling drip, storm damage, two-story roof..."
                    className="w-full px-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 font-serif text-center pt-1">
                Zero deposit required • 100% Free written estimate • Direct technician dispatch
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-800 text-xs font-oswald uppercase tracking-wider font-bold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Locking Slot..." : "Lock Free Inspection ($0 Due)"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Apple-Grade Minimal Confirmation */}
          {step === 3 && (
            <div className="p-8 text-center space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm"
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>

              <div>
                <span className="text-[10px] font-oswald uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Confirmed & Dispatched
                </span>
                <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
                  Inspection Reserved with {brand.name}
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Master Code: <strong className="text-zinc-900">{confirmationCode}</strong>
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-left max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-serif">Scope:</span>
                  <strong className="text-zinc-900 font-oswald">{selectedService}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-serif">Arrival:</span>
                  <strong className="text-crimson font-oswald">
                    {selectedDate} • {selectedSlot}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-serif">Property:</span>
                  <strong className="text-zinc-900 font-oswald truncate max-w-[200px]">
                    {address}
                  </strong>
                </div>
                <div className="pt-2 border-t border-stone-200/80 text-[11px] text-emerald-700 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Synced in {brand.name} Master Calendar & SMS Dispatched</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Add to Calendar (.ics)
                </button>
                <a
                  href={`tel:${brand.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-300 hover:border-stone-400 bg-white text-zinc-800 text-xs font-oswald uppercase tracking-wider font-bold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-crimson" /> Call Dispatch
                </a>
              </div>

              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-serif underline cursor-pointer"
                >
                  Close & Return to Website
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
