'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  uid?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Listen to real Firebase auth state changes if configured
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const profile: UserProfile = {
            name: firebaseUser.displayName || 'Pengguna Qurabic',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.displayName || 'Qurabic')}`,
            uid: firebaseUser.uid
          };
          setUser(profile);
          try {
            localStorage.setItem('qurabic_user', JSON.stringify(profile));
          } catch (e) {}
        } else {
          try {
            const stored = localStorage.getItem('qurabic_user');
            if (stored) {
              setUser(JSON.parse(stored));
            } else {
              setUser(null);
            }
          } catch (e) {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local Storage profile mode
      try {
        const stored = localStorage.getItem('qurabic_user');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    if (isFirebaseConfigured) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const profile: UserProfile = {
          name: fbUser.displayName || 'Pengguna Google',
          email: fbUser.email || '',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.displayName || 'GoogleUser')}`,
          uid: fbUser.uid
        };
        setUser(profile);
        localStorage.setItem('qurabic_user', JSON.stringify(profile));
        return profile;
      } catch (err: any) {
        console.warn('Firebase Sign-In popup notice:', err?.message || err);
      }
    }

    // Fallback seamless profile login for offline / local mode
    const fallbackProfile: UserProfile = {
      name: 'Pengguna Qurabic',
      email: 'user@qurabic.id',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QurabicUser',
      uid: `local-${Date.now()}`
    };
    setUser(fallbackProfile);
    localStorage.setItem('qurabic_user', JSON.stringify(fallbackProfile));
    return fallbackProfile;
  };

  const loginWithCustomName = (nameInput: string) => {
    const name = nameInput.trim() || 'Pengguna Qurabic';
    const profile: UserProfile = {
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@qurabic.id`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      uid: `custom-${Date.now()}`
    };
    setUser(profile);
    localStorage.setItem('qurabic_user', JSON.stringify(profile));
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }
    setUser(null);
    localStorage.removeItem('qurabic_user');
  };

  return { user, loading, authError, loginWithGoogle, loginWithCustomName, logout };
}
