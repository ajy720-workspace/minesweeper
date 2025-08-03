'use client';

import { useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';

export function HtmlLangUpdater() {
  const { locale, isLoading } = useLocale();

  useEffect(() => {
    if (!isLoading && typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale, isLoading]);

  return null;
}
