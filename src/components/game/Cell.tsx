// src/components/game/Cell.tsx
import React from 'react';
import { CellState } from '@/lib/minesweeper';

type CellProps = {
  cell: CellState;
  onClick: () => void;
  onAuxClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
};

const Cell: React.FC<CellProps> = ({ cell, onClick, onAuxClick, onContextMenu }) => {
  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-blue-500';
      case 2: return 'text-green-500';
      case 3: return 'text-red-500';
      case 4: return 'text-purple-500';
      case 5: return 'text-maroon-500';
      case 6: return 'text-turquoise-500';
      case 7: return 'text-black';
      case 8: return 'text-gray-500';
      default: return '';
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
      return (
        <span className={`font-bold ${getNumberColor(cell.adjacentMines)}`}>
          {cell.adjacentMines}
        </span>
      );
    }
    return null;
  };

  const cellStyle = cell.isRevealed
    ? 'w-8 h-8 border border-gray-400 flex items-center justify-center bg-gray-200'
    : 'w-8 h-8 border border-gray-400 flex items-center justify-center bg-gray-300 hover:bg-gray-200 cursor-pointer';

  return (
    <div
      className={cellStyle}
      onClick={onClick}
      onAuxClick={onAuxClick}
      onContextMenu={onContextMenu}
    >
      {renderContent()}
    </div>
  );
};

export default Cell;
