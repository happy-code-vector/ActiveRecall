"use client";

import { useRouter } from 'next/navigation';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { ParentProfileScreen } from '@/components/profile/ParentProfileScreen';
import { useApp } from '@/context/AppContext';

export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const router = useRouter();
  const { userType, userId, streak, setUserType } = useApp();

  const handleLogout = () => {
    setUserType(null);
    router.push('/');
  };

  if (userType === 'parent') {
    return (
      <ParentProfileScreen
        onBack={() => router.push('/home')}
        onUpgrade={() => router.push('/pricing')}
        userId={userId}
        onGoToHome={() => router.push('/home')}
        onGoToProgress={() => router.push('/progress')}
        onGoToHistory={() => router.push('/history')}
        onGoToTechniques={() => router.push('/techniques')}
        onGoToParentDashboard={() => router.push('/family/dashboard')}
        onGoToSettings={() => router.push('/settings')}
        onGoToGuardianSettings={() => router.push('/family/guardian-settings')}
        onGoToLeaderboard={() => router.push('/family/leaderboard')}
        streak={streak}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <ProfileScreen
      onBack={() => router.push('/home')}
      onUpgrade={() => router.push('/pricing')}
      userId={userId}
      onShowAnimations={() => router.push('/animations')}
      onGoToHome={() => router.push('/home')}
      onGoToProgress={() => router.push('/progress')}
      onGoToHistory={() => router.push('/history')}
      onGoToTechniques={() => router.push('/techniques')}
      onGoToParentDashboard={undefined}
      onGoToSettings={() => router.push('/settings')}
      onGoToGuardianSettings={undefined}
      onConnectParent={() => router.push('/profile/connect-parent')}
      onShowBadges={() => router.push('/badges')}
      streak={streak}
      onLogout={handleLogout}
    />
  );
}
