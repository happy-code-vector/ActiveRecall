import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import { 
  UserProfile, 
  fetchUserProfile, 
  updateUserProfile,
  getSubscriptionStatusFromProfile,
  SubscriptionStatus
} from '@/utils/supabase/profile';

interface UseUserProfileReturn {
  profile: UserProfile | null;
  subscriptionStatus: SubscriptionStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        const profileData = await fetchUserProfile();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load profile'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfileHandler = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    const updated = await updateUserProfile(updates);
    if (updated) {
      setProfile(updated);
      return true;
    }
    return false;
  }, []);

  // Initial load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadProfile();
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const subscriptionStatus = getSubscriptionStatusFromProfile(profile);

  return {
    profile,
    subscriptionStatus,
    isLoading,
    isAuthenticated,
    error,
    refetch: loadProfile,
    updateProfile: updateProfileHandler,
  };
}
