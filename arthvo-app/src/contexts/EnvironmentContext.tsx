'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dhoop' | 'raat' | 'jungle' | 'shahar' | 'mela';
export type Language = 'hi' | 'en' | 'ta' | 'te' | 'bn' | 'mr';
export type CoachPersonality = 'dost' | 'bhaiya' | 'mentor' | 'strict';
export type AvatarCharacter = 'arjun' | 'priya' | 'raza' | 'meera';
export type Terminology = 'simple' | 'standard' | 'expert';

interface EnvironmentState {
  theme: Theme;
  language: Language;
  coachPersonality: CoachPersonality;
  avatarCharacter: AvatarCharacter;
  terminology: Terminology;
  voiceEnabled: boolean;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  setCoachPersonality: (p: CoachPersonality) => void;
  setAvatarCharacter: (c: AvatarCharacter) => void;
  setTerminology: (t: Terminology) => void;
  setVoiceEnabled: (v: boolean) => void;
  save: (partial: Record<string, unknown>) => void;
}

const EnvironmentContext = createContext<EnvironmentState | null>(null);

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dhoop');
  const [language, setLangState] = useState<Language>('hi');
  const [coachPersonality, setCoachPersonality] = useState<CoachPersonality>('dost');
  const [avatarCharacter, setAvatarCharacter] = useState<AvatarCharacter>('arjun');
  const [terminology, setTerminology] = useState<Terminology>('simple');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    // Auto-detect browser language on first visit
    const saved = localStorage.getItem('arthvo-env');
    if (saved) {
      const env = JSON.parse(saved);
      if (env.theme) setThemeState(env.theme);
      if (env.language) setLangState(env.language);
      if (env.coachPersonality) setCoachPersonality(env.coachPersonality);
      if (env.avatarCharacter) setAvatarCharacter(env.avatarCharacter);
      if (env.terminology) setTerminology(env.terminology);
      if (typeof env.voiceEnabled === 'boolean') setVoiceEnabled(env.voiceEnabled);
    } else {
      // First visit: detect browser language
      const browserLang = navigator.language.slice(0, 2);
      const supported: Language[] = ['hi', 'en', 'mr', 'ta', 'te', 'bn'];
      if (supported.includes(browserLang as Language)) {
        setLangState(browserLang as Language);
      }
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    save({ theme: t });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const save = (partial: Record<string, unknown>) => {
    const current = JSON.parse(localStorage.getItem('arthvo-env') || '{}');
    localStorage.setItem('arthvo-env', JSON.stringify({ ...current, ...partial }));
  };

  return (
    <EnvironmentContext.Provider value={{
      theme, language, coachPersonality, avatarCharacter, terminology, voiceEnabled,
      setTheme,
      setLanguage: (l) => { setLangState(l); save({ language: l }); },
      setCoachPersonality: (p) => { setCoachPersonality(p); save({ coachPersonality: p }); },
      setAvatarCharacter: (c) => { setAvatarCharacter(c); save({ avatarCharacter: c }); },
      setTerminology: (t) => { setTerminology(t); save({ terminology: t }); },
      setVoiceEnabled: (v) => { setVoiceEnabled(v); save({ voiceEnabled: v }); },
      save,
    }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error('useEnvironment must be used within EnvironmentProvider');
  return ctx;
}
