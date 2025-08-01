// src/components/game/Board.tsx
import React from 'react';
import { Board as BoardType } from '@/lib/minesweeper';
import Cell from './Cell';

type GameState = 'playing' | 'won' | 'lost';

type BoardProps = {
  board: BoardType;
  gameState: GameState;
  focusedCell: { x: number; y: number } | null;
  onCellClick: (x: number, y: number) => void;
  onCellAuxClick: (x: number, y: number) => void;
  onCellContextMenu: (e: React.MouseEvent, x: number, y: number) => void;
  onPlayAgain: () => void;
};

const Board: React.FC<BoardProps> = ({ board, gameState, focusedCell, onCellClick, onCellAuxClick, onCellContextMenu, onPlayAgain }) => {
  if (board.length === 0) {
    return <div>Loading...</div>; // Or a placeholder
  }

  const handleCellMouseDown = (e: React.MouseEvent, x: number, y: number) => {
    switch (e.button) {
      case 0: // Left click
        onCellClick(x, y);
        break;
      case 1: // Middle click (wheel)
        onCellAuxClick(x, y);
        break;
      case 2: // Right click
        onCellContextMenu(e, x, y);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative bg-gray-400 p-2">
      <div className="inline-block border-4 border-t-gray-300 border-l-gray-300 border-b-gray-500 border-r-gray-500">
        {board.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <Cell
                key={x}
                cell={cell}
                isFocused={focusedCell?.x === x && focusedCell?.y === y}
                onMouseDown={(e) => handleCellMouseDown(e, x, y)}
              />
            ))}
          </div>
        ))}
      </div>
      {gameState !== 'playing' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="text-white text-5xl font-bold mb-4">
            {gameState === 'won' ? 'You Won!' : 'Game Over!'}
          </div>
          <button
            onClick={onPlayAgain}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-xl"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Board;
