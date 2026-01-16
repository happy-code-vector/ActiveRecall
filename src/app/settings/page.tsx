"use client";

import { useRouter } from 'next/navigation';
import { SettingsScreen } from '@/components/profile/SettingsScreen';
import { useApp, setLocalStorage } from '@/context/AppContext';

export default function SettingsPage() {
  const router = useRouter();
  const { setUserType, setIsViewingOnboarding } = useApp();

  const handleLogOut = () => {
    setUserType(null);
    router.push('/');
  };

  const handleViewOnboarding = () => {
    setIsViewingOnboarding(true);
    router.push('/');
  };

  return (
    <SettingsScreen
      onBack={() => router.push('/profile')}
      onManagePlan={() => router.push('/pricing')}
      onRestorePurchases={() => console.log('Restore purchases requested')}
      onToggleNotifications={(enabled) => setLocalStorage('thinkfirst_notificationEnabled', enabled.toString())}
      onEditEmail={() => console.log('Edit email requested')}
      onEditPassword={() => console.log('Edit password requested')}
      onLogOut={handleLogOut}
      onDeleteAccount={() => console.log('Delete account requested')}
      onViewOnboarding={handleViewOnboarding}
    />
  );
}
