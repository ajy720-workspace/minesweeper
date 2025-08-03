// src/hooks/useTranslation.ts
'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from '@/contexts/LocaleContext';

/**
 * Custom hook for translations with locale context integration
 * Provides type-safe translation functions and locale management
 */
export function useTranslation() {
  const { locale, setLocale, isLoading } = useLocale();

  // Get translation functions for different namespaces
  const common = useTranslations('common');
  const game = useTranslations('game');
  const auth = useTranslations('auth');
  const theme = useTranslations('theme');
  const error = useTranslations('error');
  const navigation = useTranslations('navigation');

  return {
    // Translation functions
    t: {
      common,
      game,
      auth,
      theme,
      error,
      navigation,
    },

    // Locale management
    locale,
    setLocale,
    isLoading,

    // Utility functions
    isKorean: locale === 'ko',
    isEnglish: locale === 'en',
  };
}

/**
 * Namespace-specific translation hooks for better organization
 */
export function useCommonTranslation() {
  return useTranslations('common');
}

export function useGameTranslation() {
  return useTranslations('game');
}

export function useAuthTranslation() {
  return useTranslations('auth');
}

export function useThemeTranslation() {
  return useTranslations('theme');
}

export function useErrorTranslation() {
  return useTranslations('error');
}

export function useNavigationTranslation() {
  return useTranslations('navigation');
}
