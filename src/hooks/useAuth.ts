import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { signInWithGoogle, signUpWithEmail, signInWithEmail, logOut, onAuthChange, getOrCreateProfile, updateProfile, isConfigured, type UserProfile } from '../firebase';

interface UseAuthReturn {
  user: User | null;
  profile: UserProfile | null;
  isSignedIn: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  signIn: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await getOrCreateProfile(firebaseUser);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    const result = await signInWithGoogle();
    if (result) {
      const p = await getOrCreateProfile(result);
      setProfile(p);
    }
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result) {
      const p = await getOrCreateProfile(result);
      setProfile(p);
    }
  }, []);

  const signUpEmail = useCallback(async (email: string, password: string, displayName: string) => {
    const result = await signUpWithEmail(email, password, displayName);
    if (result) {
      const p = await getOrCreateProfile(result);
      setProfile(p);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await logOut();
    setProfile(null);
  }, []);

  const updateAvatar = useCallback(async (avatar: string) => {
    if (profile) {
      await updateProfile(profile.uid, { avatar });
      setProfile(prev => prev ? { ...prev, avatar } : null);
    }
  }, [profile]);

  const updateDisplayName = useCallback(async (name: string) => {
    if (profile) {
      await updateProfile(profile.uid, { displayName: name });
      setProfile(prev => prev ? { ...prev, displayName: name } : null);
    }
  }, [profile]);

  return {
    user,
    profile,
    isSignedIn: !!user,
    isLoading,
    isFirebaseConfigured: isConfigured,
    signIn,
    signInEmail,
    signUpEmail,
    signOutUser,
    updateAvatar,
    updateDisplayName,
  };
}
