// src/components/ui/LanguageSelector.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/contexts/LocaleContext';
import { locales, type Locale } from '@/i18n/config';
import { ButtonMotion, FadeInMotion } from '@/components/ui/motion';

interface LanguageSelectorProps {
  variant?: 'button' | 'toggle' | 'navbar';
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
        <ButtonMotion>
          <Button
            size="sm"
            variant="outline"
            onClick={cycleLanguage}
            disabled={isLoading}
            className={`h-9 w-9 p-0 ${className}`}
            aria-label={`Change language. Current: ${currentLang.name}`}
          >
            <FadeInMotion key={locale}>{currentLang.flag}</FadeInMotion>
          </Button>
        </ButtonMotion>
      </Tooltip>
    );
  } else if (variant === 'navbar') {
    return (
      <Tooltip content={`${currentLang.name}`}>
        <Button
          size="sm"
          variant="ghost"
          onClick={cycleLanguage}
          disabled={isLoading}
          className={`h-8 w-8 p-0 ${className}`}
          aria-label={`Change language. Current: ${currentLang.name}`}
        >
          <FadeInMotion key={locale}>{currentLang.flag}</FadeInMotion>
        </Button>
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
          </Tooltip>
        );
      })}
    </div>
  );
}
