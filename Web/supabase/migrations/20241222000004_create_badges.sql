-- Create badges table
-- Tracks user earned badges

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Users can read their own badges
CREATE POLICY "Users can read own badges"
  ON public.user_badges
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own badges
CREATE POLICY "Users can insert own badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
