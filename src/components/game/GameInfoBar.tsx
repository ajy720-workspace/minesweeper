// src/components/game/GameInfoBar.tsx
import React from 'react';

type GameInfoBarProps = {
  remainingMines: number;
  timer: number;
  score: number;
};

const InfoDisplay: React.FC<{ value: string | number }> = ({ value }) => (
  <div className="bg-black text-red-500 px-2 py-1 font-mono text-2xl">{String(value).padStart(3, '0')}</div>
);

const GameInfoBar: React.FC<GameInfoBarProps> = ({ remainingMines, timer, score }) => {
  return (
    <div className="flex justify-between items-center bg-gray-600 p-2 w-full mb-1">
      <InfoDisplay value={remainingMines} />
      <InfoDisplay value={score} />
      <InfoDisplay value={timer} />
    </div>
  );
};

export default GameInfoBar;
