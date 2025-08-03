// src/components/game/GameSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audio';
import { ColorThemeSelector } from '@/components/theme/ColorThemeSelector';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useGameTranslation, useThemeTranslation } from '@/hooks/useTranslation';

interface GameSettingsProps {
  onRestart: () => void;
}

// Help Modal Component
const HelpModal = () => {
  const tGame = useGameTranslation();

  const keyboardShortcuts = [
    { key: tGame('help.shortcuts.arrows.key'), description: tGame('help.shortcuts.arrows.description') },
    { key: tGame('help.shortcuts.space.key'), description: tGame('help.shortcuts.space.description') },
    { key: tGame('help.shortcuts.shiftSpace.key'), description: tGame('help.shortcuts.shiftSpace.description') },
    { key: tGame('help.shortcuts.flag.key'), description: tGame('help.shortcuts.flag.description') },
    { key: tGame('help.shortcuts.question.key'), description: tGame('help.shortcuts.question.description') },
  ];

  const gameRules = [
    { title: tGame('help.rules.objective.title'), content: tGame('help.rules.objective.content') },
    { title: tGame('help.rules.numbers.title'), content: tGame('help.rules.numbers.content') },
    { title: tGame('help.rules.flagging.title'), content: tGame('help.rules.flagging.content') },
    { title: tGame('help.rules.chording.title'), content: tGame('help.rules.chording.content') },
    { title: tGame('help.rules.safeStart.title'), content: tGame('help.rules.safeStart.content') },
  ];

  const scoringSystem = [
    { action: tGame('help.scoring.openCell.action'), points: tGame('help.scoring.openCell.points') },
    { action: tGame('help.scoring.placeFlag.action'), points: tGame('help.scoring.placeFlag.points') },
    { action: tGame('help.scoring.removeFlag.action'), points: tGame('help.scoring.removeFlag.points') },
    { action: tGame('help.scoring.chordClick.action'), points: tGame('help.scoring.chordClick.points') },
    { action: tGame('help.scoring.gameWin.action'), points: tGame('help.scoring.gameWin.points') },
  ];

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto pr-3">
      <DialogHeader>
        <DialogTitle className="text-xl">{tGame('help.title')}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Game Rules */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="font-semibold text-lg mb-3 text-primary">{tGame('help.gameRules')}</h3>
          <div className="space-y-2">
            {gameRules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex gap-3 p-2 rounded border-l-2 border-primary/20 bg-muted/30"
              >
                <span className="font-medium text-sm min-w-fit">{rule.title}:</span>
                <span className="text-sm text-muted-foreground">{rule.content}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Keyboard Shortcuts */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="font-semibold text-lg mb-3 text-primary">{tGame('help.keyboardShortcuts')}</h3>
          <div className="grid gap-2">
            {keyboardShortcuts.map((shortcut, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex justify-between items-center p-2 rounded bg-muted/30"
              >
                <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{shortcut.key}</code>
                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scoring System */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="font-semibold text-lg mb-3 text-primary">{tGame('help.scoringSystem')}</h3>
          <div className="grid gap-2">
            {scoringSystem.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex justify-between items-center p-2 rounded bg-muted/30"
              >
                <span className="text-sm">{item.action}</span>
                <span className="text-sm font-medium text-primary">{item.points}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground border-t pt-4"
        >
          {tGame('help.tip')}
        </motion.div>
      </div>
    </DialogContent>
  );
};

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
          <Button
            size="sm"
            variant={isMuted ? 'outline' : 'default'}
            onClick={handleMuteToggle}
            className="h-9 w-9 p-0"
          >
            {isMuted ? '🔇' : '🔊'}
          </Button>
        </Tooltip>

        {/* Restart Game */}
        <Tooltip content={tGame('settings.restart')}>
          <Button size="sm" variant="outline" onClick={onRestart} className="h-9 w-9 p-0">
            🔄
          </Button>
        </Tooltip>

        {/* Language Selector */}
        <LanguageSelector variant="toggle" />

        {/* Theme Toggle */}
        <Tooltip content={tGame('settings.theme', { theme: getThemeName() })}>
          <Button size="sm" variant="outline" onClick={cycleTheme} className="h-9 w-9 p-0">
            {getThemeIcon()}
          </Button>
        </Tooltip>

        {/* Color Theme Settings Toggle */}
        <Tooltip content={showThemeSettings ? tGame('settings.colorThemeHide') : tGame('settings.colorThemeShow')}>
          <Button
            size="sm"
            variant={showThemeSettings ? 'default' : 'outline'}
            onClick={() => setShowThemeSettings(!showThemeSettings)}
            className="h-9 w-9 p-0"
          >
            🎨
          </Button>
        </Tooltip>

        {/* Help Modal */}
        <Dialog>
          <Tooltip content={tGame('settings.help')}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                ❓
              </Button>
            </DialogTrigger>
          </Tooltip>
          <HelpModal />
        </Dialog>
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
