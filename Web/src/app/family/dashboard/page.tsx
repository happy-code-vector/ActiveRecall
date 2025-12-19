"use client";

import { useRouter } from 'next/navigation';
import { ParentDashboard } from '@/components/family/ParentDashboard';
import { useApp } from '@/context/AppContext';

export const dynamic = 'force-dynamic';

export default function FamilyDashboardPage() {
  const router = useRouter();
  const { userId, streak } = useApp();

  return (
    <ParentDashboard
      onBack={() => router.push('/home')}
      userId={userId}
      streak={streak}
      onAddStudent={() => router.push('/family/add-student')}
      onViewLeaderboard={() => router.push('/family/leaderboard')}
    />
  );
}
