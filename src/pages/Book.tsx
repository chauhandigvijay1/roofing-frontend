import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "../BrandContext";
import AppleCalendarPicker from "../components/AppleCalendarPicker";
import {
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Download,
  ArrowRight,
  ChevronLeft,
  Search,
  Home,
  ShieldAlert,
  Building2,
  Wrench,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Book() {
  const brand = useBrand();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Dynamic services compilation from brand
  const dynamicServicesList = useMemo(() => {
    const list: Array<{ id: string; title: string; tag: string; icon: any }> = [];

    // Primary inspection option
    list.push({
      id: "inspection",
      title:
        brand.state === "FL"
          ? "Florida Wind Mitigation Inspection (Insurance Form)"
          : "Comprehensive 21-Point Roof & Attic Inspection",
      tag: "Free ($0)",
      icon: Search,
    });

    if (brand.structuredServices && brand.structuredServices.length > 0) {
      brand.structuredServices.forEach((s, idx) => {
        let icon = Home;
        let tag = "Free Estimate";
        const titleLower = s.title.toLowerCase();

        if (titleLower.includes("commercial") || titleLower.includes("tpo") || titleLower.includes("flat")) {
          icon = Building2;
          tag = "Commercial";
        } else if (titleLower.includes("repair") || titleLower.includes("leak") || titleLower.includes("emergency")) {
          icon = ShieldAlert;
          tag = "Rapid Dispatch";
        } else if (titleLower.includes("metal") || titleLower.includes("standing seam")) {
          icon = Wrench;
          tag = "Lifetime System";
        }

        list.push({
          id: `structured-${idx}`,
          title: s.title,
          tag,
          icon,
        });
      });
    } else {
      list.push(
        {
          id: "replacement",
          title: "Full Lifetime Architectural Shingle Replacement",
          tag: "Free Estimate",
          icon: Home,
        },
        {
          id: "repair",
          title: "Emergency Leak & Storm Damage Repair",
          tag: "Rapid Dispatch",
          icon: ShieldAlert,
        },
        {
          id: "commercial",
          title: "Commercial Flat / Single-Ply TPO Membrane",
          tag: "Commercial Scope",
          icon: Building2,
        }
      );
    }

    return list.slice(0, 4);
  }, [brand]);

  const [selectedService, setSelectedService] = useState<string>(() => {
    return brand.state === "FL"
      ? "Florida Wind Mitigation Inspection (Insurance Form)"
      : "Comprehensive 21-Point Roof & Attic Inspection";
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  const [selectedSlot, setSelectedSlot] = useState<string>("Morning (8:00 AM – 11:00 AM)");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const arrivalSlots = [
    {
      id: "morning",
      label: "Morning",
      time: "8:00 AM – 11:00 AM",
      desc: "First inspection of the day",
    },
    {
      id: "midday",
      label: "Midday",
      time: "11:00 AM – 2:00 PM",
      desc: "Peak daylight diagnostic",
    },
    {
      id: "afternoon",
      label: "Afternoon",
      time: "2:00 PM – 5:00 PM",
      desc: "Convenient late afternoon",
    },
    {
      id: "priority",
      label: "Priority Dispatch",
      time: "First Available Window",
      desc: "Urgent response window",
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const code = `${brand.state || "US"}-${Math.floor(100000 + Math.random() * 900000)}`;
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

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Minimal Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-crimson font-oswald uppercase tracking-wider font-bold mb-3 hover:underline"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-oswald uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-crimson" />
            <span>Zero Deposit • Free On-Site Inspection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-1">
            Schedule with {brand.name}
          </h1>
          <p className="text-sm text-zinc-600 font-serif mt-2 max-w-md mx-auto">
            Book your certified roof evaluation across {brand.city}. A licensed field specialist will inspect your roof and provide transparent written findings.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/90 overflow-hidden">
          {/* Stepper Line */}
          {step < 3 && (
            <div className="px-6 pt-5 pb-2 flex items-center gap-2">
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step >= 1 ? "bg-crimson" : "bg-zinc-200"
                }`}
              />
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step >= 2 ? "bg-crimson" : "bg-zinc-200"
                }`}
              />
            </div>
          )}

          {/* STEP 1: What & When */}
          {step === 1 && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Dynamic Service Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    1. Select Service Needed
                  </label>
                  <span className="text-xs text-zinc-500 font-serif">
                    100% Free written diagnostic
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dynamicServicesList.map((s) => {
                    const isSelected = selectedService === s.title;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.title)}
                        className={`text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "border-crimson bg-crimson/5 text-zinc-900 shadow-xs ring-1 ring-crimson"
                            : "border-stone-200 hover:border-stone-300 bg-white text-zinc-700"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? "bg-crimson text-white" : "bg-stone-100 text-zinc-600"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-oswald uppercase tracking-wider font-bold leading-snug">
                              {s.title}
                            </p>
                            <p className="text-xs text-zinc-500 font-sans mt-0.5">{s.tag}</p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected ? "border-crimson bg-crimson" : "border-stone-300"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apple-Style Clean Date Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900 block">
                      2. Choose Inspection Date
                    </label>
                    <p className="text-xs text-zinc-500 font-serif mt-0.5">
                      Selected: <strong className="text-crimson font-sans">{formattedSelectedDate}</strong>
                    </p>
                  </div>
                </div>

                <AppleCalendarPicker
                  selectedDate={selectedDate}
                  onSelectDate={(iso) => setSelectedDate(iso)}
                />
              </div>

              {/* Apple-Style Arrival Window */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                    3. Preferred Arrival Window
                  </label>
                  <span className="text-xs text-zinc-500 font-serif">
                    Technician contacts 30 mins prior
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {arrivalSlots.map((slot) => {
                    const isSelected = selectedSlot.includes(slot.label);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                        className={`p-3.5 text-left rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-crimson bg-crimson/5 text-zinc-900 shadow-2xs ring-1 ring-crimson"
                            : "border-stone-200 bg-white hover:border-stone-300 text-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-oswald uppercase tracking-wider font-bold">
                            {slot.label}
                          </span>
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? "text-crimson" : "text-zinc-400"}`} />
                        </div>
                        <p className="text-[11px] font-sans font-medium text-zinc-600 mt-1">
                          {slot.time}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-serif mt-0.5">
                          {slot.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-8 py-3.5 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Continue to Property Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Where & Contact */}
          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-5">
              {/* Selected Summary */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-100/90 border border-stone-200 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CalendarIcon className="w-4 h-4 text-crimson shrink-0" />
                  <div className="truncate">
                    <p className="font-oswald uppercase tracking-wider font-bold text-zinc-900 truncate">
                      {selectedService}
                    </p>
                    <p className="text-zinc-600 font-sans text-xs">
                      {formattedSelectedDate} • {selectedSlot}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-crimson font-oswald uppercase font-bold text-xs hover:underline shrink-0 ml-3 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Mobile Phone (For Arrival Text & Written Report) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Property Address in {brand.city} *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, City, ZIP code"
                      className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                    Specific Symptoms or Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ceiling drip, hail damage claim, 2-story roof..."
                    className="w-full px-3.5 py-3 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="text-xs text-zinc-600 font-serif text-center pt-1 flex items-center justify-center gap-1.5 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero deposit required • 100% Free written estimate • Direct field technician dispatch</span>
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
                  className="inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-8 py-3.5 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Confirming Appointment..." : "Lock Free Inspection ($0 Due)"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-oswald uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Inspection Confirmed
                </span>
                <h2 className="text-2xl sm:text-3xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
                  Appointment Reserved with {brand.name}
                </h2>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Reference Code: <strong className="text-zinc-900">{confirmationCode}</strong>
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-sm space-y-2.5 text-left max-w-md mx-auto font-serif">
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500">Scope:</span>
                  <strong className="text-zinc-900 font-oswald uppercase text-right max-w-[240px]">
                    {selectedService}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Date & Arrival:</span>
                  <strong className="text-crimson font-oswald text-right">
                    {formattedSelectedDate} • {selectedSlot}
                  </strong>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-zinc-500">Property:</span>
                  <strong className="text-zinc-900 font-oswald truncate max-w-[240px]">
                    {address}
                  </strong>
                </div>
                <div className="pt-2 border-t border-stone-200/80 text-xs text-emerald-700 flex items-center gap-1.5 font-sans font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Technician will call or text 30 minutes before arrival</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Add to Apple / Google Calendar (.ics)
                </button>
                <a
                  href={`tel:${brand.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full border border-stone-300 hover:border-stone-400 bg-white text-zinc-800 text-xs font-oswald uppercase tracking-wider font-bold transition-all"
                >
                  <Phone className="w-4 h-4 text-crimson" /> Call Office ({brand.phone})
                </a>
              </div>

              <div>
                <Link
                  to="/"
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-serif underline"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
