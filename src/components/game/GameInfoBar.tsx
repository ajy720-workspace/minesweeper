// src/components/game/GameInfoBar.tsx
import React from 'react';
import { useGameTranslation } from '@/hooks/useTranslation';

type GameInfoBarProps = {
  remainingMines: number;
  timer: number;
  score: number;
};

const InfoDisplay: React.FC<{ value: string | number; label?: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    {label && <div className="text-xs text-muted-foreground mb-1 font-medium">{label}</div>}
    <div className="bg-[var(--cell-background)] border-2 border-t-[var(--game-border-light)] border-l-[var(--game-border-light)] border-b-[var(--game-border-dark)] border-r-[var(--game-border-dark)] text-destructive px-3 py-2 font-mono text-xl font-bold">
      {String(value).padStart(3, '0')}
    </div>
  </div>
);

const GameInfoBar: React.FC<GameInfoBarProps> = ({ remainingMines, timer, score }) => {
  const t = useGameTranslation();

  return (
    <div className="flex justify-between items-center bg-[var(--game-background)] border-2 border-t-[var(--game-border-light)] border-l-[var(--game-border-light)] border-b-[var(--game-border-dark)] border-r-[var(--game-border-dark)] p-3 w-full mb-2">
      <InfoDisplay value={remainingMines} label={t('ui.mines')} />
      <InfoDisplay value={score} label={t('ui.score')} />
      <InfoDisplay value={timer} label={t('ui.time')} />
    </div>
  );
};

export default GameInfoBar;
