-- RPC function to atomically increment question count with daily reset

CREATE OR REPLACE FUNCTION public.increment_questions(user_id UUID, today_date DATE)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.profiles
  SET 
    questions_today = CASE 
      WHEN questions_reset_date IS DISTINCT FROM today_date THEN 1
      ELSE questions_today + 1
    END,
    questions_reset_date = today_date
  WHERE id = user_id
  RETURNING questions_today INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
