"use client";

import { useRouter } from 'next/navigation';
import { BadgesScreen } from '@/components/badges/BadgesScreen';
import { useApp } from '@/context/AppContext';

export default function BadgesPage() {
  const router = useRouter();
  const { userId } = useApp();

  return <BadgesScreen userId={userId} onBack={() => router.push('/profile')} />;
}
