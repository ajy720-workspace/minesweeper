// src/components/game/GameInfoBar.tsx
import React from 'react';

type GameInfoBarProps = {
  remainingMines: number;
  timer: number;
};

const GameInfoBar: React.FC<GameInfoBarProps> = ({ remainingMines, timer }) => {
  return (
    <div className="flex justify-between items-center bg-gray-600 text-white font-mono text-2xl p-2 w-full">
      <div className="bg-black text-red-500 px-2 py-1">{String(remainingMines).padStart(3, '0')}</div>
      <div className="bg-black text-red-500 px-2 py-1">{String(timer).padStart(3, '0')}</div>
    </div>
  );
};

export default GameInfoBar;
