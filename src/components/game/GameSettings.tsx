// src/components/game/GameSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audio';
import { ColorThemeSelector } from '@/components/theme/ColorThemeSelector';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip } from '@/components/ui/tooltip';
import { useGameTranslation, useThemeTranslation } from '@/hooks/useTranslation';
import { HelpModal } from './HelpModal';
import { ButtonMotion } from '@/components/ui/motion';

interface GameSettingsProps {
  onRestart: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ onRestart }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const { theme, setTheme } = useTheme();
  const tGame = useGameTranslation();
  const tTheme = useThemeTranslation();

  useEffect(() => {
    setIsMuted(audioManager.isMutedState());
  }, []);

  const handleMuteToggle = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '🎨';
    }
  };

  const getThemeName = () => {
    return tTheme(`names.${theme}`);
  };

  return (
    <div className="mt-4 max-w-fit mx-auto space-y-3">
      {/* Main Controls */}
      <div className="flex items-center gap-3">
        {/* Audio Toggle */}
        <Tooltip content={isMuted ? tGame('settings.audioOn') : tGame('settings.audioOff')}>
          <ButtonMotion>
            <Button
              size="sm"
              variant={isMuted ? 'outline' : 'default'}
              onClick={handleMuteToggle}
              className="h-9 w-9 p-0"
            >
              {isMuted ? '🔇' : '🔊'}
            </Button>
          </ButtonMotion>
        </Tooltip>

        {/* Restart Game */}
        <Tooltip content={tGame('settings.restart')}>
          <ButtonMotion>
            <Button size="sm" variant="outline" onClick={onRestart} className="h-9 w-9 p-0">
              🔄
            </Button>
          </ButtonMotion>
        </Tooltip>

        {/* Language Selector */}
        <LanguageSelector variant="toggle" />

        {/* Theme Toggle */}
        <Tooltip content={tGame('settings.theme', { theme: getThemeName() })}>
          <ButtonMotion>
            <Button size="sm" variant="outline" onClick={cycleTheme} className="h-9 w-9 p-0">
              {getThemeIcon()}
            </Button>
          </ButtonMotion>
        </Tooltip>

        {/* Color Theme Settings Toggle */}
        <Tooltip content={showThemeSettings ? tGame('settings.colorThemeHide') : tGame('settings.colorThemeShow')}>
          <ButtonMotion>
            <Button
              size="sm"
              variant={showThemeSettings ? 'default' : 'outline'}
              onClick={() => setShowThemeSettings(!showThemeSettings)}
              className="h-9 w-9 p-0"
            >
              🎨
            </Button>
          </ButtonMotion>
        </Tooltip>

        {/* Help Modal */}
        <HelpModal />
      </div>

      {/* Color Theme Selector */}
      {showThemeSettings && (
        <div className="flex items-center justify-center">
          <ColorThemeSelector />
        </div>
      )}
    </div>
  );
};

export default GameSettings;
