DROP FUNCTION IF EXISTS public.increment_apk_download_counter();
ALTER TABLE public.global_stats DROP COLUMN IF EXISTS total_apk_downloads;
