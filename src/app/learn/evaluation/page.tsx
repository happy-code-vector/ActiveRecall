"use client";

import { useRouter } from 'next/navigation';
import { EvaluationScreen } from '@/components/learning/EvaluationScreen';
import { useApp, getLocalStorage } from '@/context/AppContext';

export default function EvaluationPage() {
  const router = useRouter();
  const { 
    question, 
    attempt, 
    evaluation, 
    isRevisionMode, 
    setIsRevisionMode,
    dailyUnlockCount,
    setDailyUnlockCount,
    setShowLimitModal,
  } = useApp();

  const unlockAnswer = () => {
    if (!getLocalStorage('thinkfirst_premium') && dailyUnlockCount >= 5) {
      setShowLimitModal(true);
      return;
    }

    setDailyUnlockCount(prev => {
      const newCount = prev + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem('thinkfirst_dailyUnlocks', JSON.stringify({
          date: new Date().toDateString(),
          count: newCount,
        }));
      }
      return newCount;
    });

    router.push('/learn/answer');
  };

  if (!evaluation) {
    return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <EvaluationScreen
      question={question}
      attempt={attempt}
      evaluation={evaluation}
      isRevisionMode={isRevisionMode}
      onUnlock={unlockAnswer}
      onRetry={() => {
        setIsRevisionMode(true);
        router.push('/learn/attempt');
      }}
      onHome={() => router.push('/home')}
    />
  );
}
