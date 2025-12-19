"use client";

import { useRouter } from 'next/navigation';
import { GoalSelectionScreen } from '@/components/onboarding/GoalSelectionScreen';
import { useApp, setLocalStorage } from '@/context/AppContext';

export default function GoalPage() {
  const router = useRouter();
  const { userType } = useApp();

  const handleComplete = (goal: string) => {
    setLocalStorage('thinkfirst_userGoal', goal);
    router.push('/onboarding/methodology');
  };

  return <GoalSelectionScreen onComplete={handleComplete} userType={userType || 'student'} />;
}
