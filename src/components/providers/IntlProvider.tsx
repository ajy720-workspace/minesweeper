'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from '@/contexts/LocaleContext';

// Import default messages at build time
import enMessages from '../../locales/en.json';
import koMessages from '../../locales/ko.json';

interface IntlProviderProps {
  children: React.ReactNode;
}

const messagesMap = {
  en: enMessages,
  ko: koMessages,
} as const;

export function IntlProvider({ children }: IntlProviderProps) {
  const { locale } = useLocale();
  const messages = messagesMap[locale as keyof typeof messagesMap] || messagesMap.en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
