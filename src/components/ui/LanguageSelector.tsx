// src/components/ui/LanguageSelector.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { locales, type Locale } from '@/i18n/config';
import { motion } from 'framer-motion';

interface LanguageSelectorProps {
  variant?: 'button' | 'toggle';
  className?: string;
}

export function LanguageSelector({ variant = 'toggle', className }: LanguageSelectorProps) {
  const { locale, setLocale, isLoading } = useLocale();

  const getLanguageInfo = (lang: Locale) => {
    switch (lang) {
      case 'ko':
        return { flag: '🇰🇷', name: '한국어', short: 'KO' };
      case 'en':
        return { flag: '🇺🇸', name: 'English', short: 'EN' };
      default:
        return { flag: '🌐', name: 'Unknown', short: '??' };
    }
  };

  const currentLang = getLanguageInfo(locale);

  const cycleLanguage = () => {
    if (isLoading) return;

    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];

    setLocale(nextLocale);
  };

  if (variant === 'toggle') {
    return (
      <Tooltip content={`${currentLang.name}`}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={cycleLanguage}
            disabled={isLoading}
            className={`h-9 w-9 p-0 ${className}`}
            aria-label={`Change language. Current: ${currentLang.name}`}
          >
            <motion.div
              key={locale}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {currentLang.flag}
            </motion.div>
          </Button>
        </motion.div>
      </Tooltip>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {locales.map((lang) => {
        const langInfo = getLanguageInfo(lang);
        const isActive = locale === lang;

        return (
          <Tooltip key={lang} content={langInfo.name}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setLocale(lang)}
                disabled={isLoading}
                className="h-8 px-3"
                aria-pressed={isActive}
                aria-label={`Switch to ${langInfo.name}`}
              >
                <span className="mr-1">{langInfo.flag}</span>
                <span className="text-xs font-mono">{langInfo.short}</span>
              </Button>
            </motion.div>
          </Tooltip>
        );
      })}
    </div>
  );
}
