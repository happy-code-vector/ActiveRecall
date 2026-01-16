-- Fix new user profile initialization to ensure questions_today starts at 0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, questions_today, questions_reset_date)
  VALUES (NEW.id, NEW.email, 0, CURRENT_DATE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also update any existing profiles that might have NULL values
UPDATE public.profiles 
SET 
  questions_today = 0,
  questions_reset_date = CURRENT_DATE
WHERE 
  questions_today IS NULL 
  OR questions_reset_date IS NULL;