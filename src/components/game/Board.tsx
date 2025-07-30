// src/components/game/Board.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createBoard, revealCell as revealCellLogic, Board as BoardType, CellState } from '@/lib/minesweeper';
import Cell from './Cell';

const BOARD_WIDTH = 9;
const BOARD_HEIGHT = 9;
const MINE_COUNT = 10;

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardType>([]);
  const [isFirstClick, setIsFirstClick] = useState(true);

  useEffect(() => {
    // Create a placeholder board on initial render
    const placeholderBoard = Array.from({ length: BOARD_HEIGHT }, () =>
      Array.from({ length: BOARD_WIDTH }, () => ({
        isMine: false, isRevealed: false, isFlagged: false, isQuestioned: false, adjacentMines: 0
      } as CellState))
    );
    setBoard(placeholderBoard);
  }, []);

  const startGame = (x: number, y: number) => {
    const newBoard = createBoard(BOARD_WIDTH, BOARD_HEIGHT, MINE_COUNT, x, y);
    const revealedBoard = revealCellLogic(newBoard, x, y);
    setBoard(revealedBoard);
    setIsFirstClick(false);
  };

  const handleCellClick = (x: number, y: number) => {
    if (isFirstClick) {
      startGame(x, y);
    } else {
      const newBoard = revealCellLogic(board, x, y);
      setBoard(newBoard);

      // Game Over Check
      if (newBoard[y][x].isMine && newBoard[y][x].isRevealed) {
        console.log("Game Over!");
        // You can add more game over logic here, like revealing all mines.
      }
    }
  };

  const handleCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (isFirstClick) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    const cell = newBoard[y][x];

    if (cell.isRevealed) return;

    if (!cell.isFlagged && !cell.isQuestioned) {
      cell.isFlagged = true;
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      cell.isQuestioned = true;
    } else if (cell.isQuestioned) {
      cell.isQuestioned = false;
    }

    setBoard(newBoard);
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
