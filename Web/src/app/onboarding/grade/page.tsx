"use client";

import { useRouter } from 'next/navigation';
import { GradeSelectionScreen } from '@/components/onboarding/GradeSelectionScreen';
import { useApp, setLocalStorage } from '@/context/AppContext';

export default function GradePage() {
  const router = useRouter();
  const { userType } = useApp();

  const handleSelect = (grade: string) => {
    setLocalStorage('thinkfirst_userGrade', grade);
    router.push('/onboarding/goal');
  };

  return <GradeSelectionScreen onSelect={handleSelect} userType={userType || 'student'} />;
}
