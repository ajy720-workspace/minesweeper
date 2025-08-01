// src/components/game/GameInfoBar.tsx
import React from 'react';

type GameInfoBarProps = {
  remainingMines: number;
  timer: number;
  score: number;
};

const InfoDisplay: React.FC<{ value: string | number }> = ({ value }) => (
  <div className="bg-primary text-destructive px-3 py-2 font-mono text-xl font-bold">
    {String(value).padStart(3, '0')}
  </div>
);

const GameInfoBar: React.FC<GameInfoBarProps> = ({ remainingMines, timer, score }) => {
  return (
    <div className="flex justify-between items-center bg-secondary p-3 w-full mb-2">
      <InfoDisplay value={remainingMines} />
      <InfoDisplay value={score} />
      <InfoDisplay value={timer} />
    </div>
  );
};

export default GameInfoBar;
