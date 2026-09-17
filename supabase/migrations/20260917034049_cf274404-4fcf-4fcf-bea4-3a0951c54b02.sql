ALTER TABLE public.global_stats ADD COLUMN IF NOT EXISTS total_apk_downloads BIGINT NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_apk_download_counter()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_total BIGINT;
BEGIN
  UPDATE global_stats
  SET total_apk_downloads = total_apk_downloads + 1,
      updated_at = NOW()
  WHERE id = 'main'
  RETURNING total_apk_downloads INTO new_total;

  RETURN new_total;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.increment_apk_download_counter() TO anon, authenticated;