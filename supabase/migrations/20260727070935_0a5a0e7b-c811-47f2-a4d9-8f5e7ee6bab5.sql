-- Store the shared secret in Vault
DO $$
DECLARE
  v_secret text := 'qTzhq4QCpZXPvWhjACDSKSCVgHDQS97pTsuDyAf-QN8JHDvCKr178796vmJUX4sk';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'monthly_report_secret') THEN
    PERFORM vault.create_secret(v_secret, 'monthly_report_secret', 'Shared secret for monthly-report edge function auth');
  ELSE
    UPDATE vault.secrets
      SET secret = v_secret
      WHERE name = 'monthly_report_secret';
  END IF;
END $$;

-- RPC used by the edge function (service_role only) to read the shared secret
CREATE OR REPLACE FUNCTION public.get_monthly_report_secret()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v text;
BEGIN
  SELECT decrypted_secret INTO v
  FROM vault.decrypted_secrets
  WHERE name = 'monthly_report_secret'
  LIMIT 1;
  RETURN v;
END;
$$;

REVOKE ALL ON FUNCTION public.get_monthly_report_secret() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_monthly_report_secret() TO service_role;

-- Reschedule the monthly-report cron with the x-report-secret header
DO $$
DECLARE
  v_jobid bigint;
  v_secret text := 'qTzhq4QCpZXPvWhjACDSKSCVgHDQS97pTsuDyAf-QN8JHDvCKr178796vmJUX4sk';
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE command ILIKE '%monthly-report%' LIMIT 1;
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;

  PERFORM cron.schedule(
    'monthly-report-first-of-month',
    '0 8 1 * *',
    format($cron$
      SELECT net.http_post(
        url := 'https://nvoyjhacqztymnxofjpg.supabase.co/functions/v1/monthly-report',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b3lqaGFjcXp0eW1ueG9manBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NTU5NTcsImV4cCI6MjA5NDEzMTk1N30.84zc7G9u_VlPvqmifbPq5bIIjkFCc3xZJB45-RDTv1M',
          'x-report-secret', %L
        ),
        body := '{}'::jsonb
      );
    $cron$, v_secret)
  );
END $$;