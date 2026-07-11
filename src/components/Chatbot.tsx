import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE = "Do you need a free roof inspection?";

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
  const [open, setOpen] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const warmedUp = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const prewarm = useCallback(() => {
    if (warmedUp.current) return;
    warmedUp.current = true;
    fetch("https://roofing-backend-n688.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "ping", history: [] }),
    }).catch(() => {});
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch("https://roofing-backend-n688.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-80 sm:w-96 bg-white/90 backdrop-blur-xl shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-crimson flex items-center justify-center shadow-md">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-zinc-900 font-oswald uppercase tracking-wider font-bold text-sm">Roofing Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto px-5 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="bg-crimson/5 backdrop-blur-sm border border-crimson/20 px-4 py-3 text-sm text-crimson font-serif">
                  {INITIAL_MESSAGE}
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed font-serif ${
                      msg.role === "user"
                        ? "bg-crimson text-white shadow-md"
                        : "bg-white/80 backdrop-blur-sm text-zinc-800 border border-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-3 text-sm text-zinc-500 font-serif">
                    <BouncingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-200 bg-gray-50/80">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-white border border-gray-300 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-crimson transition-colors font-serif"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="p-3 bg-crimson hover:bg-crimson-dark text-white disabled:opacity-40 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        className="relative w-14 h-14 bg-crimson text-white shadow-lg shadow-crimson/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {showDot && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
