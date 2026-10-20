'use client';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import mr from '@/locales/mr.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';
import bn from '@/locales/bn.json';

const LOCALES: Record<string, any> = { en, hi, mr, ta, te, bn };

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? path;
}

export function useTranslation() {
  const { language } = useEnvironment();
  const locale = LOCALES[language] ?? LOCALES.hi;

  const t = useCallback((key: string): string => {
    const val = getNestedValue(locale, key);
    // Fallback to Hindi, then English
    if (val === key) {
      const hiFallback = getNestedValue(LOCALES.hi, key);
      if (hiFallback !== key) return hiFallback;
      return getNestedValue(LOCALES.en, key);
    }
    return val;
  }, [locale]);

  return { t, language };
}
