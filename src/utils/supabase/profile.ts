import { supabase } from './client';

export type PlanType = 'free' | 'solo' | 'family';
export type UserType = 'student' | 'parent';

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  user_type: UserType;
  grade_level: string;
  plan: PlanType;
  is_premium: boolean;
  subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  questions_today: number;
  questions_reset_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  plan: PlanType;
  questionsToday: number;
  questionsLimit: number;
  canAskQuestions: boolean;
  canUseVoice: boolean;
  canUseMasteryMode: boolean;
  canUseCoachTips: boolean;
  canUnlockAllBadges: boolean;
  canViewAdvancedStats: boolean;
}

// Fetch user profile from Supabase
export async function fetchUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as UserProfile;
}

// Update user profile
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data as UserProfile;
}

// Increment question count
export async function incrementQuestionCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // First check if we need to reset (new day)
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase.rpc('increment_questions', {
    user_id: user.id,
    today_date: today
  });

  if (error) {
    console.error('Error incrementing questions:', error);
    // Fallback: try direct update
    const profile = await fetchUserProfile();
    if (profile) {
      const newCount = profile.questions_today + 1;
      await updateUserProfile({ questions_today: newCount });
      return newCount;
    }
    return 0;
  }

  return data || 0;
}

// Get subscription status from profile
export function getSubscriptionStatusFromProfile(profile: UserProfile | null): SubscriptionStatus {
  const isPremium = profile?.is_premium ?? false;
  const plan = profile?.plan ?? 'free';
  const questionsToday = profile?.questions_today ?? 0;
  const questionsLimit = plan === 'free' ? 3 : Infinity;
  const canAskQuestions = questionsToday < questionsLimit;

  return {
    isPremium,
    plan,
    questionsToday,
    questionsLimit,
    canAskQuestions,
    canUseVoice: isPremium,
    canUseMasteryMode: isPremium,
    canUseCoachTips: isPremium,
    canUnlockAllBadges: isPremium,
    canViewAdvancedStats: isPremium,
  };
}

// Update subscription after payment
export async function updateSubscription(
  subscriptionId: string,
  plan: PlanType,
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_id: subscriptionId,
      plan,
      is_premium: plan !== 'free' && status === 'active',
      subscription_status: status,
      subscription_start_date: new Date().toISOString(),
    })
    .eq('id', user.id);

  return !error;
}

// Cancel subscription
export async function cancelSubscription(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      subscription_end_date: new Date().toISOString(),
    })
    .eq('id', user.id);

  return !error;
}
