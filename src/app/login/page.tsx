"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { useApp, markOnboardingComplete } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isViewingOnboarding, setIsViewingOnboarding } = useApp();
  const { user, isLoading, signIn, signUp, signInWithMagicLink, resetPassword } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/home');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (email: string, password: string, mode: 'login' | 'signup') => {
    if (mode === 'signup') {
      return await signUp(email, password);
    } else {
      const result = await signIn(email, password);
      if (!result.error) {
        if (!isViewingOnboarding) {
          markOnboardingComplete();
        }
        setIsViewingOnboarding(false);
        router.push('/home');
      }
      return result;
    }
  };

  const handleMagicLink = async (email: string) => {
    return await signInWithMagicLink(email);
  };

  const handleForgotPassword = async (email: string) => {
    return await resetPassword(email);
  };

  const handleSocialLogin = (_provider: 'apple' | 'google') => {
    // TODO: Implement OAuth with Supabase
    console.log('Social login not yet implemented');
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LoginScreen
      onSubmit={handleSubmit}
      onMagicLink={handleMagicLink}
      onForgotPassword={handleForgotPassword}
      onSocialLogin={handleSocialLogin}
      onRestorePurchases={() => console.log('Restore purchases requested')}
    />
  );
}
