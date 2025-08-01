// src/components/game/Cell.tsx
import React from 'react';
import { CellState } from '@/lib/minesweeper';

type CellProps = {
  cell: CellState;
  isFocused: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
};

const Cell: React.FC<CellProps> = ({ cell, isFocused, onMouseDown }) => {
  const getNumberColor = (num: number) => {
    switch (num) {
      case 1:
        return 'text-blue-600';
      case 2:
        return 'text-green-600';
      case 3:
        return 'text-destructive';
      case 4:
        return 'text-purple-600';
      case 5:
        return 'text-red-800';
      case 6:
        return 'text-teal-600';
      case 7:
        return 'text-[var(--game-text-primary)]';
      case 8:
        return 'text-[var(--game-text-muted)]';
      default:
        return '';
    }
  };

  const renderContent = () => {
    if (!cell.isRevealed) {
      if (cell.isFlagged) return '🚩';
      if (cell.isQuestioned) return '❓';
      return null;
    }
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) {
      return <span className={getNumberColor(cell.adjacentMines)}>{cell.adjacentMines}</span>;
    }
    return null;
  };

  const baseStyle =
    'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border flex items-center justify-center text-sm sm:text-base md:text-lg font-bold';
  const revealedStyle = 'border-[var(--cell-border)] bg-[var(--cell-revealed)]';
  const unrevealedStyle =
    'border-[var(--cell-border)] bg-[var(--cell-background)] hover:bg-[var(--cell-hover)] active:bg-[var(--cell-active)] cursor-pointer transition-colors duration-75 hover:scale-105 active:scale-95';
  const focusStyle = isFocused ? 'ring-2 ring-primary ring-offset-0 z-10' : '';

  // Disable transitions when focused (keyboard navigation)
  const transitionStyle = isFocused ? '' : 'transition-transform duration-75';

  const cellStyle = `${baseStyle} ${cell.isRevealed ? revealedStyle : unrevealedStyle} ${focusStyle} ${transitionStyle}`;

  return (
    <div
      className={cellStyle}
      onMouseDown={onMouseDown}
      onContextMenu={(e) => e.preventDefault()} // 컨텍스트 메뉴 기본 동작 방지
      role="button"
      tabIndex={isFocused ? 0 : -1}
      aria-label={`Cell ${cell.isFlagged ? 'flagged' : cell.isRevealed ? (cell.isMine ? 'mine' : cell.adjacentMines ? `${cell.adjacentMines} adjacent mines` : 'empty') : 'unrevealed'}`}
    >
      {renderContent()}
    </div>
  );
};

export default Cell;
