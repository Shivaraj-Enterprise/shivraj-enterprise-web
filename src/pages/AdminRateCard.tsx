import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Save, Trash2, LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";
import { useRateCard, RateCardItem } from "@/hooks/useRateCard";

const AdminRateCard = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const { items, loading, reload } = useRateCard();
  const [draft, setDraft] = useState<Record<string, Partial<RateCardItem>>>({});
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const setField = (id: string, key: keyof RateCardItem, value: string) => {
    setDraft((d) => ({ ...d, [id]: { ...d[id], [key]: value } }));
  };

  const valueOf = (row: RateCardItem, key: keyof RateCardItem) =>
    (draft[row.id]?.[key] as string) ?? (row[key] as string);

  const isDirty = (id: string) => !!draft[id] && Object.keys(draft[id]).length > 0;

  const save = async (row: RateCardItem) => {
    const patch = draft[row.id];
    if (!patch) return;
    setBusy(true);
    const { error } = await supabase
      .from("rate_card_items" as never)
      .update(patch as never)
      .eq("id", row.id);
    setBusy(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    setDraft((d) => { const { [row.id]: _, ...rest } = d; return rest; });
    toast({ title: "Saved" });
    reload();
  };

  const addRow = async () => {
    const maxOrder = items.reduce((m, r) => Math.max(m, r.sort_order), 0);
    setBusy(true);
    const { error } = await supabase
      .from("rate_card_items" as never)
      .insert({ service: "New Service", sort_order: maxOrder + 10 } as never);
    setBusy(false);
    if (error) return toast({ title: "Add failed", description: error.message, variant: "destructive" });
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this row?")) return;
    setBusy(true);
    const { error } = await supabase.from("rate_card_items" as never).delete().eq("id", id);
    setBusy(false);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    reload();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const a = items[index];
    const b = items[index + dir];
    if (!a || !b) return;
    setBusy(true);
    // swap sort_order values
    await supabase.from("rate_card_items" as never).update({ sort_order: b.sort_order } as never).eq("id", a.id);
    await supabase.from("rate_card_items" as never).update({ sort_order: a.sort_order } as never).eq("id", b.id);
    setBusy(false);
    reload();
  };

  return (
    <AdminGate auth={auth}>
      <Helmet><title>Admin – Rate Card</title></Helmet>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/submissions"><ArrowLeft size={16} className="mr-1" /> Back</Link>
            </Button>
            <h1 className="text-2xl font-bold text-shivraj-800">Rate Card</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={addRow} disabled={busy}><Plus size={16} className="mr-1" /> Add Row</Button>
            <Button variant="outline" onClick={signOut}><LogOut size={16} className="mr-1" /> Sign out</Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Edit any field and click Save on that row. Use the up/down arrows to reorder. Changes appear immediately on the public Services page.
        </p>

        <div className="bg-white rounded-lg border border-shivraj-100 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-shivraj-50">
                <TableHead className="w-24">Order</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Unit (col 1)</TableHead>
                <TableHead>Rate (col 1)</TableHead>
                <TableHead>Unit (col 2)</TableHead>
                <TableHead>Rate (col 2)</TableHead>
                <TableHead className="w-40">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading…</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No rows. Click "Add Row" to begin.</TableCell></TableRow>
              ) : items.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7" disabled={busy || i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                        <ArrowUp size={14} />
                      </Button>
                      <Button size="icon" variant="outline" className="h-7 w-7" disabled={busy || i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                        <ArrowDown size={14} />
                      </Button>
                    </div>
                  </TableCell>
                  {(["service", "unit8", "rate8", "unit12", "rate12"] as const).map((k) => (
                    <TableCell key={k}>
                      <Input
                        value={valueOf(row, k)}
                        onChange={(e) => setField(row.id, k, e.target.value)}
                        className="h-9"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" disabled={busy || !isDirty(row.id)} onClick={() => save(row)}>
                        <Save size={14} className="mr-1" /> Save
                      </Button>
                      <Button size="icon" variant="destructive" className="h-9 w-9" disabled={busy} onClick={() => remove(row.id)} aria-label="Delete row">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminRateCard;
