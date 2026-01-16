"use client";

import { useRouter } from 'next/navigation';
import { TechniquesScreen } from '@/components/learning/TechniquesScreen';
import { useApp } from '@/context/AppContext';

export default function TechniquesPage() {
  const router = useRouter();
  const { streak, userType } = useApp();

  return (
    <TechniquesScreen
      onBack={() => router.push('/home')}
      onGoToHome={() => router.push('/home')}
      onGoToProgress={() => router.push('/progress')}
      onGoToHistory={() => router.push('/history')}
      onGoToTechniques={() => router.push('/techniques')}
      onGoToParentDashboard={userType === 'parent' ? () => router.push('/family/dashboard') : undefined}
      streak={streak}
    />
  );
}
