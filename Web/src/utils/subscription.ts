// Subscription management and paywall logic

export type PlanType = 'free' | 'solo' | 'family';

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

// SSR-safe localStorage access
const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

// Get current subscription status
export function getSubscriptionStatus(): SubscriptionStatus {
  const isPremium = getItem('thinkfirst_premium') === 'true';
  const planString = getItem('thinkfirst_plan') || 'free';
  const plan = (isPremium ? planString : 'free') as PlanType;

  // Get questions asked today
  const questionsToday = getQuestionsToday();
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

// Track questions asked today
export function getQuestionsToday(): number {
  const today = new Date().toDateString();
  const stored = getItem('thinkfirst_questions_date');
  const count = parseInt(getItem('thinkfirst_questions_count') || '0', 10);

  // Reset if it's a new day
  if (stored !== today) {
    setItem('thinkfirst_questions_date', today);
    setItem('thinkfirst_questions_count', '0');
    return 0;
  }

  return count;
}

// Increment question count
export function incrementQuestionCount(): void {
  const today = new Date().toDateString();
  const stored = getItem('thinkfirst_questions_date');
  
  if (stored !== today) {
    setItem('thinkfirst_questions_date', today);
    setItem('thinkfirst_questions_count', '1');
  } else {
    const count = parseInt(getItem('thinkfirst_questions_count') || '0', 10);
    setItem('thinkfirst_questions_count', String(count + 1));
  }
}

// Get questions remaining today
export function getQuestionsRemaining(): number {
  const status = getSubscriptionStatus();
  if (status.isPremium) return Infinity;
  return Math.max(0, status.questionsLimit - status.questionsToday);
}

// Check if user can perform action
export function canPerformAction(action: 'voice' | 'mastery' | 'coach' | 'badges' | 'stats'): boolean {
  const status = getSubscriptionStatus();
  
  switch (action) {
    case 'voice':
      return status.canUseVoice;
    case 'mastery':
      return status.canUseMasteryMode;
    case 'coach':
      return status.canUseCoachTips;
    case 'badges':
      return status.canUnlockAllBadges;
    case 'stats':
      return status.canViewAdvancedStats;
    default:
      return false;
  }
}
