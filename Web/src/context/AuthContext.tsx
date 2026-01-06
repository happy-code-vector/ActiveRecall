"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User, Session } from '@/utils/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Handle email confirmation and profile setup
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          console.log('User signed in:', session.user.email);
          // Save pending profile data if available
          await savePendingProfileData(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to save pending profile data after signup
  const savePendingProfileData = async (userId: string) => {
    try {
      const pendingDisplayName = localStorage.getItem('thinkfirst_pendingDisplayName');
      const pendingAvatarBase64 = localStorage.getItem('thinkfirst_pendingAvatar');
      const pendingAvatarType = localStorage.getItem('thinkfirst_pendingAvatarType');
      
      if (!pendingDisplayName) return;

      const updates: any = {
        display_name: pendingDisplayName,
      };

      // Handle avatar upload if present
      if (pendingAvatarBase64 && pendingAvatarType) {
        try {
          // Convert base64 to blob
          const response = await fetch(pendingAvatarBase64);
          const blob = await response.blob();
          
          // Upload to Supabase storage
          const fileName = `avatar-${userId}-${Date.now()}.${pendingAvatarType.split('/')[1]}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
              contentType: pendingAvatarType,
              upsert: true
            });

          if (uploadError) {
            console.error('Avatar upload error:', uploadError);
          } else {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            
            updates.avatar_url = publicUrl;
          }
        } catch (avatarError) {
          console.error('Error processing avatar:', avatarError);
        }
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError);
      } else {
        console.log('Profile updated successfully');
        // Clean up temporary data
        localStorage.removeItem('thinkfirst_pendingDisplayName');
        localStorage.removeItem('thinkfirst_pendingAvatar');
        localStorage.removeItem('thinkfirst_pendingAvatarType');
        localStorage.removeItem('thinkfirst_pendingAvatarUrl');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signUp,
      signIn,
      signInWithMagicLink,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
