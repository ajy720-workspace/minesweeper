// src/contexts/LocaleContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale, localeMapping } from '@/i18n/config';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

// Detect browser language
const detectBrowserLocale = (): Locale => {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = navigator.language || navigator.languages?.[0];
  const mappedLocale = localeMapping[browserLang as keyof typeof localeMapping];

  return mappedLocale || defaultLocale;
};

// Get stored locale from localStorage
const getStoredLocale = (): Locale | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('minesweeper-locale');
    if (stored && ['en', 'ko'].includes(stored)) {
      return stored as Locale;
    }
  } catch (error) {
    console.warn('Failed to read locale from localStorage:', error);
  }

  return null;
};

// Store locale to localStorage
const storeLocale = (locale: Locale): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('minesweeper-locale', locale);
  } catch (error) {
    console.warn('Failed to store locale to localStorage:', error);
  }
};

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize locale on mount
  useEffect(() => {
    const storedLocale = getStoredLocale();
    const detectedLocale = detectBrowserLocale();

    // Priority: initialLocale > stored > detected > default
    const finalLocale = initialLocale || storedLocale || detectedLocale;

    setLocaleState(finalLocale);
    setIsLoading(false);
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    storeLocale(newLocale);

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  };

  const value: LocaleContextType = {
    locale,
    setLocale,
    isLoading,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
