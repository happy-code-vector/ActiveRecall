"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { supabase } from '@/utils/supabase/client';
import { 
  getStreakFreezeState, 
  consumeFreeze, 
  grantMonthlyFreezes, 
  wasDayMissed,
  saveStreakFreezeState,
  type StreakFreezeState 
} from '@/utils/streakFreeze';
import {
  UserProfile,
  fetchUserProfile,
  updateUserProfile,
  getSubscriptionStatusFromProfile,
  SubscriptionStatus,
  PlanType,
} from '@/utils/supabase/profile';

export interface Evaluation {
  effort_score: number;
  understanding_score: number;
  copied: boolean;
  what_is_right: string;
  what_is_missing: string;
  coach_hint?: string;
  level_up_tip?: string;
  unlock: boolean;
  full_explanation: string;
}

export interface StreakData {
  count: number;
  lastDate: string | null;
  freezeUsedToday?: boolean;
}

export type DifficultyLevel = 'base' | 'mid' | 'mastery';

export interface NudgeNotification {
  id: string;
  fromName: string;
  timestamp: number;
}

// Helper to safely access localStorage (SSR-safe)
export const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

export const hasCompletedOnboarding = (): boolean => {
  return getLocalStorage('thinkfirst_onboardingComplete') === 'true';
};

export const markOnboardingComplete = (): void => {
  setLocalStorage('thinkfirst_onboardingComplete', 'true');
};

interface AppContextType {
  // User state
  userType: 'student' | 'parent' | null;
  setUserType: (type: 'student' | 'parent' | null) => void;
  userId: string;
  isAuthenticated: boolean;
  
  // Profile & Subscription (from Supabase)
  profile: UserProfile | null;
  subscriptionStatus: SubscriptionStatus;
  gradeLevel: string;
  plan: PlanType;
  refreshProfile: () => Promise<void>;
  updateProfileField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => Promise<boolean>;
  
  // Learning state
  question: string;
  setQuestion: (q: string) => void;
  attempt: string;
  setAttempt: (a: string) => void;
  evaluation: Evaluation | null;
  setEvaluation: (e: Evaluation | null) => void;
  isRevisionMode: boolean;
  setIsRevisionMode: (mode: boolean) => void;
  
  // Streak & limits
  streak: StreakData;
  loadStreak: () => Promise<void>;
  dailyUnlockCount: number;
  setDailyUnlockCount: React.Dispatch<React.SetStateAction<number>>;
  
  // Notifications
  nudgeNotifications: NudgeNotification[];
  setNudgeNotifications: React.Dispatch<React.SetStateAction<NudgeNotification[]>>;
  
  // Modals
  showLimitModal: boolean;
  setShowLimitModal: (show: boolean) => void;
  upgradePromptFeature: 'voice' | 'mastery' | 'coach' | 'badges' | 'stats' | 'questions' | null;
  setUpgradePromptFeature: (feature: 'voice' | 'mastery' | 'coach' | 'badges' | 'stats' | 'questions' | null) => void;
  
  // Badge state
  newlyUnlockedBadges: string[];
  setNewlyUnlockedBadges: (badges: string[]) => void;
  currentBadgeIndex: number;
  setCurrentBadgeIndex: (index: number) => void;
  showBadgeModal: boolean;
  setShowBadgeModal: (show: boolean) => void;
  
  // Onboarding
  isViewingOnboarding: boolean;
  setIsViewingOnboarding: (viewing: boolean) => void;
  
  // Hydration
  isHydrated: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userType, setUserTypeState] = useState<'student' | 'parent' | null>(null);
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [question, setQuestion] = useState('');
  const [attempt, setAttempt] = useState('');
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastDate: null });
  const [dailyUnlockCount, setDailyUnlockCount] = useState(0);
  const [nudgeNotifications, setNudgeNotifications] = useState<NudgeNotification[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [upgradePromptFeature, setUpgradePromptFeature] = useState<'voice' | 'mastery' | 'coach' | 'badges' | 'stats' | 'questions' | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [isViewingOnboarding, setIsViewingOnboarding] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [streakFreezeState, setStreakFreezeState] = useState<StreakFreezeState | null>(null);

  // Derived values from profile
  const subscriptionStatus = getSubscriptionStatusFromProfile(profile);
  const gradeLevel = profile?.grade_level ?? 'college';
  const plan = profile?.plan ?? 'free';

  // Refresh profile from Supabase
  const refreshProfile = useCallback(async () => {
    const profileData = await fetchUserProfile();
    if (profileData) {
      setProfile(profileData);
      setUserTypeState(profileData.user_type);
    }
  }, []);

  // Update a single profile field
  const updateProfileField = useCallback(async <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ): Promise<boolean> => {
    const updated = await updateUserProfile({ [field]: value });
    if (updated) {
      setProfile(updated);
      return true;
    }
    return false;
  }, []);

  const setUserType = useCallback(async (type: 'student' | 'parent' | null) => {
    setUserTypeState(type);
    if (type && isAuthenticated) {
      // Sync to Supabase
      await updateUserProfile({ user_type: type });
    }
    // Also keep localStorage for unauthenticated fallback
    if (type) {
      setLocalStorage('thinkfirst_userType', type);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('thinkfirst_userType');
    }
  }, [isAuthenticated]);

  const loadStreak = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0e3c496/streak/${userId}`,
        { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.lastDate) {
          const lastDate = new Date(data.lastDate);
          const now = new Date();
          if (wasDayMissed(lastDate, now)) {
            const currentFreezeState = getStreakFreezeState();
            if (currentFreezeState && currentFreezeState.personalFreezes > 0) {
              const result = consumeFreeze(currentFreezeState);
              if (result.success) {
                setStreakFreezeState(result.newState);
                saveStreakFreezeState(result.newState);
                setStreak({ ...data, freezeUsedToday: true });
              } else {
                setStreak({ count: 0, lastDate: null });
              }
            } else {
              setStreak({ count: 0, lastDate: null });
            }
          } else {
            setStreak(data);
          }
        } else {
          setStreak(data);
        }
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  }, [userId]);

  // Hydrate from Supabase auth and profile
  useEffect(() => {
    const initializeUser = async () => {
      // Try to get user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        setIsAuthenticated(true);
        
        // Fetch profile from Supabase
        const profileData = await fetchUserProfile();
        if (profileData) {
          setProfile(profileData);
          setUserTypeState(profileData.user_type);
        }
      } else {
        // Fallback for unauthenticated users (demo mode)
        setIsAuthenticated(false);
        
        const storedUserType = getLocalStorage('thinkfirst_userType');
        if (storedUserType) {
          setUserTypeState(storedUserType as 'student' | 'parent');
        }
        
        let storedUserId = getLocalStorage('thinkfirst_userId');
        if (!storedUserId) {
          storedUserId = crypto.randomUUID();
          setLocalStorage('thinkfirst_userId', storedUserId);
        }
        setUserId(storedUserId);
      }

      // Load other localStorage data
      const storedUnlocks = getLocalStorage('thinkfirst_dailyUnlocks');
      if (storedUnlocks) {
        const data = JSON.parse(storedUnlocks);
        const today = new Date().toDateString();
        if (data.date === today) {
          setDailyUnlockCount(data.count || 0);
        }
      }

      const storedNotifications = getLocalStorage('thinkfirst_nudgeNotifications');
      if (storedNotifications) {
        setNudgeNotifications(JSON.parse(storedNotifications));
      }

      const freezeState = getStreakFreezeState();
      setStreakFreezeState(freezeState);
      
      const today = new Date();
      const lastGrantDate = getLocalStorage('thinkfirst_lastFreezeGrant');
      const lastGrantMonth = lastGrantDate ? new Date(lastGrantDate).getMonth() : -1;
      
      if (lastGrantMonth !== today.getMonth()) {
        const isPremium = profile?.is_premium ?? getLocalStorage('thinkfirst_premium') === 'true';
        const planType = profile?.plan ?? (getLocalStorage('thinkfirst_plan') as 'solo' | 'family' | null) ?? 'free';
        const updatedState = grantMonthlyFreezes(freezeState, isPremium ? planType : 'free');
        setStreakFreezeState(updatedState);
        saveStreakFreezeState(updatedState);
        setLocalStorage('thinkfirst_lastFreezeGrant', today.toISOString());
      }

      setIsHydrated(true);
    };

    initializeUser();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setUserId(user.id);
            setIsAuthenticated(true);
            await refreshProfile();
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAuthenticated(false);
          // Fallback to localStorage userId
          let storedUserId = getLocalStorage('thinkfirst_userId');
          if (!storedUserId) {
            storedUserId = crypto.randomUUID();
            setLocalStorage('thinkfirst_userId', storedUserId);
          }
          setUserId(storedUserId);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  useEffect(() => {
    if (userId) {
      loadStreak();
    }
  }, [userId, loadStreak]);

  return (
    <AppContext.Provider value={{
      userType, setUserType, userId, isAuthenticated,
      profile, subscriptionStatus, gradeLevel, plan, refreshProfile, updateProfileField,
      question, setQuestion, attempt, setAttempt,
      evaluation, setEvaluation, isRevisionMode, setIsRevisionMode,
      streak, loadStreak, dailyUnlockCount, setDailyUnlockCount,
      nudgeNotifications, setNudgeNotifications,
      showLimitModal, setShowLimitModal,
      upgradePromptFeature, setUpgradePromptFeature,
      newlyUnlockedBadges, setNewlyUnlockedBadges,
      currentBadgeIndex, setCurrentBadgeIndex,
      showBadgeModal, setShowBadgeModal,
      isViewingOnboarding, setIsViewingOnboarding,
      isHydrated,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
