// src/components/game/Board.tsx
'use client';

import React, { useState } from 'react';
import { createBoard, Board as BoardType } from '@/lib/minesweeper';
import Cell from './Cell';

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(() => createBoard(9, 9, 10));

  const handleCellClick = (x: number, y: number) => {
    console.log(`Clicked cell: (${x}, ${y})`);
    // Game logic for revealing cell will be implemented here
  };

  const handleCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    console.log(`Right-clicked cell: (${x}, ${y})`);
    // Game logic for flagging cell will be implemented here
  };

  return (
    <div className="inline-block border-4 border-gray-500 bg-gray-400 p-2">
      {board.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <Cell
              key={x}
              cell={cell}
              onClick={() => handleCellClick(x, y)}
              onContextMenu={(e) => handleCellContextMenu(e, x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
