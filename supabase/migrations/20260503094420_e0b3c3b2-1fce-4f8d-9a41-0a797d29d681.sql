DROP POLICY IF EXISTS "Anyone can update global stats" ON public.global_stats;

CREATE OR REPLACE FUNCTION public.increment_watermark_counter(increment_by integer)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_total BIGINT;
BEGIN
  IF increment_by IS NULL OR increment_by < 1 OR increment_by > 1000 THEN
    RAISE EXCEPTION 'Invalid increment value';
  END IF;

  UPDATE global_stats
  SET total_watermarked = total_watermarked + increment_by,
      updated_at = NOW()
  WHERE id = 'main'
  RETURNING total_watermarked INTO new_total;

  RETURN new_total;
END;
$function$;