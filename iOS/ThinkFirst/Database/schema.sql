-- ThinkFirst iOS App Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    user_type TEXT CHECK (user_type IN ('student', 'parent')) NOT NULL DEFAULT 'student',
    grade_level TEXT,
    plan TEXT CHECK (plan IN ('free', 'solo', 'family')) NOT NULL DEFAULT 'free',
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_id TEXT,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    questions_today INTEGER DEFAULT 0,
    questions_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning attempts table
CREATE TABLE learning_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    attempt TEXT NOT NULL,
    effort_score DECIMAL(3,2) CHECK (effort_score >= 0 AND effort_score <= 3),
    understanding_score DECIMAL(3,2) CHECK (understanding_score >= 0 AND understanding_score <= 3),
    copied BOOLEAN DEFAULT FALSE,
    what_is_right TEXT,
    what_is_missing TEXT,
    coach_hint TEXT,
    level_up_tip TEXT,
    unlock BOOLEAN DEFAULT FALSE,
    full_explanation TEXT,
    mastery_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streaks table
CREATE TABLE streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    count INTEGER DEFAULT 0,
    last_date DATE,
    freeze_used_today BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streak freezes table
CREATE TABLE streak_freezes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    personal_freezes INTEGER DEFAULT 0,
    family_pool_freezes INTEGER DEFAULT 0,
    last_freeze_grant_date DATE,
    freeze_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badge definitions table
CREATE TABLE badge_definitions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    visual TEXT,
    category TEXT CHECK (category IN ('streak', 'mastery', 'milestone')) NOT NULL,
    rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) NOT NULL,
    icon_name TEXT NOT NULL,
    color TEXT NOT NULL,
    color_end TEXT NOT NULL,
    requirement TEXT NOT NULL,
    criteria JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges table (unlocked badges)
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id TEXT REFERENCES badge_definitions(id),
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Family relationships table
CREATE TABLE family_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    relationship_type TEXT DEFAULT 'parent_child',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Nudge notifications table
CREATE TABLE nudge_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Guardian settings table
CREATE TABLE guardian_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    pin_hash TEXT,
    force_mastery_mode BOOLEAN DEFAULT FALSE,
    block_mercy_button BOOLEAN DEFAULT FALSE,
    enable_friction_interstitials BOOLEAN DEFAULT FALSE,
    require_reason_for_unlocks BOOLEAN DEFAULT FALSE,
    report_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_learning_attempts_user_id ON learning_attempts(user_id);
CREATE INDEX idx_learning_attempts_created_at ON learning_attempts(created_at DESC);
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_family_relationships_parent_id ON family_relationships(parent_id);
CREATE INDEX idx_family_relationships_student_id ON family_relationships(student_id);
CREATE INDEX idx_nudge_notifications_to_user_id ON nudge_notifications(to_user_id);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_freezes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudge_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Learning attempts policies
CREATE POLICY "Users can view own attempts" ON learning_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON learning_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view own streaks" ON streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own streaks" ON streaks
    FOR ALL USING (auth.uid() = user_id);

-- Streak freezes policies
CREATE POLICY "Users can view own freezes" ON streak_freezes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own freezes" ON streak_freezes
    FOR ALL USING (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badge definitions are public (read-only)
CREATE POLICY "Badge definitions are public" ON badge_definitions
    FOR SELECT TO authenticated USING (true);

-- Family relationships policies
CREATE POLICY "Parents can view their family" ON family_relationships
    FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Students can view their parents" ON family_relationships
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Parents can manage family relationships" ON family_relationships
    FOR ALL USING (auth.uid() = parent_id);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streak_freezes_updated_at BEFORE UPDATE ON streak_freezes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guardian_settings_updated_at BEFORE UPDATE ON guardian_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment question count
CREATE OR REPLACE FUNCTION increment_questions(user_id UUID, today_date DATE)
RETURNS INTEGER AS $$
DECLARE
    current_count INTEGER;
BEGIN
    -- Check if we need to reset for new day
    UPDATE profiles 
    SET questions_today = 0, questions_reset_date = today_date
    WHERE id = user_id AND questions_reset_date < today_date;
    
    -- Increment and return new count
    UPDATE profiles 
    SET questions_today = questions_today + 1
    WHERE id = user_id
    RETURNING questions_today INTO current_count;
    
    RETURN COALESCE(current_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert badge definitions
INSERT INTO badge_definitions (id, name, description, visual, category, rarity, icon_name, color, color_end, requirement, criteria) VALUES
-- Streak badges
('ignition', 'Ignition', 'The spark has been struck', 'A single matchstick striking a spark against a dark surface', 'streak', 'common', 'flame.fill', '#FF6B35', '#FF4500', '3-day streak', '{"type": "streak", "value": 3}'),
('the_furnace', 'The Furnace', 'Heat is building, momentum is real', 'An industrial furnace door glowing orange with heat leaking out', 'streak', 'rare', 'flame.fill', '#FF8C42', '#FF6B35', '7-day streak', '{"type": "streak", "value": 7}'),
('momentum', 'Momentum', 'The flywheel is spinning', 'A heavy flywheel or turbine spinning with green motion blur', 'streak', 'rare', 'arrow.triangle.2.circlepath', '#00FF94', '#00CC75', '14-day streak', '{"type": "streak", "value": 14}'),
('blue_giant', 'Blue Giant', 'Burning with the hottest intensity', 'A massive star burning with intense blue/white light', 'streak', 'epic', 'star.fill', '#00D9FF', '#0099CC', '30-day streak', '{"type": "streak", "value": 30}'),
('supernova', 'Supernova', 'Explosive learning energy', 'A star exploding in brilliant colors', 'streak', 'epic', 'burst', '#FF00FF', '#8A2BE2', '60-day streak', '{"type": "streak", "value": 60}'),
('the_century', 'The Century', 'A hundred days of dedication', 'A golden monument with 100 carved in stone', 'streak', 'legendary', 'crown.fill', '#FFD700', '#FFA500', '100-day streak', '{"type": "streak", "value": 100}'),

-- Mastery badges
('synapse', 'Synapse', 'First neural connection formed', 'Two neurons connecting with a spark of electricity', 'mastery', 'common', 'brain.head.profile', '#9D4EDD', '#7B2CBF', 'First mastery mode unlock', '{"type": "mastery_unlocks", "value": 1}'),
('neural_network', 'Neural Network', 'Building complex understanding', 'A web of interconnected neurons glowing softly', 'mastery', 'rare', 'network', '#6A4C93', '#5A3A7C', '5 mastery mode unlocks', '{"type": "mastery_unlocks", "value": 5}'),
('deep_thinker', 'Deep Thinker', 'Diving into complex concepts', 'A persons silhouette with gears turning in their head', 'mastery', 'rare', 'gearshape.2.fill', '#4361EE', '#3F37C9', '10 mastery mode unlocks', '{"type": "mastery_unlocks", "value": 10}'),
('perfectionist', 'Perfectionist', 'Flawless understanding achieved', 'A perfect crystal with light refracting through it', 'mastery', 'epic', 'diamond.fill', '#00F5FF', '#0080FF', 'Perfect score in mastery mode', '{"type": "perfect_score"}'),
('night_owl', 'Night Owl', 'Learning burns bright in darkness', 'An owl perched on books under moonlight', 'mastery', 'rare', 'moon.stars.fill', '#4C956C', '#2F5233', 'Learn after 10 PM', '{"type": "late_night"}'),
('early_bird', 'Early Bird', 'Dawn brings fresh insights', 'A bird singing at sunrise with books nearby', 'mastery', 'rare', 'sunrise.fill', '#F77F00', '#D62828', 'Learn before 6 AM', '{"type": "early_morning"}'),
('the_polymath', 'The Polymath', 'Master of many domains', 'A tree with branches representing different subjects', 'mastery', 'legendary', 'tree.fill', '#2D6A4F', '#1B4332', '25 mastery mode unlocks', '{"type": "mastery_unlocks", "value": 25}'),

-- Milestone badges
('the_initiate', 'The Initiate', 'First step on the learning journey', 'A single footprint on a path leading into the distance', 'milestone', 'common', 'figure.walk', '#06D6A0', '#048A81', 'First unlock', '{"type": "total_unlocks", "value": 1}'),
('the_explorer', 'The Explorer', 'Venturing into new territories', 'A compass pointing toward unknown lands', 'milestone', 'common', 'location.fill', '#118AB2', '#073B4C', '10 unlocks', '{"type": "total_unlocks", "value": 10}'),
('the_scholar', 'The Scholar', 'Dedicated to the pursuit of knowledge', 'Ancient scrolls and quills arranged on a wooden desk', 'milestone', 'rare', 'book.fill', '#8B5A3C', '#6F4E37', '25 unlocks', '{"type": "total_unlocks", "value": 25}'),
('the_sage', 'The Sage', 'Wisdom flows through understanding', 'An ancient tree with glowing leaves of knowledge', 'milestone', 'rare', 'leaf.fill', '#52B788', '#2D6A4F', '50 unlocks', '{"type": "total_unlocks", "value": 50}'),
('the_virtuoso', 'The Virtuoso', 'Mastery through persistent practice', 'Musical notes transforming into mathematical equations', 'milestone', 'epic', 'music.note', '#E63946', '#A4161A', '100 unlocks', '{"type": "total_unlocks", "value": 100}'),
('the_legend', 'The Legend', 'Stories will be told of this dedication', 'A golden statue on a pedestal with rays of light', 'milestone', 'epic', 'trophy.fill', '#FFB700', '#FF8500', '250 unlocks', '{"type": "total_unlocks", "value": 250}'),
('the_apex', 'The Apex', 'The pinnacle of learning achievement', 'A mountain peak touching the stars', 'milestone', 'legendary', 'mountain.2.fill', '#7209B7', '#480CA8', '500 unlocks', '{"type": "total_unlocks", "value": 500}');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;