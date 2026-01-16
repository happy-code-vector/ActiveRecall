"use client";

import { useRouter } from 'next/navigation';
import { HistoryScreen } from '@/components/progress/HistoryScreen';
import { useApp } from '@/context/AppContext';
import { getSubscriptionStatus, incrementQuestionCount } from '@/utils/subscription';

export default function HistoryPage() {
  const router = useRouter();
  const { 
    userId, 
    setQuestion, 
    setAttempt, 
    setEvaluation, 
    setIsRevisionMode,
    setUpgradePromptFeature,
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

  return (
    <HistoryScreen
      userId={userId}
      onBack={() => router.push('/home')}
      onRetry={startNewQuestion}
      onGoToHome={() => router.push('/home')}
      onGoToProgress={() => router.push('/progress')}
      onGoToHistory={() => router.push('/history')}
      onGoToTechniques={() => router.push('/techniques')}
      onGoToParentDashboard={() => router.push('/family/dashboard')}
    />
  );
}
