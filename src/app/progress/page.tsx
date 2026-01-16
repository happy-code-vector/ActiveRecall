"use client";

import { useRouter } from 'next/navigation';
import { ProgressScreen } from '@/components/progress/ProgressScreen';
import { useApp } from '@/context/AppContext';

export default function ProgressPage() {
  const router = useRouter();
  const { userId, streak } = useApp();

  return (
    <ProgressScreen
      userId={userId}
      streak={streak}
      onBack={() => router.push('/home')}
      onGoToHome={() => router.push('/home')}
      onGoToProgress={() => router.push('/progress')}
      onGoToHistory={() => router.push('/history')}
      onGoToTechniques={() => router.push('/techniques')}
      onGoToParentDashboard={() => router.push('/family/dashboard')}
    />
  );
}
