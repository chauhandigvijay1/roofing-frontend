import { useState, useMemo } from "react";
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
  ChevronRight,
  Search,
  Home,
  ShieldAlert,
  Building2,
  Wrench,
  Clock,
  Sparkles,
  ShieldCheck,
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

  // Dynamic services compilation from brand
  const dynamicServicesList = useMemo(() => {
    const list: Array<{ id: string; title: string; tag: string; icon: any }> = [];

    // Add initialService at top if it was passed from wizard or service detail
    if (initialService) {
      list.push({
        id: "initial-custom",
        title: initialService,
        tag: "Selected Scope",
        icon: Sparkles,
      });
    }

    // Default primary inspection option
    const primaryInspection = {
      id: "inspection",
      title:
        brand.state === "FL"
          ? "Florida Wind Mitigation Inspection (Insurance Form)"
          : "Comprehensive 21-Point Roof & Attic Inspection",
      tag: "Free ($0)",
      icon: Search,
    };
    if (!initialService || !initialService.toLowerCase().includes("inspection")) {
      list.push(primaryInspection);
    }

    // Pull from brand.structuredServices or brand.services if available
    if (brand.structuredServices && brand.structuredServices.length > 0) {
      brand.structuredServices.forEach((s, idx) => {
        // Skip duplicate of initialService or primary inspection
        if (
          initialService &&
          s.title.toLowerCase().trim() === initialService.toLowerCase().trim()
        ) {
          return;
        }
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
    } else if (brand.services && brand.services.length > 0) {
      brand.services.forEach((s, idx) => {
        if (
          initialService &&
          s.toLowerCase().trim() === initialService.toLowerCase().trim()
        ) {
          return;
        }
        let icon = Home;
        let tag = "Free Estimate";
        const titleLower = s.toLowerCase();
        if (titleLower.includes("commercial") || titleLower.includes("tpo")) {
          icon = Building2;
          tag = "Commercial";
        } else if (titleLower.includes("repair") || titleLower.includes("leak")) {
          icon = ShieldAlert;
          tag = "Rapid Dispatch";
        }
        list.push({
          id: `service-${idx}`,
          title: s,
          tag,
          icon,
        });
      });
    } else {
      // Clean fallback
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

    // Limit to max 6 clean options so modal stays elegant
    return list.slice(0, 6);
  }, [brand, initialService]);

  const [selectedService, setSelectedService] = useState<string>(() => {
    if (initialService) return initialService;
    return brand.state === "FL"
      ? "Florida Wind Mitigation Inspection (Insurance Form)"
      : "Comprehensive 21-Point Roof & Attic Inspection";
  });

  // Apple Calendar Date-Picker State
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Currently viewed month (starts at current month)
  const [viewMonthDate, setViewMonthDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Selected date ISO string (default: tomorrow)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  const [selectedSlot, setSelectedSlot] = useState<string>("Morning (8:00 AM – 11:00 AM)");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>(initialAddress || "");
  const [notes, setNotes] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewMonthDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      if (next < currentMonthStart) return prev;
      return next;
    });
  };

  const handleNextMonth = () => {
    setViewMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isCurrentMonth = useMemo(() => {
    return (
      viewMonthDate.getFullYear() === today.getFullYear() &&
      viewMonthDate.getMonth() === today.getMonth()
    );
  }, [viewMonthDate, today]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const year = viewMonthDate.getFullYear();
    const month = viewMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dayNum: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isPast: boolean;
      isToday: boolean;
    }> = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const iso = prevDate.toISOString().split("T")[0];
      cells.push({
        dayNum,
        dateStr: iso,
        isCurrentMonth: false,
        isPast: true,
        isToday: false,
      });
    }

    // Days of current view month
    for (let d = 1; d <= daysInMonth; d++) {
      const currentCellDate = new Date(year, month, d);
      currentCellDate.setHours(0, 0, 0, 0);
      const iso = currentCellDate.toISOString().split("T")[0];
      const isPast = currentCellDate < today;
      const isTodayCell = currentCellDate.getTime() === today.getTime();

      cells.push({
        dayNum: d,
        dateStr: iso,
        isCurrentMonth: true,
        isPast,
        isToday: isTodayCell,
      });
    }

    // Fill remaining days of last week from next month to reach full rows
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const remaining = totalCells - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const iso = nextDate.toISOString().split("T")[0];
      cells.push({
        dayNum: i,
        dateStr: iso,
        isCurrentMonth: false,
        isPast: false,
        isToday: false,
      });
    }

    return cells;
  }, [viewMonthDate, today]);

  // Formatted date string for human display
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

  // Clean Arrival Windows (Apple-style)
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Soft Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Apple-Grade Minimalist Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 14 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl z-10 overflow-hidden my-4 border border-zinc-200/90 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-zinc-100 bg-stone-50/70 shrink-0">
            <div>
              <p className="text-xs text-zinc-500 font-sans tracking-tight">
                {step === 1 && "Step 1 of 2: Scope & Date Selection"}
                {step === 2 && "Step 2 of 2: Property & Contact Details"}
                {step === 3 && "Inspection Confirmed"}
              </p>
              <h2 className="text-xl sm:text-2xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-0.5">
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

          {/* Stepper Line */}
          {step < 3 && (
            <div className="px-6 pt-3 pb-1 flex items-center gap-2 shrink-0">
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

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto flex-1">
            {/* STEP 1: Service & Apple Calendar */}
            {step === 1 && (
              <div className="p-6 space-y-6">
                {/* 1. Dynamic Services Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                      1. Select Service Needed
                    </label>
                    <span className="text-[11px] text-zinc-500 font-serif">
                      100% Free written diagnostic
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dynamicServicesList.map((s) => {
                      const isSelected = selectedService === s.title;
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedService(s.title)}
                          className={`text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? "border-crimson bg-crimson/5 text-zinc-900 shadow-xs ring-1 ring-crimson"
                              : "border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? "bg-crimson text-white" : "bg-stone-100 text-zinc-600"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-oswald uppercase tracking-wider font-bold leading-snug">
                                {s.title}
                              </p>
                              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">
                                {s.tag}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
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

                {/* 2. Apple-Style Calendar Date-Picker */}
                <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900 block">
                        2. Choose Preferred Inspection Date
                      </label>
                      <p className="text-xs text-zinc-500 font-serif mt-0.5">
                        {formattedSelectedDate ? formattedSelectedDate : "Select any available date"}
                      </p>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isCurrentMonth}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isCurrentMonth
                            ? "text-zinc-300 cursor-not-allowed"
                            : "text-zinc-700 hover:bg-stone-100 cursor-pointer"
                        }`}
                        title="Previous Month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900 px-2 min-w-[100px] text-center">
                        {viewMonthDate.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Next Month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div
                        key={d}
                        className="text-[11px] font-sans font-semibold text-zinc-400 py-1"
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days Matrix */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, idx) => {
                      const isSelected = selectedDate === cell.dateStr;
                      const isDisabled = cell.isPast || !cell.isCurrentMonth;

                      return (
                        <button
                          key={`${cell.dateStr}-${idx}`}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => !isDisabled && setSelectedDate(cell.dateStr)}
                          className={`relative h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-sans flex flex-col items-center justify-center transition-all ${
                            isDisabled
                              ? "text-zinc-300 cursor-not-allowed bg-transparent"
                              : isSelected
                              ? "bg-crimson text-white font-bold shadow-sm"
                              : cell.isToday
                              ? "bg-stone-200/80 text-zinc-900 font-bold hover:bg-stone-300/80 cursor-pointer"
                              : "bg-white text-zinc-800 hover:bg-stone-200/60 border border-stone-200/50 cursor-pointer"
                          }`}
                        >
                          <span>{cell.dayNum}</span>
                          {cell.isToday && !isSelected && (
                            <span className="w-1 h-1 rounded-full bg-crimson absolute bottom-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Fast Selector Shortcut */}
                  <div className="mt-3 pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-serif">Quick options:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          setSelectedDate(d.toISOString().split("T")[0]);
                          setViewMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
                        }}
                        className="text-crimson font-oswald uppercase font-bold text-[11px] hover:underline cursor-pointer"
                      >
                        Tomorrow
                      </button>
                      <span className="text-zinc-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 2);
                          setSelectedDate(d.toISOString().split("T")[0]);
                          setViewMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
                        }}
                        className="text-crimson font-oswald uppercase font-bold text-[11px] hover:underline cursor-pointer"
                      >
                        In 2 Days
                      </button>
                      <span className="text-zinc-300">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setSelectedDate(d.toISOString().split("T")[0]);
                          setViewMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
                        }}
                        className="text-crimson font-oswald uppercase font-bold text-[11px] hover:underline cursor-pointer"
                      >
                        Next Week
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Apple-Style Arrival Window */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-900">
                      3. Preferred Arrival Window
                    </label>
                    <span className="text-xs text-zinc-500 font-serif">
                      Technician contacts 30 mins prior
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {arrivalSlots.map((slot) => {
                      const isSelected = selectedSlot.includes(slot.label);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                          className={`p-3 text-left rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-crimson bg-crimson/5 text-zinc-900 shadow-2xs ring-1 ring-crimson"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
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
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <CalendarIcon className="w-4 h-4 text-crimson shrink-0" />
                    <div className="truncate">
                      <p className="font-oswald uppercase tracking-wider font-bold text-zinc-900 truncate">
                        {selectedService}
                      </p>
                      <p className="text-zinc-600 font-sans text-[11px]">
                        {formattedSelectedDate} • {selectedSlot}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-crimson font-oswald uppercase font-bold text-[11px] hover:underline shrink-0 ml-3 cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* Apple-Style Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. David Miller"
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 mb-1">
                      Mobile Phone (For Arrival Text & Written Report) *
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
                        placeholder="Street address, City, ZIP code"
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
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
                      placeholder="e.g. Active ceiling drip, storm claim, two-story roof..."
                      className="w-full px-3 py-2.5 bg-stone-50 border border-zinc-200 rounded-xl text-sm font-serif text-zinc-900 focus:bg-white focus:border-crimson focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="text-xs text-zinc-600 font-serif text-center pt-1 leading-relaxed flex items-center justify-center gap-1.5">
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
                    className="inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white px-7 py-3 rounded-full font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Confirming Appointment..." : "Lock Free Inspection ($0 Due)"}
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
                  <span className="text-xs font-oswald uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Inspection Confirmed
                  </span>
                  <h3 className="text-2xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
                    Appointment Reserved with {brand.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-1">
                    Reference Code: <strong className="text-zinc-900">{confirmationCode}</strong>
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2.5 text-left max-w-md mx-auto">
                  <div className="flex justify-between items-start">
                    <span className="text-zinc-500 font-serif">Scope:</span>
                    <strong className="text-zinc-900 font-oswald uppercase text-right max-w-[240px]">
                      {selectedService}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-serif">Date & Arrival:</span>
                    <strong className="text-crimson font-oswald text-right">
                      {formattedSelectedDate} • {selectedSlot}
                    </strong>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-zinc-500 font-serif">Property:</span>
                    <strong className="text-zinc-900 font-oswald truncate max-w-[240px]">
                      {address}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-stone-200/80 text-xs text-emerald-700 flex items-center gap-1.5 font-sans font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Technician will call or text 30 minutes before arrival</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadCalendar}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-black text-white text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Add to Apple / Google Calendar (.ics)
                  </button>
                  <a
                    href={`tel:${brand.phone}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-stone-300 hover:border-stone-400 bg-white text-zinc-800 text-xs font-oswald uppercase tracking-wider font-bold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-crimson" /> Call Office ({brand.phone})
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
