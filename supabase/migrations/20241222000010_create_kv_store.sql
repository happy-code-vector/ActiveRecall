-- Create KV store table for Supabase functions
CREATE TABLE IF NOT EXISTS public.kv_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.kv_store ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all data
CREATE POLICY "Service role can manage KV store"
  ON public.kv_store
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON public.kv_store(key);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_kv_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER kv_store_updated_at
  BEFORE UPDATE ON public.kv_store
  FOR EACH ROW
  EXECUTE FUNCTION public.update_kv_store_updated_at();