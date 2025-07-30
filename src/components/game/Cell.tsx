// src/components/game/Cell.tsx
import React from 'react';
import { CellState } from '@/lib/minesweeper';

type CellProps = {
  cell: CellState;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
};

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const renderContent = () => {
    if (!cell.isRevealed) {
      if (cell.isFlagged) return '🚩';
      if (cell.isQuestioned) return '❓';
      return null;
    }
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return null;
  };

  return (
    <div
      className="w-8 h-8 border border-gray-400 flex items-center justify-center bg-gray-300 hover:bg-gray-200"
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {renderContent()}
    </div>
  );
};

export default Cell;
