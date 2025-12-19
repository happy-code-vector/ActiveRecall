"use client";

import { useRouter } from 'next/navigation';
import { ConnectParentScreen } from '@/components/profile/ConnectParentScreen';
import { useApp, getLocalStorage } from '@/context/AppContext';

export default function ConnectParentPage() {
  const router = useRouter();
  const { userId } = useApp();

  return (
    <ConnectParentScreen
      onBack={() => router.push('/profile')}
      userId={userId}
      studentName={getLocalStorage('thinkfirst_userName') || undefined}
    />
  );
}
