'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLevelFromXP, LEVEL_NAMES } from '@/lib/utils';

interface UserState {
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  name: string;
  age: number;
  income: number;
  avatarState: string;
  isOnboarded: boolean;
  addXP: (amount: number, reason?: string) => void;
  setName: (n: string) => void;
  setAge: (a: number) => void;
  setIncome: (i: number) => void;
  setAvatarState: (s: string) => void;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserState | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [name, setNameState] = useState('');
  const [age, setAgeState] = useState(23);
  const [income, setIncomeState] = useState(18000);
  const [avatarState, setAvatarStateState] = useState('zero');
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('arthvo-user');
    if (saved) {
      const u = JSON.parse(saved);
      if (u.xp !== undefined) setXP(u.xp);
      if (u.streak !== undefined) setStreak(u.streak);
      if (u.name) setNameState(u.name);
      if (u.age) setAgeState(u.age);
      if (u.income) setIncomeState(u.income);
      if (u.avatarState) setAvatarStateState(u.avatarState);
      if (u.isOnboarded) setIsOnboarded(u.isOnboarded);
    }
    // streak logic
    const lastActive = localStorage.getItem('arthvo-last-active');
    const today = new Date().toDateString();
    if (lastActive !== today) {
      localStorage.setItem('arthvo-last-active', today);
    }
  }, []);

  const save = (partial: Record<string, unknown>) => {
    const current = JSON.parse(localStorage.getItem('arthvo-user') || '{}');
    localStorage.setItem('arthvo-user', JSON.stringify({ ...current, ...partial }));
  };

  const addXP = (amount: number) => {
    setXP(prev => {
      const next = prev + amount;
      save({ xp: next });
      return next;
    });
  };

  const level = getLevelFromXP(xp);
  const levelName = LEVEL_NAMES[level];

  return (
    <UserContext.Provider value={{
      xp, level, levelName, streak, name, age, income, avatarState, isOnboarded,
      addXP,
      setName: (n) => { setNameState(n); save({ name: n }); },
      setAge: (a) => { setAgeState(a); save({ age: a }); },
      setIncome: (i) => { setIncomeState(i); save({ income: i }); },
      setAvatarState: (s) => { setAvatarStateState(s); save({ avatarState: s }); },
      completeOnboarding: () => { setIsOnboarded(true); save({ isOnboarded: true }); },
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
