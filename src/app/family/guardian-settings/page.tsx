"use client";

import { useRouter } from 'next/navigation';
import { GuardianSettings } from '@/components/family/GuardianSettings';

export default function GuardianSettingsPage() {
  const router = useRouter();

  return (
    <GuardianSettings
      onBack={() => router.push('/profile')}
      onUpgrade={() => router.push('/pricing')}
      onShowDemo={() => router.push('/family/friction-demo')}
      onShowWeeklyReport={() => router.push('/family/weekly-report')}
    />
  );
}
