"use client";

import { useRouter } from 'next/navigation';
import { AnswerScreen } from '@/components/learning/AnswerScreen';
import { useApp } from '@/context/AppContext';
import { getSubscriptionStatus, incrementQuestionCount } from '@/utils/subscription';

export default function AnswerPage() {
  const router = useRouter();
  const { 
    question, 
    attempt, 
    evaluation, 
    streak,
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

  if (!evaluation) {
    return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <AnswerScreen
      question={question}
      attempt={attempt}
      evaluation={evaluation}
      onHome={() => router.push('/home')}
      onNewQuestion={startNewQuestion}
      streak={streak}
    />
  );
}
