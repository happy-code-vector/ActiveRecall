"use client";

import { useRouter } from 'next/navigation';
import { ParentPlanDetails } from '@/components/family/ParentPlanDetails';
import { setLocalStorage } from '@/context/AppContext';

export default function PlanDetailsPage() {
  const router = useRouter();

  const handleCreateAccount = () => {
    setLocalStorage('thinkfirst_premium', 'true');
    setLocalStorage('thinkfirst_plan', 'family');
    router.push('/home');
  };

  return (
    <ParentPlanDetails
      onBack={() => router.push('/home')}
      onCreateAccount={handleCreateAccount}
    />
  );
}
