// src/components/game/GameInfoBar.tsx
import React from 'react';
import { useGameTranslation } from '@/hooks/useTranslation';

type GameInfoBarProps = {
  remainingMines: number;
  timer: number;
  score: number;
};

const InfoDisplay: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-primary text-destructive px-3 py-2 font-mono text-xl font-bold">
      {String(value).padStart(3, '0')}
    </div>
    <div className="text-xs text-muted-foreground mt-1 font-medium">{label}</div>
  </div>
);

const GameInfoBar: React.FC<GameInfoBarProps> = ({ remainingMines, timer, score }) => {
  const t = useGameTranslation();

  return (
    <div className="flex justify-between items-center bg-secondary p-3 w-full mb-2">
      <InfoDisplay value={remainingMines} label={t('ui.mines')} />
      <InfoDisplay value={score} label={t('ui.score')} />
      <InfoDisplay value={timer} label={t('ui.time')} />
    </div>
  );
};

export default GameInfoBar;
