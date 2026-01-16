"use client";

import { useRouter } from 'next/navigation';
import { AccountTypeScreen } from '@/components/auth/AccountTypeScreen';
import { useApp } from '@/context/AppContext';

export default function AccountTypePage() {
  const router = useRouter();
  const { setUserType } = useApp();

  const handleSelect = (type: 'student' | 'parent') => {
    setUserType(type);
    if (type === 'student') {
      router.push('/onboarding/grade');
    } else {
      router.push('/onboarding/goal');
    }
  };

  return <AccountTypeScreen onSelect={handleSelect} />;
}
