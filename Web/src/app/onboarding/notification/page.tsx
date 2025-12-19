"use client";

import { useRouter } from 'next/navigation';
import { NotificationPermissionScreen } from '@/components/onboarding/NotificationPermissionScreen';
import { useApp, setLocalStorage } from '@/context/AppContext';

export default function NotificationPage() {
  const router = useRouter();
  const { isViewingOnboarding, setIsViewingOnboarding } = useApp();

  const handleEnable = () => {
    setLocalStorage('thinkfirst_notificationEnabled', 'true');
    if (isViewingOnboarding) {
      setIsViewingOnboarding(false);
      router.push('/home');
    } else {
      router.push('/login');
    }
  };

  const handleSkip = () => {
    setLocalStorage('thinkfirst_notificationEnabled', 'false');
    if (isViewingOnboarding) {
      setIsViewingOnboarding(false);
      router.push('/home');
    } else {
      router.push('/login');
    }
  };

  return <NotificationPermissionScreen onEnable={handleEnable} onSkip={handleSkip} />;
}
