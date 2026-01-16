"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/onboarding/SplashScreen';
import { hasCompletedOnboarding, useApp } from '@/context/AppContext';

export default function Page() {
  const router = useRouter();
  const { isHydrated, isViewingOnboarding } = useApp();

  useEffect(() => {
    if (isHydrated && !isViewingOnboarding && hasCompletedOnboarding()) {
      router.replace('/home');
    }
  }, [isHydrated, isViewingOnboarding, router]);

  if (!isHydrated) {
    return <div className="min-h-screen bg-[#121212]" />;
  }

  return <SplashScreen onGetStarted={() => router.push('/onboarding/account-type')} />;
}
