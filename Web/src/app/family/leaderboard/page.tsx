"use client";

import { useRouter } from 'next/navigation';
import { FamilyLeaderboard } from '@/components/family/FamilyLeaderboard';

export default function LeaderboardPage() {
  const router = useRouter();
  return <FamilyLeaderboard onBack={() => router.push('/family/dashboard')} />;
}
