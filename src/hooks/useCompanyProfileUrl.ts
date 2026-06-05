import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK = `${import.meta.env.BASE_URL}SHIVRAJ_Enterprise_Company_Profile.pdf`;
const BUCKET = "company-assets";
const PATH = "company-profile.pdf";

export const useCompanyProfileUrl = () => {
  const [url, setUrl] = useState<string>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .storage
        .from(BUCKET)
        .createSignedUrl(PATH, 60 * 60);
      if (!cancelled && data?.signedUrl) setUrl(data.signedUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return url;
};
