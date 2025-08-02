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
        return 'text-[var(--mine-1)]';
      case 2:
        return 'text-[var(--mine-2)]';
      case 3:
        return 'text-[var(--mine-3)]';
      case 4:
        return 'text-[var(--mine-4)]';
      case 5:
        return 'text-[var(--mine-5)]';
      case 6:
        return 'text-[var(--mine-6)]';
      case 7:
        return 'text-[var(--mine-7)]';
      case 8:
        return 'text-[var(--mine-8)]';
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
    if (cell.isMine) {
      return cell.isExploded ? '💥' : '💣';
    }
    if (cell.adjacentMines > 0) {
      return <span className={getNumberColor(cell.adjacentMines)}>{cell.adjacentMines}</span>;
    }
    return null;
  };

  const baseStyle =
    'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border flex items-center justify-center text-sm sm:text-base md:text-lg font-bold';
  const revealedStyle = cell.isExploded ? 
    'border-[var(--cell-border)] bg-red-500' : 
    'border-[var(--cell-border)] bg-[var(--cell-revealed)]';
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
