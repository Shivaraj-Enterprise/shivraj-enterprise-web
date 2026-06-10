import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type RateCardItem = {
  id: string;
  service: string;
  unit8: string;
  rate8: string;
  unit12: string;
  rate12: string;
  sort_order: number;
};

export const useRateCard = () => {
  const [items, setItems] = useState<RateCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("rate_card_items" as never)
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data ?? []) as unknown as RateCardItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { items, loading, reload: load };
};
