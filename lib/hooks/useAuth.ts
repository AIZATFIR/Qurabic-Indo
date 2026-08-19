'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('qurabic_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading user from localStorage', e);
    }
  }, []);

  const loginWithGoogle = (emailName?: string) => {
    const name = emailName || 'Pengguna Qurabic';
    const email = `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    const newUser: UserProfile = {
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    };
    setUser(newUser);
    try {
      localStorage.setItem('qurabic_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('qurabic_user');
    } catch (e) {
      console.error(e);
    }
  };

  return { user, loginWithGoogle, logout };
}
