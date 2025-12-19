"use client";

import { useRouter } from 'next/navigation';
import { TryItScreen } from '@/components/onboarding/TryItScreen';

export default function TryItPage() {
  const router = useRouter();
  return <TryItScreen onComplete={() => router.push('/onboarding/notification')} />;
}
