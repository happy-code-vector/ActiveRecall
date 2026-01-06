"use client";

import { useRouter } from 'next/navigation';
import { AttemptGate } from '@/components/learning/AttemptGate';
import { useApp, getLocalStorage } from '@/context/AppContext';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export const dynamic = 'force-dynamic';

export default function AttemptPage() {
  const router = useRouter();
  const { 
    question, 
    attempt, 
    evaluation,
    isRevisionMode, 
    setAttempt, 
    setEvaluation,
    setUpgradePromptFeature,
    userId,
    loadStreak,
    setNewlyUnlockedBadges,
    setCurrentBadgeIndex,
    setShowBadgeModal,
  } = useApp();

  const submitAttempt = async (userAttempt: string, masteryMode: boolean = false) => {
    setAttempt(userAttempt);
    router.push('/learn/evaluation');

    const gradeLevel = getLocalStorage('thinkfirst_userGrade') || 'college';

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/evaluate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question, attempt: userAttempt, userId, masteryMode, gradeLevel }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Evaluation failed');
      }

      const evalData = await response.json();
      if (evalData.error) throw new Error(evalData.error);
      
      setEvaluation(evalData);

      if (evalData.unlock) {
        await loadStreak();
        try {
          const badgeResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/badges/${userId}/check`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (badgeResponse.ok) {
            const badgeData = await badgeResponse.json();
            if (badgeData.newBadges?.length > 0) {
              setNewlyUnlockedBadges(badgeData.newBadges);
              setCurrentBadgeIndex(0);
              setShowBadgeModal(true);
            }
          }
        } catch (e) {
          console.error('Error checking badges:', e);
        }
      }
    } catch (error) {
      console.error('Error evaluating attempt:', error);
      let errorMessage = 'We encountered an error evaluating your attempt.';
      let errorDetail = 'Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('OPENAI_API_KEY')) {
          errorMessage = 'OpenAI API key is not configured.';
          errorDetail = 'Please add your OPENAI_API_KEY to Supabase secrets.';
        } else {
          errorDetail = error.message;
        }
      }
      setEvaluation({
        effort_score: 0, understanding_score: 0, copied: false,
        what_is_right: errorMessage, what_is_missing: errorDetail,
        unlock: false, full_explanation: '',
      });
    }
  };

  const handleRevealAnswer = () => {
    setEvaluation({
      effort_score: 0, understanding_score: 0, copied: false,
      what_is_right: 'No attempt provided.',
      what_is_missing: 'Everything - you skipped the attempt.',
      unlock: true,
      full_explanation: 'Since you chose to reveal the answer without attempting, here it is...',
    });
    router.push('/learn/answer');
  };

  return (
    <AttemptGate
      question={question}
      onSubmit={submitAttempt}
      onBack={() => router.push('/home')}
      previousAttempt={isRevisionMode ? attempt : undefined}
      coachHint={isRevisionMode && evaluation ? evaluation.coach_hint : undefined}
      onShowUpgradePrompt={setUpgradePromptFeature}
      onRevealAnswer={handleRevealAnswer}
    />
  );
}
