import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface AppleCalendarPickerProps {
  selectedDate: string; // ISO "YYYY-MM-DD"
  onSelectDate: (isoDate: string) => void;
  minDate?: string; // ISO "YYYY-MM-DD", default tomorrow
}

export default function AppleCalendarPicker({
  selectedDate,
  onSelectDate,
  minDate,
}: AppleCalendarPickerProps) {
  // Determine minimum selectable date (defaults to tomorrow)
  const defaultMin = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const effectiveMin = minDate || defaultMin;

  // View mode: "rapid" (10-day quick strip) vs "month" (full Apple interactive grid)
  const [viewMode, setViewMode] = useState<"rapid" | "month">("rapid");

  // Current viewed month in the calendar grid
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Rapid 10-day date options
  const rapidDates = useMemo(() => {
    const options = [];
    const base = new Date();
    for (let i = 1; i <= 10; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const weekday = i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      const dayNum = d.getDate();
      options.push({ iso, weekday, monthName, dayNum });
    }
    return options;
  }, []);

  // Compute calendar days for the currently viewed month
  const calendarGrid = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth(); // 0-indexed

    // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Previous month total days for padding
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNum: prevMonthDays - i,
        isCurrentMonth: false,
        iso: "",
        isSelectable: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const iso = `${year}-${mm}-${dd}`;
      const isSelectable = iso >= effectiveMin;
      days.push({
        dayNum: d,
        isCurrentMonth: true,
        iso,
        isSelectable,
      });
    }

    // Trailing days to round out 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dayNum: i,
        isCurrentMonth: false,
        iso: "",
        isSelectable: false,
      });
    }

    return days;
  }, [viewMonth, effectiveMin]);

  // Month navigation helpers
  const monthNameYear = useMemo(() => {
    return viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [viewMonth]);

  const canGoPrev = useMemo(() => {
    const now = new Date();
    const currentFirst = new Date(now.getFullYear(), now.getMonth(), 1);
    return viewMonth > currentFirst;
  }, [viewMonth]);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Quick preset jump
  const handleQuickPreset = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const iso = d.toISOString().split("T")[0];
    onSelectDate(iso);
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  return (
    <div className="space-y-3">
      {/* Top Bar: Selector Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
          <button
            type="button"
            onClick={() => setViewMode("rapid")}
            className={`px-3 py-1 rounded-lg text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer ${
              viewMode === "rapid"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Quick 10 Days
          </button>
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className={`px-3 py-1 rounded-lg text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "month"
                ? "bg-white text-crimson shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Apple Month View</span>
          </button>
        </div>

        {viewMode === "rapid" ? (
          <button
            type="button"
            onClick={() => setViewMode("month")}
            className="text-xs text-crimson font-oswald uppercase tracking-wider font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Pick Next Month / Any Date</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
                canGoPrev
                  ? "border-stone-200 hover:bg-stone-100 text-zinc-700 cursor-pointer"
                  : "border-stone-100 text-zinc-300 cursor-not-allowed opacity-40"
              }`}
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-oswald font-bold text-zinc-800 uppercase px-1">
              {monthNameYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg border border-stone-200 hover:bg-stone-100 text-zinc-700 flex items-center justify-center cursor-pointer transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: Rapid 10-Day Apple Strip */}
      {viewMode === "rapid" ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {rapidDates.map((opt) => {
            const isSelected = selectedDate === opt.iso;
            return (
              <button
                key={opt.iso}
                type="button"
                onClick={() => onSelectDate(opt.iso)}
                className={`py-3 px-3 rounded-2xl border text-center transition-all cursor-pointer min-w-[78px] flex flex-col items-center shrink-0 ${
                  isSelected
                    ? "border-crimson bg-crimson text-white shadow-sm ring-1 ring-crimson font-bold scale-102"
                    : "border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-zinc-700"
                }`}
              >
                <span
                  className={`text-[10px] font-oswald uppercase tracking-wider block ${
                    isSelected ? "text-white/80" : "text-zinc-500"
                  }`}
                >
                  {opt.weekday}
                </span>
                <span className="text-lg font-bold font-oswald mt-0.5 block">{opt.dayNum}</span>
                <span
                  className={`text-[10px] font-sans mt-0.5 block ${
                    isSelected ? "text-white/90" : "text-zinc-400"
                  }`}
                >
                  {opt.monthName}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* MODE 2: Full Apple Interactive Month Calendar Grid */
        <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm space-y-3">
          {/* Weekday Labels (Sun - Sat) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((dayName, idx) => (
              <span
                key={dayName}
                className={`text-[10px] font-oswald uppercase tracking-wider font-bold py-1 ${
                  idx === 0 || idx === 6 ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {dayName}
              </span>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`blank-${index}`}
                    className="h-10 sm:h-11 flex items-center justify-center text-xs text-zinc-300 font-sans select-none"
                  >
                    {item.dayNum}
                  </div>
                );
              }

              const isSelected = item.iso === selectedDate;
              const isSelectable = item.isSelectable;

              return (
                <button
                  key={item.iso}
                  type="button"
                  disabled={!isSelectable}
                  onClick={() => isSelectable && onSelectDate(item.iso)}
                  className={`h-10 sm:h-11 rounded-xl text-xs sm:text-sm font-oswald font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? "bg-crimson text-white shadow-md ring-2 ring-crimson scale-105"
                      : isSelectable
                      ? "hover:bg-crimson/10 hover:text-crimson text-zinc-800 bg-stone-50/70 border border-stone-200/60"
                      : "text-zinc-300 cursor-not-allowed opacity-35 bg-transparent"
                  }`}
                >
                  <span>{item.dayNum}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Jump Bar */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1.5 text-xs">
            <span className="text-[11px] font-serif text-zinc-500">Quick Presets:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickPreset(1)}
                className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-zinc-700 text-[11px] font-oswald uppercase cursor-pointer"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(7)}
                className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-zinc-700 text-[11px] font-oswald uppercase cursor-pointer"
              >
                +1 Week
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(14)}
                className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-zinc-700 text-[11px] font-oswald uppercase cursor-pointer"
              >
                +2 Weeks
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(30)}
                className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-zinc-700 text-[11px] font-oswald uppercase cursor-pointer"
              >
                +1 Month
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
