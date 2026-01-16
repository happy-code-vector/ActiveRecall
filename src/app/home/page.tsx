"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HomeScreen } from '@/components/home/HomeScreen';
import { useApp, setLocalStorage } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { incrementQuestionCount } from '@/utils/supabase/profile';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    subscriptionStatus,
    streak, 
    setQuestion, 
    setAttempt, 
    setEvaluation, 
    setIsRevisionMode,
    setUpgradePromptFeature,
    nudgeNotifications,
    setNudgeNotifications,
    isHydrated,
  } = useApp();

  // Redirect to login if not authenticated after loading completes
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No authenticated user, redirecting to login');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Show loading state while auth is being checked or app is hydrating
  if (authLoading || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Don't render home screen if not authenticated
  if (!user) {
    return null;
  }

  const startNewQuestion = async (q: string) => {
    if (!subscriptionStatus.canAskQuestions) {
      setUpgradePromptFeature('questions');
      return;
    }
    if (!subscriptionStatus.isPremium) {
      await incrementQuestionCount();
    }
    setQuestion(q);
    setAttempt('');
    setEvaluation(null);
    setIsRevisionMode(false);
    router.push('/learn/attempt');
  };

  const handleNudgeMember = (_memberId: string, _memberName: string) => {
    const newNotification = {
      id: crypto.randomUUID(),
      fromName: "You",
      timestamp: Date.now(),
    };
    const updated = [...nudgeNotifications, newNotification];
    setNudgeNotifications(updated);
    setLocalStorage('thinkfirst_nudgeNotifications', JSON.stringify(updated));
  };

  return (
    <HomeScreen
      onStartQuestion={startNewQuestion}
      onGoToProgress={() => router.push('/progress')}
      onGoToHistory={() => router.push('/history')}
      onGoToPricing={() => router.push('/pricing')}
      onGoToProfile={() => router.push('/profile')}
      onGoToTechniques={() => router.push('/techniques')}
      onNudgeMember={handleNudgeMember}
    />
  );
}
