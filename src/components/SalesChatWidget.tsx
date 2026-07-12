import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, Phone, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      const reply = (data as { reply?: string })?.reply ?? "Sorry, something went wrong. Please call +91 99984 98311.";
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
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <>
      {/* Floating button */}
      <button
        aria-label={open ? "Close chat" : "Open sales chat"}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full shadow-xl transition-all",
          "bg-shivraj-600 hover:bg-shivraj-700 text-white",
          open ? "h-12 w-12 justify-center" : "px-5 py-3.5"
        )}
      >
        {open ? (
          <X size={22} />
        ) : (
          <>
            <MessageCircle size={22} />
            <span className="font-semibold hidden sm:inline">Chat with Sales</span>
          </>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className={cn(
            "fixed z-[99] bg-white shadow-2xl border border-gray-200 rounded-2xl flex flex-col overflow-hidden",
            "bottom-20 right-4 left-4 sm:left-auto sm:right-5 sm:bottom-24",
            "sm:w-[400px] h-[70vh] sm:h-[600px] max-h-[700px]"
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
              onClick={reset}
              className="text-xs opacity-80 hover:opacity-100 underline"
              title="Start a new conversation"
            >
              New
            </button>
          </div>

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
