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

  const initialMessage = brand.isDrew
    ? "Do you need a free building science roof inspection in Austin?"
    : brand.isRichard
    ? "Do you need a free Houston residential or commercial roof inspection?"
    : brand.isJim
    ? "Do you need a free Florida wind mitigation or storm damage roof inspection in Jacksonville?"
    : "Do you need a free roof inspection?";

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
          phone: brand.phone,
          email: brand.email,
          isDrew: brand.isDrew,
          isRichard: brand.isRichard,
          isJim: brand.isJim,
        },
      }),
    }).catch(() => {});
  }, [brand]);

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText !== undefined ? overrideText : input).trim();
    if (!text || loading) return;
    setInput("");

    // Quick booking intent shortcut: if user literally commands "book now", open modal as well
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
            phone: brand.phone,
            email: brand.email,
            isDrew: brand.isDrew,
            isRichard: brand.isRichard,
            isJim: brand.isJim,
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
        setMessages([...updated, { role: "assistant", content: data.reply }]);
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
      {/* Mobile Backdrop for Tap-Outside-to-Close */}
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
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[420px] h-[540px] max-h-[calc(100dvh-2.5rem)] flex flex-col bg-white shadow-2xl border-2 border-stone-300 overflow-hidden"
          >
            {/* Header with High-Visibility Close Button & Clear Button */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-800 bg-zinc-950 text-white">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                <div className="w-9 h-9 bg-crimson flex items-center justify-center shadow-md shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <span className="text-white font-oswald uppercase tracking-wider font-bold text-xs sm:text-sm block truncate">
                    {brand.name ? `${brand.name} Assistant` : "Roofing Assistant"}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-serif block truncate">
                    {brand.licenseNumber || "24/7 Verified Dispatch"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearConversation}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-oswald uppercase tracking-wider font-semibold transition-all cursor-pointer border border-zinc-700"
                    title="Clear entire conversation"
                    aria-label="Clear entire conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}

                {/* HIGH-VISIBILITY UNMISTAKABLE CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded bg-crimson hover:bg-crimson-dark text-white text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer border border-red-500/30"
                  aria-label="Close chat window"
                  title="Close chat window (Esc)"
                >
                  <span>Close</span>
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Scrollable Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-stone-50/50">
              {messages.length === 0 && !welcomeDismissed && (
                <div className="relative bg-crimson/5 border border-crimson/20 p-4 text-sm text-crimson font-serif">
                  <button
                    type="button"
                    onClick={() => setWelcomeDismissed(true)}
                    className="absolute top-2 right-2 text-crimson/50 hover:text-crimson p-1 transition-colors cursor-pointer"
                    title="Dismiss greeting"
                    aria-label="Dismiss greeting"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="font-medium pr-6">{initialMessage}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-crimson/15">
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(true)}
                      className="inline-flex items-center gap-1 bg-crimson text-white px-2.5 py-1 text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-sm hover:bg-crimson-dark cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" /> Book Online
                    </button>
                    <button
                      type="button"
                      onClick={() => sendMessage("What are your estimated roof replacement prices?")}
                      className="inline-flex items-center gap-1 bg-white border border-stone-300 hover:border-stone-400 text-zinc-800 px-2.5 py-1 text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Pricing Guide
                    </button>
                    <a
                      href={`tel:${brand.phone}`}
                      className="inline-flex items-center gap-1 bg-white border border-stone-300 hover:border-stone-400 text-zinc-800 px-2.5 py-1 text-xs font-oswald uppercase tracking-wider font-bold transition-all shadow-sm"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>
              )}

              {messages.length === 0 && welcomeDismissed && (
                <div className="text-center py-10 px-4 text-xs text-zinc-400 font-serif">
                  <p>Conversation cleared.</p>
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
                      className="opacity-60 sm:opacity-0 group-hover:opacity-100 hover:bg-stone-200 text-zinc-400 hover:text-crimson p-1 rounded transition-all mt-1 cursor-pointer shrink-0"
                      title="Delete this message"
                      aria-label="Delete this message"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div
                    className={`relative max-w-[85%] px-4 py-3 text-sm leading-relaxed font-serif break-words shadow-sm ${
                      msg.role === "user"
                        ? "bg-crimson text-white shadow-md font-sans"
                        : "bg-white text-zinc-800 border border-stone-200"
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
                      className="opacity-60 sm:opacity-0 group-hover:opacity-100 hover:bg-stone-200 text-zinc-400 hover:text-crimson p-1 rounded transition-all mt-1 cursor-pointer shrink-0"
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
                  <div className="bg-white border border-gray-200 px-4 py-3 text-sm text-zinc-500 font-serif shadow-sm">
                    <BouncingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                title="Open Calendar Booking"
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-zinc-700 transition-colors cursor-pointer"
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
                className="flex-1 bg-stone-50 border border-stone-300 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-crimson transition-colors font-serif"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-crimson hover:bg-crimson-dark text-white disabled:opacity-40 transition-all shadow-md cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Toggle Button (Visible when chat is closed) */}
      {!open && (
        <button
          onClick={handleToggle}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 bg-crimson text-white shadow-lg shadow-crimson/30 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Open chat assistant"
          title="Chat with us"
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
