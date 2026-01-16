"use client";

import { useRouter } from 'next/navigation';
import { DifficultyFrictionDemo } from '@/components/shared/DifficultyFrictionDemo';

export default function FrictionDemoPage() {
  const router = useRouter();
  return <DifficultyFrictionDemo onBack={() => router.push('/family/guardian-settings')} />;
}
