// src/lib/server-translations.ts
import { headers } from 'next/headers';
import { defaultLocale, type Locale } from '@/i18n/config';

// Get translations for server actions
async function getTranslations(locale: Locale = defaultLocale) {
  try {
    const translations = await import(`../locales/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load translations for locale ${locale}, falling back to ${defaultLocale}`);
    const fallbackTranslations = await import(`../locales/${defaultLocale}.json`);
    return fallbackTranslations.default;
  }
}

// Detect locale from headers
export async function detectServerLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');

    if (acceptLanguage) {
      // Simple language detection from Accept-Language header
      if (acceptLanguage.includes('ko')) {
        return 'ko';
      }
    }

    return defaultLocale;
  } catch (error) {
    console.warn('Failed to detect locale from headers:', error);
    return defaultLocale;
  }
}

// Get server-side translation function
export async function getServerTranslations(locale?: Locale) {
  const detectedLocale = locale || (await detectServerLocale());
  const translations = await getTranslations(detectedLocale);

  return {
    locale: detectedLocale,
    auth: translations.auth,
    common: translations.common,
    game: translations.game,
    theme: translations.theme,
    error: translations.error,
  };
}
