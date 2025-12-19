"use client";

import { useRouter } from 'next/navigation';
import { HomeScreen } from '@/components/home/HomeScreen';
import { useApp, setLocalStorage } from '@/context/AppContext';
import { getSubscriptionStatus, incrementQuestionCount } from '@/utils/subscription';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const router = useRouter();
  const { 
    streak, 
    setQuestion, 
    setAttempt, 
    setEvaluation, 
    setIsRevisionMode,
    setUpgradePromptFeature,
    nudgeNotifications,
    setNudgeNotifications,
  } = useApp();

  const startNewQuestion = (q: string) => {
    const status = getSubscriptionStatus();
    if (!status.canAskQuestions) {
      setUpgradePromptFeature('questions');
      return;
    }
    if (!status.isPremium) {
      incrementQuestionCount();
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
      onGoToParentDashboard={() => router.push('/family/dashboard')}
      streak={streak}
      onGoToProfile={() => router.push('/profile')}
      onGoToTechniques={() => router.push('/techniques')}
      onLogin={() => router.push('/login')}
      onNudgeMember={handleNudgeMember}
    />
  );
}
