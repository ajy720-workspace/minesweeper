// src/components/game/Board.tsx
import React from 'react';
import { Board as BoardType } from '@/lib/minesweeper';
import Cell from './Cell';

type GameState = 'playing' | 'won' | 'lost';

type BoardProps = {
  board: BoardType;
  gameState: GameState;
  focusedCell: { x: number; y: number } | null;
  showKeyboardCursor: boolean;
  onCellClick: (x: number, y: number) => void;
  onCellAuxClick: (x: number, y: number) => void;
  onCellContextMenu: (e: React.MouseEvent, x: number, y: number) => void;
  onPlayAgain: () => void;
};

const Board: React.FC<BoardProps> = ({
  board,
  gameState,
  focusedCell,
  showKeyboardCursor,
  onCellClick,
  onCellAuxClick,
  onCellContextMenu,
  onPlayAgain,
}) => {
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

  const boardWidth = board[0]?.length || 0;
  const boardHeight = board.length;

  return (
    <div className="relative bg-[var(--game-background)] p-1 sm:p-2 max-w-fit mx-auto">
      <div
        className="grid gap-0 border-4 border-t-[var(--game-border-light)] border-l-[var(--game-border-light)] border-b-[var(--game-border-dark)] border-r-[var(--game-border-dark)] bg-[var(--game-background)]"
        style={{
          gridTemplateColumns: `repeat(${boardWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardHeight}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              cell={cell}
              isFocused={showKeyboardCursor && focusedCell?.x === x && focusedCell?.y === y}
              onMouseDown={(e) => handleCellMouseDown(e, x, y)}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Board;
