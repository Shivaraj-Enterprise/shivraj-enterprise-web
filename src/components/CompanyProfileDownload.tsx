import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyProfileUrl } from "@/hooks/useCompanyProfileUrl";

interface Props {
  label?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const CompanyProfileDownload = ({
  label = "Company Profile",
  className,
  variant = "outline",
  size = "default",
}: Props) => {
  const profileUrl = useCompanyProfileUrl();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [form, setForm] = useState({
    company: "",
    email: "",
    whatsapp: "",
    phone: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await supabase.functions.invoke("profile-download-notify", {
        body: {
          company: form.company,
          email: form.email,
          phone: form.phone,
          whatsapp: sameAsPhone ? form.phone : form.whatsapp,
        },
      });
    } catch {
      // still allow the download even if saving/notifying fails
    }
    setSaving(false);
    setOpen(false);
    toast({
      title: "Thank you!",
      description: "Your company profile download is starting.",
    });
    window.open(profileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <span className="flex items-center gap-2">
            <Download size={18} /> {label}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Company Profile</DialogTitle>
          <DialogDescription>
            Please share your details and the PDF will open right away.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cp-company">Company name</Label>
            <Input id="cp-company" required value={form.company} onChange={update("company")} placeholder="Your company name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-email">Email ID</Label>
            <Input id="cp-email" type="email" required value={form.email} onChange={update("email")} placeholder="name@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-phone">Phone number</Label>
            <Input id="cp-phone" type="tel" required pattern="[0-9+\s-]{8,15}" value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-whatsapp">
              WhatsApp number <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </Label>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="cp-same-as-phone"
                checked={sameAsPhone}
                onCheckedChange={(checked) => setSameAsPhone(checked === true)}
              />
              <label htmlFor="cp-same-as-phone" className="text-sm text-muted-foreground cursor-pointer">
                Same as phone number
              </label>
            </div>
            {!sameAsPhone && (
              <Input id="cp-whatsapp" type="tel" pattern="[0-9+\s-]{8,15}" value={form.whatsapp} onChange={update("whatsapp")} placeholder="+91 98765 43210" />
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              <span className="ml-2">Download PDF</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyProfileDownload;
