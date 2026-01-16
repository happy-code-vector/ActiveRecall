"use client";

import { useRouter } from 'next/navigation';
import { PricingScreen } from '@/components/pricing/PricingScreen';
import { setLocalStorage } from '@/context/AppContext';

export default function PricingPage() {
  const router = useRouter();

  const handleStartTrial = (plan: 'solo' | 'family') => {
    setLocalStorage('thinkfirst_premium', 'true');
    setLocalStorage('thinkfirst_plan', plan);
    router.push('/home');
  };

  const handleCreateFamilyAccount = () => {
    setLocalStorage('thinkfirst_premium', 'true');
    setLocalStorage('thinkfirst_plan', 'family');
    router.push('/home');
  };

  return (
    <PricingScreen
      onBack={() => router.push('/home')}
      onStartTrial={handleStartTrial}
      onStayFree={() => router.push('/home')}
      onCreateFamilyAccount={handleCreateFamilyAccount}
    />
  );
}
