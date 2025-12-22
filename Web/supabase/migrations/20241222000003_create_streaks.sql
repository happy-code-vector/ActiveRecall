-- Create streaks table
-- Tracks user learning streaks

CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  count INTEGER DEFAULT 0,
  last_date DATE,
  longest_streak INTEGER DEFAULT 0,
  freeze_used_today BOOLEAN DEFAULT FALSE,
  personal_freezes INTEGER DEFAULT 0,
  family_freezes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.streaks(user_id);

-- Enable Row Level Security
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Users can read their own streak
CREATE POLICY "Users can read own streak"
  ON public.streaks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own streak
CREATE POLICY "Users can update own streak"
  ON public.streaks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own streak
CREATE POLICY "Users can insert own streak"
  ON public.streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
