-- Add subscription-related fields to profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', NULL)) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS questions_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS questions_reset_date DATE DEFAULT CURRENT_DATE;

-- Create index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON public.profiles(subscription_id);

-- Function to reset daily question count
CREATE OR REPLACE FUNCTION public.reset_daily_questions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.questions_reset_date IS DISTINCT FROM CURRENT_DATE THEN
    NEW.questions_today = 0;
    NEW.questions_reset_date = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to reset questions on access
DROP TRIGGER IF EXISTS reset_questions_trigger ON public.profiles;
CREATE TRIGGER reset_questions_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.reset_daily_questions();
