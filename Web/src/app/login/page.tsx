"use client";

import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useApp, markOnboardingComplete } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { isViewingOnboarding, setIsViewingOnboarding } = useApp();

  const handleSubmit = (_email: string, _password: string) => {
    if (!isViewingOnboarding) {
      markOnboardingComplete();
    }
    setIsViewingOnboarding(false);
    router.push('/home');
  };

  const handleSocialLogin = (_provider: 'apple' | 'google') => {
    if (!isViewingOnboarding) {
      markOnboardingComplete();
    }
    setIsViewingOnboarding(false);
    router.push('/home');
  };

  return (
    <LoginScreen
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
      onRestorePurchases={() => console.log('Restore purchases requested')}
    />
  );
}
