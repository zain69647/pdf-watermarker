
CREATE OR REPLACE FUNCTION increment_watermark_counter(increment_by INTEGER)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total BIGINT;
BEGIN
  UPDATE global_stats 
  SET total_watermarked = total_watermarked + increment_by,
      updated_at = NOW()
  WHERE id = 'main'
  RETURNING total_watermarked INTO new_total;
  
  RETURN new_total;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_watermark_counter(INTEGER) TO anon, authenticated;
