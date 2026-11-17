import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Calendar, Phone, Trash2 } from "lucide-react";
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  const handleDeleteMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearConversation = () => {
    setMessages([]);
    setWelcomeDismissed(false);
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
            className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] max-w-[420px] h-[550px] max-h-[calc(100dvh-2.5rem)] flex flex-col backdrop-blur-xl bg-white/95 border border-zinc-200/80 shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Mobile Drag / Swipe-Down Indicator */}
            <div
              onClick={() => setOpen(false)}
              className="w-10 h-1 bg-zinc-300 rounded-full mx-auto my-2 sm:hidden cursor-pointer hover:bg-zinc-400 transition-colors"
              title="Swipe or tap to close"
            />

            {/* Header: Unmistakable Close Pill & Clear Action */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-crimson text-white flex items-center justify-center shadow-md shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-zinc-950 font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm block truncate">
                    {brand.name ? `${brand.name} Assistant` : "Roofing Assistant"}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-serif block truncate">
                    {brand.licenseNumber || "24/7 Priority Concierge"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearConversation}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-oswald uppercase tracking-wider font-semibold transition-all cursor-pointer border border-zinc-200"
                    title="Clear conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}

                {/* High-Contrast, Unmistakable Close Pill */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-crimson hover:bg-crimson-dark text-white text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Close chat window"
                  title="Close chat window (Esc)"
                >
                  <span>Close</span>
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Scrollable Chat Area */}
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
                      onClick={() => setIsBookingOpen(true)}
                      className="inline-flex items-center gap-1 bg-crimson text-white px-2.5 py-1 rounded-full text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-xs hover:bg-crimson-dark cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" /> Book Online
                    </button>
                    <button
                      type="button"
                      onClick={() => sendMessage("What are your estimated roof replacement prices?")}
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
                  {/* Delete cross for user message (left of bubble) */}
                  {msg.role === "user" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(i)}
                      className="opacity-60 sm:opacity-0 group-hover:opacity-100 hover:bg-stone-200 text-zinc-400 hover:text-crimson p-1 rounded-full transition-all mt-1 cursor-pointer shrink-0"
                      title="Delete this question"
                      aria-label="Delete this question"
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
                      onBookClick={() => setIsBookingOpen(true)}
                    />
                  </div>

                  {/* Delete cross for assistant message (right of bubble) */}
                  {msg.role === "assistant" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(i)}
                      className="opacity-60 sm:opacity-0 group-hover:opacity-100 hover:bg-stone-200 text-zinc-400 hover:text-crimson p-1 rounded-full transition-all mt-1 cursor-pointer shrink-0"
                      title="Delete this message"
                      aria-label="Delete this message"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
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
                onClick={() => setIsBookingOpen(true)}
                title="Open Calendar Booking"
                className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-zinc-700 transition-colors cursor-pointer"
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
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-full bg-crimson hover:bg-crimson-dark text-white disabled:opacity-40 transition-all shadow-md cursor-pointer shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Toggle Button */}
      {!open && (
        <button
          onClick={handleToggle}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full bg-crimson text-white shadow-xl shadow-crimson/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open chat assistant"
          title="Chat with our roofing team"
        >
          <MessageCircle className="w-6 h-6" />
          {showDot && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      )}

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
