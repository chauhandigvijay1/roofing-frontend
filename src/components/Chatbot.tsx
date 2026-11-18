import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Calendar, Phone, Trash2, Calculator, ArrowLeft, Building2, Home } from "lucide-react";
import { useBrand } from "../BrandContext";
import FormattedMessage from "./FormattedMessage";
import BookingModal from "./BookingModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://roofing-backend-n688.onrender.com";

function BouncingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export default function Chatbot() {
  const brand = useBrand();
  const [open, setOpen] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"chat" | "calculator">("chat");

  // Calculator State inside Chatbot
  const [calcTrade, setCalcTrade] = useState<"residential" | "commercial">(
    brand.isCommercial ? "commercial" : "residential"
  );
  const [calcSqFt, setCalcSqFt] = useState<number>(brand.isCommercial ? 12000 : 2400);
  const [calcMaterial, setCalcMaterial] = useState<string>(
    brand.isCommercial ? "60-Mil TPO Membrane" : "Architectural Shingles (50-Yr)"
  );

  const warmedUp = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const initialMessage = brand.isCommercial
    ? `Do you need a free commercial flat roof or TPO evaluation in ${brand.city}?`
    : brand.state === "FL"
    ? `Do you need a free Florida wind mitigation or storm damage roof inspection in ${brand.city}?`
    : `Do you need a free 21-point roof inspection or storm estimate in ${brand.city}?`;

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) setShowDot(false);
  }, [open]);

  useEffect(() => {
    if (viewMode === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, viewMode]);

  // Keyboard shortcut: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const prewarm = useCallback(() => {
    if (warmedUp.current) return;
    warmedUp.current = true;
    fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "ping",
        history: [],
        brand: {
          name: brand.name,
          city: brand.city,
          state: brand.state,
          phone: brand.phone,
          email: brand.email,
          tagline: brand.tagline,
          aboutText: brand.aboutText,
          founderName: brand.founderName,
          founderTitle: brand.founderTitle,
          licenseNumber: brand.licenseNumber,
          isCommercial: brand.isCommercial,
          services: brand.services,
        },
      }),
    }).catch(() => {});
  }, [brand]);

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText !== undefined ? overrideText : input).trim();
    if (!text || loading) return;
    setInput("");

    // Quick booking intent shortcut
    const lower = text.toLowerCase();
    if (lower === "book now" || lower === "book" || lower === "schedule" || lower === "schedule now") {
      setBookingService(undefined);
      setIsBookingOpen(true);
    }

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          brand: {
            name: brand.name,
            city: brand.city,
            state: brand.state,
            phone: brand.phone,
            email: brand.email,
            tagline: brand.tagline,
            aboutText: brand.aboutText,
            founderName: brand.founderName,
            founderTitle: brand.founderTitle,
            licenseNumber: brand.licenseNumber,
            isCommercial: brand.isCommercial,
            services: brand.services,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages([
          ...updated,
          { role: "assistant", content: data.error || "Sorry, I'm having trouble connecting. Please try again." },
        ]);
      } else {
        const replyText = data.reply || data.message || "Thank you. Let's schedule your roof inspection.";
        setMessages([...updated, { role: "assistant", content: replyText }]);

        // If backend triggered 10-message handoff ceiling, open booking modal
        if (data.type === "CONVERSION_HANDOFF") {
          setTimeout(() => setIsBookingOpen(true), 800);
        }
      }
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setOpen(!open);
    if (!open) prewarm();
  };

  // When a user deletes a question, remove BOTH the user question and the following assistant reply
  const handleDeleteExchange = (userIndex: number) => {
    setMessages((prev) => {
      if (prev[userIndex + 1] && prev[userIndex + 1].role === "assistant") {
        return prev.filter((_, idx) => idx !== userIndex && idx !== userIndex + 1);
      }
      return prev.filter((_, idx) => idx !== userIndex);
    });
  };

  const handleClearConversation = () => {
    setMessages([]);
    setWelcomeDismissed(false);
  };

  // Calculator price calculation
  const calcEstimate = useMemo(() => {
    if (calcMaterial.includes("Repair")) {
      return { low: 450, high: 1450, isFlat: true };
    }
    const rates: Record<string, number> = {
      "Architectural Shingles (50-Yr)": 4.8,
      "Class 4 Impact Hail Resistant": 5.8,
      "Standing Seam Metal": 7.8,
      "60-Mil TPO Membrane": 5.2,
      "Silicone Liquid Coating": 4.2,
      "Modified Bitumen System": 6.2,
    };
    const rate = rates[calcMaterial] || 5.0;
    const base = calcSqFt * rate;
    const low = Math.round(base * 0.95);
    const high = Math.round(base * 1.22);
    return { low, high, isFlat: false };
  }, [calcMaterial, calcSqFt]);

  const handleAskAboutEstimate = () => {
    const prompt = `I used your calculator for a ${calcSqFt.toLocaleString()} sq ft roof with ${calcMaterial} (estimated at $${calcEstimate.low.toLocaleString()} - $${calcEstimate.high.toLocaleString()}). What warranty and installation timeframe do you provide for this in ${brand.city}?`;
    setViewMode("chat");
    sendMessage(prompt);
  };

  const handleBookEstimate = () => {
    setBookingService(`${calcMaterial} (${calcSqFt.toLocaleString()} sq ft)`);
    setIsBookingOpen(true);
  };

  return (
    <>
      {/* Tap Outside Backdrop on Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] max-w-[430px] h-[560px] max-h-[calc(100dvh-2.5rem)] flex flex-col backdrop-blur-xl bg-white/95 border border-zinc-200/80 shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Mobile Drag / Swipe-Down Indicator */}
            <div
              onClick={() => setOpen(false)}
              className="w-10 h-1 bg-zinc-300 rounded-full mx-auto my-2 sm:hidden cursor-pointer hover:bg-zinc-400 transition-colors"
              title="Swipe or tap to close"
            />

            {/* Header: Assistant Info & Controls */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center shadow-md shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-zinc-950 font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm block truncate">
                    {brand.name ? `${brand.name} Assistant` : "Roofing Assistant"}
                  </span>
                  <span className="text-xs text-zinc-500 font-sans block">
                    {brand.licenseNumber ? `License: ${brand.licenseNumber}` : `Serving ${brand.city}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Mode Toggle: Calculator vs Chat */}
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "chat" ? "calculator" : "chat")}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                    viewMode === "calculator"
                      ? "bg-crimson text-white border-crimson shadow-xs"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200"
                  }`}
                  title="Toggle Instant Estimator"
                  aria-label="Toggle Instant Estimator"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{viewMode === "calculator" ? "Chat" : "Estimate"}</span>
                </button>

                {viewMode === "chat" && messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearConversation}
                    className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all cursor-pointer border border-zinc-200"
                    title="Clear conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* High-Contrast Close Button */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer border border-zinc-200"
                  aria-label="Close chat window"
                  title="Close chat window (Esc)"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: Interactive Quick Estimate Calculator */}
            {viewMode === "calculator" ? (
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-oswald uppercase tracking-wider font-bold text-zinc-800 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-crimson" />
                    Instant Roof Cost Calculator
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode("chat")}
                    className="text-[11px] text-crimson font-oswald uppercase font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Chat
                  </button>
                </div>

                {/* Trade Switcher */}
                <div className="grid grid-cols-2 gap-1.5 bg-stone-200/80 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTrade("residential");
                      setCalcSqFt(2400);
                      setCalcMaterial("Architectural Shingles (50-Yr)");
                    }}
                    className={`py-1.5 text-xs font-oswald uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      calcTrade === "residential"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" /> Residential
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTrade("commercial");
                      setCalcSqFt(12000);
                      setCalcMaterial("60-Mil TPO Membrane");
                    }}
                    className={`py-1.5 text-xs font-oswald uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      calcTrade === "commercial"
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Commercial
                  </button>
                </div>

                {/* Material Selection */}
                <div>
                  <label className="block text-[11px] font-oswald uppercase tracking-wider font-bold text-zinc-700 mb-1.5">
                    Roof Material System
                  </label>
                  <div className="space-y-1.5">
                    {(calcTrade === "residential"
                      ? [
                          "Architectural Shingles (50-Yr)",
                          "Class 4 Impact Hail Resistant",
                          "Standing Seam Metal",
                          "Emergency Leak Repair & Tarp",
                        ]
                      : [
                          "60-Mil TPO Membrane",
                          "Silicone Liquid Coating",
                          "Modified Bitumen System",
                        ]
                    ).map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setCalcMaterial(mat)}
                        className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-serif transition-all flex items-center justify-between cursor-pointer ${
                          calcMaterial === mat
                            ? "border-crimson bg-crimson/5 text-zinc-900 font-medium ring-1 ring-crimson"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                        }`}
                      >
                        <span>{mat}</span>
                        {calcMaterial === mat && <span className="w-2 h-2 rounded-full bg-crimson" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Square Footage Slider (hidden if repair) */}
                {!calcMaterial.includes("Repair") && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-oswald uppercase tracking-wider font-bold text-zinc-700">
                        Estimated Area
                      </span>
                      <span className="font-oswald uppercase font-bold text-crimson text-sm">
                        {calcSqFt.toLocaleString()} sq. ft.
                      </span>
                    </div>
                    <input
                      type="range"
                      min={calcTrade === "residential" ? 1200 : 5000}
                      max={calcTrade === "residential" ? 5500 : 45000}
                      step={calcTrade === "residential" ? 50 : 500}
                      value={calcSqFt}
                      onChange={(e) => setCalcSqFt(Number(e.target.value))}
                      className="w-full accent-crimson cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                      <span>{calcTrade === "residential" ? "1,200 sq ft" : "5,000 sq ft"}</span>
                      <span>{calcTrade === "residential" ? "5,500 sq ft" : "45,000 sq ft"}</span>
                    </div>
                  </div>
                )}

                {/* Dynamic Calculated Price Card */}
                <div className="bg-white border-2 border-crimson/30 rounded-2xl p-4 text-center shadow-xs">
                  <span className="text-xs font-oswald uppercase tracking-widest text-zinc-500 font-bold block">
                    Estimated Investment Range
                  </span>
                  <div className="text-2xl font-oswald uppercase tracking-wider font-bold text-zinc-950 mt-1">
                    ${calcEstimate.low.toLocaleString()} – ${calcEstimate.high.toLocaleString()}
                  </div>
                  <p className="text-xs text-zinc-600 font-serif leading-relaxed mt-1">
                    {calcEstimate.isFlat
                      ? "Flat dispatch rate for leak containment & temporary seal"
                      : `Based on ~${calcSqFt.toLocaleString()} sq ft • Free on-site measurement confirms final quote`}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleBookEstimate}
                    className="w-full inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-white py-2.5 px-4 rounded-xl font-oswald uppercase tracking-wider font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Inspection for This Estimate
                  </button>
                  <button
                    type="button"
                    onClick={handleAskAboutEstimate}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-white border border-stone-300 hover:border-stone-400 text-zinc-800 py-2 px-4 rounded-xl font-oswald uppercase tracking-wider font-bold text-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-crimson" /> Ask Assistant About This Price
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW MODE 2: Normal Scrollable Chat Area */
              <>
                <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-3.5 bg-stone-50/50">
                  {messages.length === 0 && !welcomeDismissed && (
                    <div className="relative bg-white/90 border border-zinc-200/90 rounded-2xl p-4 text-sm text-zinc-800 font-serif shadow-xs">
                      <button
                        type="button"
                        onClick={() => setWelcomeDismissed(true)}
                        className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-zinc-700 p-1 transition-colors cursor-pointer"
                        title="Dismiss greeting"
                        aria-label="Dismiss greeting"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <p className="font-medium pr-6 text-zinc-900">{initialMessage}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingService(undefined);
                            setIsBookingOpen(true);
                          }}
                          className="inline-flex items-center gap-1 bg-crimson text-white px-2.5 py-1 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs hover:bg-crimson-dark cursor-pointer"
                        >
                          <Calendar className="w-3 h-3" /> Book Online
                        </button>
                        <button
                          type="button"
                          onClick={() => sendMessage("What are your estimated roof replacement prices in " + brand.city + "?")}
                          className="inline-flex items-center gap-1 bg-white border border-stone-300 hover:border-stone-400 text-zinc-800 px-2.5 py-1 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Pricing Guide
                        </button>
                        <a
                          href={`tel:${brand.phone}`}
                          className="inline-flex items-center gap-1 bg-white border border-stone-300 hover:border-stone-400 text-zinc-800 px-2.5 py-1 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      </div>
                    </div>
                  )}

                  {messages.length === 0 && welcomeDismissed && (
                    <div className="text-center py-10 px-4 text-xs text-zinc-400 font-serif">
                      <p>Conversation reset.</p>
                      <button
                        type="button"
                        onClick={() => setWelcomeDismissed(false)}
                        className="mt-2 text-crimson font-oswald uppercase tracking-wider font-bold hover:underline cursor-pointer"
                      >
                        Show welcome options
                      </button>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={`msg-${i}`}
                      className={`group relative flex items-start gap-1.5 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Delete cross ONLY for user question: removes BOTH the question and its bot reply! */}
                      {msg.role === "user" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteExchange(i)}
                          className="opacity-60 sm:opacity-0 group-hover:opacity-100 hover:bg-stone-200 text-zinc-400 hover:text-crimson p-1 rounded-full transition-all mt-1 cursor-pointer shrink-0"
                          title="Delete this question & answer"
                          aria-label="Delete this question & answer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div
                        className={`relative max-w-[85%] px-4 py-3 text-sm leading-relaxed font-serif break-words shadow-xs rounded-2xl ${
                          msg.role === "user"
                            ? "bg-crimson text-white shadow-md font-sans rounded-br-xs"
                            : "bg-white text-zinc-850 border border-zinc-200/90 rounded-bl-xs"
                        }`}
                      >
                        <FormattedMessage
                          content={msg.content}
                          isUser={msg.role === "user"}
                          onBookClick={() => {
                            setBookingService(undefined);
                            setIsBookingOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-zinc-200 px-4 py-3 text-sm text-zinc-500 font-serif shadow-xs rounded-2xl">
                        <BouncingDots />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input Bar */}
                <div className="shrink-0 flex items-center gap-2 px-3.5 py-3 border-t border-zinc-200 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingService(undefined);
                      setIsBookingOpen(true);
                    }}
                    title="Open Calendar Booking"
                    className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-zinc-700 transition-colors cursor-pointer"
                    aria-label="Open Calendar Booking"
                  >
                    <Calendar className="w-4 h-4 text-crimson" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask a question or type 'Book'..."
                    className="flex-1 bg-stone-100/70 border border-zinc-200 rounded-full px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-crimson focus:bg-white transition-colors font-serif"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="p-2 rounded-full bg-crimson hover:bg-crimson-dark text-white disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-crimson hover:bg-crimson-dark text-white px-5 py-3.5 rounded-full shadow-2xl font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
          aria-label="Open roofing assistant"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            {showDot && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-crimson" />
            )}
          </div>
          <span>{brand.name ? `${brand.name} Concierge` : "Chat & Estimate"}</span>
        </motion.button>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={bookingService}
      />
    </>
  );
}
