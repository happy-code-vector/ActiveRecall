"use client";

import { useRouter } from 'next/navigation';
import { AnimationShowcase } from '@/components/shared/AnimationShowcase';

export default function AnimationsPage() {
  const router = useRouter();
  return <AnimationShowcase onBack={() => router.push('/profile')} />;
}
