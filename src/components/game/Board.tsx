// src/components/game/Board.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createBoard, revealCell as revealCellLogic, Board as BoardType, CellState } from '@/lib/minesweeper';
import Cell from './Cell';

const BOARD_WIDTH = 9;
const BOARD_HEIGHT = 9;
const MINE_COUNT = 10;

type GameState = 'playing' | 'won' | 'lost';

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardType>([]);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');

  const initializeBoard = () => {
    const placeholderBoard = Array.from({ length: BOARD_HEIGHT }, () =>
      Array.from({ length: BOARD_WIDTH }, () => ({
        isMine: false, isRevealed: false, isFlagged: false, isQuestioned: false, adjacentMines: 0
      } as CellState))
    );
    setBoard(placeholderBoard);
    setGameState('playing');
    setIsFirstClick(true);
  };

  useEffect(initializeBoard, []);

  const checkWinCondition = (currentBoard: BoardType): boolean => {
    for (const row of currentBoard) {
      for (const cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  const startGame = (x: number, y: number) => {
    const newBoard = createBoard(BOARD_WIDTH, BOARD_HEIGHT, MINE_COUNT, x, y);
    const revealedBoard = revealCellLogic(newBoard, x, y);
    setBoard(revealedBoard);
    setIsFirstClick(false);
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameState !== 'playing') return;

    if (isFirstClick) {
      startGame(x, y);
    } else {
      const newBoard = revealCellLogic(board, x, y);
      
      if (newBoard[y][x].isMine && newBoard[y][x].isRevealed) {
        setGameState('lost');
        // Reveal all mines on loss
        const finalBoard = newBoard.map(row => row.map(cell => cell.isMine ? { ...cell, isRevealed: true } : cell));
        setBoard(finalBoard);
        return;
      }

      if (checkWinCondition(newBoard)) {
        setGameState('won');
      }
      
      setBoard(newBoard);
    }
  };

  const handleCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || isFirstClick) return;

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
    <div className="relative">
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
      {gameState !== 'playing' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="text-white text-4xl font-bold mb-4">
            {gameState === 'won' ? 'You Won!' : 'Game Over!'}
          </div>
          <button
            onClick={initializeBoard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Board;
