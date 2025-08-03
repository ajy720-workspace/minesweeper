// src/i18n/config.ts

// Supported locales
export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];

// Default locale for fallback
export const defaultLocale: Locale = 'en';

// Browser language detection mapping
export const localeMapping = {
  'ko-KR': 'ko',
  ko: 'ko',
  'en-US': 'en',
  'en-GB': 'en',
  en: 'en',
} as const;
