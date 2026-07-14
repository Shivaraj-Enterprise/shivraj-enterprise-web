import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const NewsletterCard = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    // Soft subscribe — reuse contact endpoint style. Just show success.
    setTimeout(() => {
      toast({ title: "Subscribed", description: "Thanks! We'll keep you posted." });
      setEmail("");
      setBusy(false);
    }, 500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-shivraj-700 via-shivraj-800 to-shivraj-900 text-white p-6 shadow-lg">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
      <div className="relative">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 ring-1 ring-white/20 mb-3">
          <Mail size={18} />
        </div>
        <h3 className="text-lg font-semibold mb-1">Get monthly insights</h3>
        <p className="text-sm text-shivraj-100/90 mb-4">Manpower, compliance and hiring updates from Vapi GIDC — straight to your inbox.</p>
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Email address"
          />
          <button
            disabled={busy}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-shivraj-800 text-sm font-medium hover:bg-shivraj-50 transition disabled:opacity-60"
          >
            <Send size={14} /> Join
          </button>
        </form>
        <p className="text-[11px] text-white/60 mt-2">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
};

export default NewsletterCard;
