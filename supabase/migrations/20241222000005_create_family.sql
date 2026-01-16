-- Create family relationships table
-- For parent-child connections in family plans

CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code TEXT,
  status TEXT CHECK (status IN ('pending', 'active', 'removed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_family_members_parent_id ON public.family_members(parent_id);
CREATE INDEX IF NOT EXISTS idx_family_members_child_id ON public.family_members(child_id);
CREATE INDEX IF NOT EXISTS idx_family_members_invite_code ON public.family_members(invite_code);

-- Enable Row Level Security
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Parents can read their family members
CREATE POLICY "Parents can read family members"
  ON public.family_members
  FOR SELECT
  USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- Parents can insert family members
CREATE POLICY "Parents can insert family members"
  ON public.family_members
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

-- Parents can update family members
CREATE POLICY "Parents can update family members"
  ON public.family_members
  FOR UPDATE
  USING (auth.uid() = parent_id);

-- Parents can delete family members
CREATE POLICY "Parents can delete family members"
  ON public.family_members
  FOR DELETE
  USING (auth.uid() = parent_id);

-- Create invite codes table
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  used_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_parent_id ON public.invite_codes(parent_id);

-- Enable Row Level Security
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Parents can manage their invite codes
CREATE POLICY "Parents can read own invite codes"
  ON public.invite_codes
  FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert invite codes"
  ON public.invite_codes
  FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Anyone can read invite code by code"
  ON public.invite_codes
  FOR SELECT
  USING (TRUE);
