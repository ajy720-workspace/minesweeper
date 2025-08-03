// src/components/game/GameSettings.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audio';
import { ColorThemeSelector } from '@/components/theme/ColorThemeSelector';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface GameSettingsProps {
  onRestart: () => void;
}

// Help Modal Component
const HelpModal = () => {
  const keyboardShortcuts = [
    { key: '방향키', description: '셀 이동 (키보드 모드)' },
    { key: 'Space', description: '셀 열기' },
    { key: 'Shift + Space', description: '코드 클릭 (주변 셀 자동 열기)' },
    { key: 'F 또는 1', description: '깃발 설치/제거' },
    { key: 'Q 또는 2', description: '물음표 표시/제거' },
  ];

  const gameRules = [
    { title: '게임 목표', content: '모든 지뢰를 피해 모든 안전한 셀을 열어라' },
    { title: '숫자의 의미', content: '각 숫자는 인접한 8개 셀에 있는 지뢰의 개수를 나타냄' },
    { title: '깃발 사용', content: '지뢰가 있다고 생각되는 셀에 깃발을 설치' },
    { title: '코드 클릭', content: '숫자 셀을 클릭하면 주변의 깃발이 아닌 셀들을 자동으로 열기' },
    { title: '첫 클릭 보장', content: '첫 번째 클릭은 항상 안전 (3x3 영역이 지뢰 없음)' },
  ];

  const scoringSystem = [
    { action: '셀 열기', points: '+10점' },
    { action: '깃발 설치', points: '-5점' },
    { action: '깃발 제거', points: '+5점' },
    { action: '코드 클릭', points: '+50점' },
    { action: '게임 승리', points: '+500점' },
  ];

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto pr-3">
      <DialogHeader>
        <DialogTitle className="text-xl">🎮 마인스위퍼 가이드</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Game Rules */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-semibold text-lg mb-3 text-primary">📋 게임 규칙</h3>
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-lg mb-3 text-primary">⌨️ 키보드 단축키</h3>
          <div className="grid gap-2">
            {keyboardShortcuts.map((shortcut, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex justify-between items-center p-2 rounded bg-muted/30"
              >
                <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  {shortcut.key}
                </code>
                <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scoring System */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-semibold text-lg mb-3 text-primary">🏆 점수 시스템</h3>
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
          💡 <strong>팁:</strong> 마우스와 키보드를 모두 활용하면 더 빠른 플레이가 가능합니다!
        </motion.div>
      </div>
    </DialogContent>
  );
};

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
        <Tooltip content={isMuted ? '효과음 켜기' : '효과음 끄기'}>
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
        <Tooltip content="게임 다시 시작">
          <Button size="sm" variant="outline" onClick={onRestart} className="h-9 w-9 p-0">
            🔄
          </Button>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip content={`현재 테마: ${theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'} (클릭하여 변경)`}>
          <Button
            size="sm"
            variant="outline"
            onClick={cycleTheme}
            className="h-9 w-9 p-0"
          >
            {getThemeIcon()}
          </Button>
        </Tooltip>

        {/* Color Theme Settings Toggle */}
        <Tooltip content={showThemeSettings ? '컬러 테마 숨기기' : '컬러 테마 보기'}>
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
          <Tooltip content="게임 도움말 및 키보드 단축키">
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
