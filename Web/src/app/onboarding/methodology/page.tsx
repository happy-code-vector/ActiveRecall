"use client";

import { useRouter } from 'next/navigation';
import { MethodologyScreen } from '@/components/onboarding/MethodologyScreen';

export default function MethodologyPage() {
  const router = useRouter();
  return <MethodologyScreen onComplete={() => router.push('/onboarding/try-it')} />;
}
