-- Create a simple global counter table
CREATE TABLE public.global_stats (
    id TEXT PRIMARY KEY DEFAULT 'main',
    total_watermarked BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the initial counter row
INSERT INTO public.global_stats (id, total_watermarked) VALUES ('main', 0);

-- Enable RLS
ALTER TABLE public.global_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the counter (public data)
CREATE POLICY "Anyone can read global stats"
ON public.global_stats
FOR SELECT
USING (true);

-- Allow anyone to update the counter (increment only via edge function for security)
CREATE POLICY "Anyone can update global stats"
ON public.global_stats
FOR UPDATE
USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_stats;