/**
 * Streak Freeze System
 * Manages streak freezes for protecting learning streaks when days are missed
 */

export interface FreezeEvent {
  type: 'granted' | 'consumed' | 'borrowed';
  timestamp: string;
  source: 'personal' | 'family_pool';
}

export interface StreakFreezeState {
  personalFreezes: number;
  familyPoolFreezes: number;
  lastFreezeGrantDate: string | null;
  freezeHistory: FreezeEvent[];
}

export interface StreakResetConfig {
  /** Hour of day for streak reset (default: 3 for 3 AM) */
  resetHour: number;
  /** User's timezone (IANA format) */
  timezone: string;
}

// Storage keys
const STORAGE_KEY = 'thinkfirst_streak_freeze';
const STREAK_KEY = 'thinkfirst_streak';
const LAST_ACTIVITY_KEY = 'thinkfirst_last_activity';

// SSR-safe localStorage access
const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

// Default configuration
const DEFAULT_CONFIG: StreakResetConfig = {
  resetHour: 3,
  timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
};

// Freeze grants per plan type
export const FREEZE_GRANTS = {
  free: 1,
  solo: 3,
  family: 3,
  familyPool: 5,
} as const;

/**
 * Get the current streak freeze state from localStorage
 */
export function getStreakFreezeState(): StreakFreezeState {
  const stored = getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid data, return default
    }
  }
  return {
    personalFreezes: 0,
    familyPoolFreezes: 0,
    lastFreezeGrantDate: null,
    freezeHistory: [],
  };
}

/**
 * Save streak freeze state to localStorage
 */
export function saveStreakFreezeState(state: StreakFreezeState): void {
  setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Get the streak reset boundary time for a given date
 * Uses 3 AM local time instead of midnight
 */
export function getStreakResetBoundary(
  date: Date,
  config: StreakResetConfig = DEFAULT_CONFIG
): Date {
  const boundary = new Date(date);
  boundary.setHours(config.resetHour, 0, 0, 0);
  return boundary;
}

/**
 * Check if a day was missed (no activity between 3 AM boundaries)
 */
export function wasDayMissed(
  lastActivityDate: Date,
  currentDate: Date,
  config: StreakResetConfig = DEFAULT_CONFIG
): boolean {
  const lastBoundary = getStreakResetBoundary(lastActivityDate, config);
  const currentBoundary = getStreakResetBoundary(currentDate, config);
  
  // If last activity was before its day's 3 AM, use previous day's boundary
  if (lastActivityDate < lastBoundary) {
    lastBoundary.setDate(lastBoundary.getDate() - 1);
  }
  
  // If current time is before today's 3 AM, use previous day's boundary
  if (currentDate < currentBoundary) {
    currentBoundary.setDate(currentBoundary.getDate() - 1);
  }
  
  // Calculate days between boundaries
  const daysDiff = Math.floor(
    (currentBoundary.getTime() - lastBoundary.getTime()) / (24 * 60 * 60 * 1000)
  );
  
  return daysDiff > 1;
}

/**
 * Consume a personal streak freeze
 * Returns true if freeze was consumed, false if none available
 */
export function consumeFreeze(state: StreakFreezeState): {
  success: boolean;
  newState: StreakFreezeState;
} {
  if (state.personalFreezes <= 0) {
    return { success: false, newState: state };
  }
  
  const newState: StreakFreezeState = {
    ...state,
    personalFreezes: state.personalFreezes - 1,
    freezeHistory: [
      ...state.freezeHistory,
      {
        type: 'consumed',
        timestamp: new Date().toISOString(),
        source: 'personal',
      },
    ],
  };
  
  return { success: true, newState };
}

/**
 * Borrow a freeze from the family pool
 * Returns true if freeze was borrowed, false if pool is empty
 */
export function borrowFromFamilyPool(state: StreakFreezeState): {
  success: boolean;
  newState: StreakFreezeState;
} {
  if (state.familyPoolFreezes <= 0) {
    return { success: false, newState: state };
  }
  
  const newState: StreakFreezeState = {
    ...state,
    familyPoolFreezes: state.familyPoolFreezes - 1,
    freezeHistory: [
      ...state.freezeHistory,
      {
        type: 'borrowed',
        timestamp: new Date().toISOString(),
        source: 'family_pool',
      },
    ],
  };
  
  return { success: true, newState };
}

/**
 * Grant monthly freezes based on plan type
 */
export function grantMonthlyFreezes(
  state: StreakFreezeState,
  planType: 'free' | 'solo' | 'family'
): StreakFreezeState {
  const freezeCount = FREEZE_GRANTS[planType];
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
  
  // Check if already granted this month
  if (state.lastFreezeGrantDate) {
    const lastGrant = new Date(state.lastFreezeGrantDate);
    const lastMonth = `${lastGrant.getFullYear()}-${lastGrant.getMonth()}`;
    if (lastMonth === currentMonth) {
      return state; // Already granted this month
    }
  }
  
  const newState: StreakFreezeState = {
    ...state,
    personalFreezes: state.personalFreezes + freezeCount,
    lastFreezeGrantDate: now.toISOString(),
    freezeHistory: [
      ...state.freezeHistory,
      {
        type: 'granted',
        timestamp: now.toISOString(),
        source: 'personal',
      },
    ],
  };
  
  // Grant family pool for family plans
  if (planType === 'family') {
    newState.familyPoolFreezes = FREEZE_GRANTS.familyPool;
  }
  
  return newState;
}

/**
 * Check and handle streak protection on app load
 * Returns whether the streak was preserved
 */
export function checkAndProtectStreak(
  planType: 'free' | 'solo' | 'family',
  isFamilyMember: boolean = false
): {
  streakPreserved: boolean;
  freezeUsed: boolean;
  source: 'personal' | 'family_pool' | null;
} {
  const lastActivityStr = getItem(LAST_ACTIVITY_KEY);
  if (!lastActivityStr) {
    return { streakPreserved: true, freezeUsed: false, source: null };
  }
  
  const lastActivity = new Date(lastActivityStr);
  const now = new Date();
  
  // Check if a day was missed
  if (!wasDayMissed(lastActivity, now)) {
    return { streakPreserved: true, freezeUsed: false, source: null };
  }
  
  // Day was missed, try to use a freeze
  let state = getStreakFreezeState();
  
  // First, try personal freezes
  const personalResult = consumeFreeze(state);
  if (personalResult.success) {
    saveStreakFreezeState(personalResult.newState);
    return { streakPreserved: true, freezeUsed: true, source: 'personal' };
  }
  
  // If family member, try family pool
  if (isFamilyMember || planType === 'family') {
    const familyResult = borrowFromFamilyPool(state);
    if (familyResult.success) {
      saveStreakFreezeState(familyResult.newState);
      return { streakPreserved: true, freezeUsed: true, source: 'family_pool' };
    }
  }
  
  // No freezes available, streak is lost
  return { streakPreserved: false, freezeUsed: false, source: null };
}

/**
 * Record activity for streak tracking
 */
export function recordActivity(): void {
  setItem(LAST_ACTIVITY_KEY, new Date().toISOString());
}

/**
 * Initialize streak freeze system for a new month if needed
 */
export function initializeMonthlyFreezes(planType: 'free' | 'solo' | 'family'): void {
  const state = getStreakFreezeState();
  const newState = grantMonthlyFreezes(state, planType);
  if (newState !== state) {
    saveStreakFreezeState(newState);
  }
}
