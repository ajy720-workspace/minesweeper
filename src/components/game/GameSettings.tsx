// src/components/game/GameSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audio';
import { ColorThemeSelector } from '@/components/theme/ColorThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';

interface GameSettingsProps {
  onRestart: () => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ onRestart }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const { theme, setTheme } = useTheme();

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

  return (
    <div className="mt-4 max-w-fit mx-auto space-y-3">
      {/* Main Controls */}
      <div className="flex items-center gap-3">
        {/* Audio Toggle */}
        <Button
          size="sm"
          variant={isMuted ? 'outline' : 'default'}
          onClick={handleMuteToggle}
          className="h-9 w-9 p-0"
          title={isMuted ? 'Enable sound effects' : 'Disable sound effects'}
        >
          {isMuted ? '🔇' : '🔊'}
        </Button>

        {/* Restart Game */}
        <Button size="sm" variant="outline" onClick={onRestart} className="h-9 w-9 p-0" title="Restart game">
          🔄
        </Button>

        {/* Theme Toggle */}
        <Button
          size="sm"
          variant="outline"
          onClick={cycleTheme}
          className="h-9 w-9 p-0"
          title={`Current theme: ${theme} (click to cycle)`}
        >
          {getThemeIcon()}
        </Button>

        {/* Color Theme Settings Toggle */}
        <Button
          size="sm"
          variant={showThemeSettings ? 'default' : 'outline'}
          onClick={() => setShowThemeSettings(!showThemeSettings)}
          className="h-9 w-9 p-0"
          title={showThemeSettings ? 'Hide color themes' : 'Show color themes'}
        >
          🎨
        </Button>
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
