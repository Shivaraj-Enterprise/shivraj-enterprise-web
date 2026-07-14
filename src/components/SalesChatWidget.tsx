import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ROTATING_MESSAGES = [
  "✨ Ask AI",
  "💬 Ask Anything",
  "🤖 AI Assistant",
  "⚡ Get Instant Help",
  "👋 Need Help?",
  "🚀 Let's Talk",
  "💡 Ask About Our Services",
  "📋 Find the Right Service",
  "🧠 AI Workforce Expert",
  "📞 Talk to Our AI",
  "👷 Find Skilled Labour",
  "🎯 Get a Quick Quote",
  "⚙️ Workforce Assistant",
  "🏭 Industrial Support AI",
  "💬 Ask Shivraj AI",
];

const NOTIFICATION_MESSAGES = [
  "👋 Need manpower?",
  "⚡ Instant quotation available",
  "💬 Ask me anything",
  "🏭 Looking for skilled labour?",
  "📋 Get pricing in seconds",
  "🚀 Response within seconds",
  "👷 Find the right workforce",
];

const TYPING_PREVIEWS = [
  "AI Assistant is typing…",
  "How can I help today?",
  "Looking for manpower?",
  "Need an instant quotation?",
  "Ask me anything.",
];

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "shivraj_sales_chat_v1";

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the Shivraj Enterprise Sales Assistant. 👋\n\nI can help you with:\n• Manpower outsourcing & supply\n• Industrial housekeeping\n• GST / TDS / ESI / EPF compliance questions\n• Rate card & quotations\n\nHow can I help you today?",
};

const QUICK_ACTIONS = [
  "Request Manpower",
  "Request a Quotation",
  "View Services",
  "Industries Served",
  "Talk to Sales",
];

const SERVICE_CHIPS = [
  { label: "👷 Manpower Supply", q: "Tell me about your manpower supply services." },
  { label: "🧹 Industrial Housekeeping", q: "What industrial housekeeping services do you offer?" },
  { label: "🏭 Facility Management", q: "Do you provide facility management services?" },
  { label: "📦 Loading & Unloading", q: "Do you provide loading and unloading manpower?" },
  { label: "🛡️ Security Services", q: "Do you offer security services?" },
  { label: "💰 Rate Card", q: "Can you share your rate card and pricing?" },
];

const FAQ_CHIPS = [
  { label: "❓ How does billing work?", q: "How does your billing and invoicing work?" },
  { label: "📄 GST / TDS compliance", q: "How do you handle GST and TDS compliance?" },
  { label: "🧾 ESI & EPF coverage", q: "Do your workers have ESI and EPF coverage?" },
  { label: "⏱️ How fast can you deploy?", q: "How quickly can you deploy manpower on site?" },
  { label: "📍 Which locations do you serve?", q: "Which locations and industries do you serve?" },
  { label: "📝 How to raise a request?", q: "How do I raise a manpower request?" },
];

const WHATSAPP_NUMBER = "919998498311";

// Extract contact details captured by the assistant during handoff
const extractContact = (messages: Msg[]) => {
  const text = messages.map((m) => m.content).join("\n");
  const nameMatch = text.match(/(?:my name is|i am|i'm|name[:\-\s]+)\s*([A-Z][a-zA-Z .]{1,40})/i);
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(?:\+?\d[\d\s\-]{8,}\d)/);
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  return {
    name: nameMatch?.[1]?.trim(),
    email: emailMatch?.[0],
    mobile: phoneMatch?.[0]?.trim(),
    request: lastUser,
  };
};


const SalesChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [WELCOME];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : [WELCOME];
    } catch {
      return [WELCOME];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [notif, setNotif] = useState<string | null>(null);
  const [typingPreview, setTypingPreview] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [pulseTick, setPulseTick] = useState(0);
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reducedMotion = useReducedMotion();
  const hasInteracted = messages.length > 1;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);
  // Rotate button label
  useEffect(() => {
    if (open || reducedMotion) return;
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % ROTATING_MESSAGES.length), 7000);
    return () => clearInterval(id);
  }, [open, reducedMotion]);

  // Periodic pulse
  useEffect(() => {
    if (open || reducedMotion) return;
    const id = setInterval(() => setPulseTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, [open, reducedMotion]);

  // Notification bubble (random 25–40s)
  useEffect(() => {
    if (open || hasInteracted || reducedMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = (25 + Math.random() * 15) * 1000;
      timer = setTimeout(() => {
        const msg = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
        setNotif(msg);
        setTimeout(() => setNotif(null), 5000);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [open, hasInteracted, reducedMotion]);

  // Typing preview after 8s idle, repeat every 25s
  useEffect(() => {
    if (open || reducedMotion) return;
    let idx = 0;
    const first = setTimeout(function show() {
      setTypingPreview(TYPING_PREVIEWS[idx % TYPING_PREVIEWS.length]);
      idx++;
      setTimeout(() => setTypingPreview(null), 4000);
      setTimeout(show, 25000);
    }, 8000);
    return () => clearTimeout(first);
  }, [open, reducedMotion]);


  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const nextMsgs: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("sales-chat", {
        body: { messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      const payload = data as { reply?: string; handoff?: boolean };
      const reply = payload?.reply ?? "Sorry, something went wrong. Please call +91 99984 98311.";
      if (payload?.handoff) setHandoff(true);
      setMessages([...nextMsgs, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...nextMsgs,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching the server right now. Please try again in a moment, or contact us directly at +91 99984 98311 / shivrajenterprise1234@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const reset = () => {
    setMessages([WELCOME]);
    setHandoff(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const requestHumanNow = () => {
    send("I'd like to speak with a human sales representative. Please collect my name, mobile number and email so your team can contact me.");
  };

  const handleToggle = () => {
    if (open) {
      setClosing(true);
      setTimeout(() => { setOpen(false); setClosing(false); }, 200);
      return;
    }
    setNotif(null);
    setTypingPreview(null);
    if (reducedMotion) { setOpen(true); return; }
    setThinking(true);
    setTimeout(() => { setThinking(false); setOpen(true); }, 500);
  };

  const rotatingLabel = ROTATING_MESSAGES[msgIdx];

  return (
    <>
      {/* Notification bubble */}
      {!open && notif && (
        <div
          className="fixed bottom-24 right-5 z-[99] max-w-[240px] bg-white border border-gray-200 shadow-xl rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-gray-800 animate-[chatFadeIn_.35s_ease-out] pointer-events-none"
        >
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
          {notif}
        </div>
      )}

      {/* Typing preview */}
      {!open && !notif && typingPreview && (
        <div className="fixed bottom-24 right-5 z-[99] max-w-[240px] bg-white border border-gray-200 shadow-xl rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-gray-700 animate-[chatFadeIn_.35s_ease-out] pointer-events-none flex items-center gap-2">
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-shivraj-500 animate-[chatDot_1.2s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-shivraj-500 animate-[chatDot_1.2s_infinite] [animation-delay:.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-shivraj-500 animate-[chatDot_1.2s_infinite] [animation-delay:.3s]" />
          </span>
          <span className="italic text-gray-600">{typingPreview}</span>
        </div>
      )}

      {/* Floating button */}
      <button
        aria-label={open ? "Close chat" : "Open AI assistant"}
        onClick={handleToggle}
        key={pulseTick}
        style={{ boxShadow: "0 15px 40px rgba(0,0,0,0.18)" }}
        className={cn(
          "group fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 rounded-full font-semibold text-white",
          "bg-gradient-to-br from-shivraj-600 to-shivraj-700 hover:from-shivraj-700 hover:to-shivraj-800",
          "transition-all duration-250 active:scale-95 hover:scale-[1.06]",
          "focus:outline-none focus:ring-4 focus:ring-shivraj-500/30",
          !open && !reducedMotion && "animate-[chatFloat_3s_ease-in-out_infinite] motion-safe:before:content-[''] motion-safe:before:absolute motion-safe:before:inset-0 motion-safe:before:rounded-full motion-safe:before:animate-[chatGlow_4s_ease-in-out_infinite] motion-safe:before:-z-10",
          !open && !reducedMotion && "motion-safe:animate-[chatPulse_.6s_ease-out]",
          open ? "h-12 w-12 justify-center p-0" : "px-[22px] py-[14px] text-[15px]"
        )}
      >
        {open ? (
          <X size={22} />
        ) : thinking ? (
          <span className="flex items-center gap-2 px-1">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-[chatDot_1s_infinite]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-[chatDot_1s_infinite] [animation-delay:.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-[chatDot_1s_infinite] [animation-delay:.3s]" />
            </span>
          </span>
        ) : (
          <>
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm group-hover:animate-[chatIconBounce_.6s_ease-out]">
              <Sparkles size={16} className="drop-shadow" />
            </span>
            <span
              key={msgIdx}
              className="hidden sm:inline-block whitespace-nowrap animate-[chatLabelIn_.5s_ease-out]"
            >
              {rotatingLabel}
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </>
        )}
      </button>


      {/* Chat window */}
      {open && (
        <div
          className={cn(
            "fixed z-[99] bg-white shadow-2xl border border-gray-200 rounded-2xl flex flex-col overflow-hidden",
            "bottom-20 right-4 left-4 sm:left-auto sm:right-5 sm:bottom-24",
            "sm:w-[400px] h-[70vh] sm:h-[600px] max-h-[700px]",
            closing ? "animate-[chatWindowOut_.2s_ease-in_forwards]" : "animate-[chatWindowIn_.3s_cubic-bezier(.22,1,.36,1)]"
          )}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-shivraj-700 to-shivraj-600 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Shivraj Sales Assistant</div>
              <div className="text-xs opacity-90 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Online · Typically replies instantly
              </div>
            </div>
            <button
              onClick={requestHumanNow}
              className="text-xs bg-white/15 hover:bg-white/25 rounded-full px-2.5 py-1 transition"
              title="Talk to a human sales rep"
            >
              Talk to human
            </button>
            <button
              onClick={reset}
              className="text-xs opacity-80 hover:opacity-100 underline"
              title="Start a new conversation"
            >
              New
            </button>
          </div>

          {/* Handoff banner */}
          {handoff && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="text-xs text-amber-900">
                <div className="font-semibold">Connecting you to our sales team</div>
                <div>Reach us instantly:</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <a
                  href="tel:+919998498311"
                  className="flex items-center gap-1 text-xs bg-shivraj-600 hover:bg-shivraj-700 text-white rounded-full px-2.5 py-1.5"
                >
                  <Phone size={12} /> Call
                </a>
                <a
                  href="https://wa.me/919998498311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-full px-2.5 py-1.5"
                >
                  <MessageSquare size={12} /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed",
                    m.role === "user"
                      ? "bg-shivraj-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="animate-spin" size={14} />
                  Thinking...
                </div>
              </div>
            )}

            {/* Quick actions (only on first turn) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {QUICK_ACTIONS.map((qa) => (
                  <button
                    key={qa}
                    onClick={() => send(qa)}
                    className="text-xs bg-white border border-shivraj-200 text-shivraj-700 hover:bg-shivraj-50 rounded-full px-3 py-1.5 transition"
                  >
                    {qa}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-gray-200 bg-white p-3 flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Type your message..."
              rows={1}
              disabled={loading}
              className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-shivraj-500 max-h-24"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-shivraj-600 hover:bg-shivraj-700 disabled:bg-gray-300 text-white flex items-center justify-center transition shrink-0"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SalesChatWidget;
