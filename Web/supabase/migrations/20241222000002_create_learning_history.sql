-- Create learning history table
-- Stores all question attempts and evaluations

CREATE TABLE IF NOT EXISTS public.learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  attempt TEXT NOT NULL,
  effort_score INTEGER CHECK (effort_score >= 0 AND effort_score <= 100),
  understanding_score INTEGER CHECK (understanding_score >= 0 AND understanding_score <= 100),
  copied BOOLEAN DEFAULT FALSE,
  what_is_right TEXT,
  what_is_missing TEXT,
  coach_hint TEXT,
  level_up_tip TEXT,
  unlock BOOLEAN DEFAULT FALSE,
  full_explanation TEXT,
  subject TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('base', 'mid', 'mastery')) DEFAULT 'base',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_learning_history_user_id ON public.learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_history_created_at ON public.learning_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_history_subject ON public.learning_history(subject);

-- Enable Row Level Security
ALTER TABLE public.learning_history ENABLE ROW LEVEL SECURITY;

-- Users can read their own history
CREATE POLICY "Users can read own history"
  ON public.learning_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert own history"
  ON public.learning_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history
CREATE POLICY "Users can delete own history"
  ON public.learning_history
  FOR DELETE
  USING (auth.uid() = user_id);
