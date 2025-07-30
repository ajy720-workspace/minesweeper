// src/components/game/Game.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Board as BoardType, CellState, createBoard, revealCell, chordCell } from '@/lib/minesweeper';
import { Difficulty, DIFFICULTY_SETTINGS } from '@/types';
import Board from './Board';
import DifficultySelector from './DifficultySelector';
import GameInfoBar from './GameInfoBar';

type GameState = 'playing' | 'won' | 'lost';

const Game: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [board, setBoard] = useState<BoardType>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [remainingMines, setRemainingMines] = useState(DIFFICULTY_SETTINGS.beginner.mineCount);
  const [timer, setTimer] = useState(0);

  const initializeBoard = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const placeholderBoard = Array.from({ length: settings.height }, () =>
      Array.from({ length: settings.width }, () => ({
        isMine: false, isRevealed: false, isFlagged: false, isQuestioned: false, adjacentMines: 0
      } as CellState))
    );
    setBoard(placeholderBoard);
    setGameState('playing');
    setIsFirstClick(true);
    setRemainingMines(settings.mineCount);
    setTimer(0);
  }, [difficulty]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && !isFirstClick) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, isFirstClick]);

  const checkWinCondition = (currentBoard: BoardType): boolean => {
    return currentBoard.every(row => row.every(cell => cell.isMine || cell.isRevealed));
  };

  const updateBoardState = (newBoard: BoardType) => {
    if (checkWinCondition(newBoard)) {
      setGameState('won');
    }
    setBoard(newBoard);
  }

  const handleCellClick = (x: number, y: number) => {
    if (gameState !== 'playing') return;

    if (isFirstClick) {
      const settings = DIFFICULTY_SETTINGS[difficulty];
      const newBoard = createBoard(settings.width, settings.height, settings.mineCount, x, y);
      const revealedBoard = revealCell(newBoard, x, y);
      setIsFirstClick(false);
      updateBoardState(revealedBoard);
      return;
    }
    
    const cell = board[y][x];
    if (cell.isRevealed) {
      const newBoard = chordCell(board, x, y);
      updateBoardState(newBoard);
    } else {
      const newBoard = revealCell(board, x, y);
      if (newBoard[y][x].isMine && newBoard[y][x].isRevealed) {
        setGameState('lost');
        const finalBoard = newBoard.map(row => row.map(cell => cell.isMine ? { ...cell, isRevealed: true } : cell));
        setBoard(finalBoard);
        return;
      }
      updateBoardState(newBoard);
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
      setRemainingMines(prev => prev - 1);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      cell.isQuestioned = true;
      setRemainingMines(prev => prev + 1);
    } else if (cell.isQuestioned) {
      cell.isQuestioned = false;
    }
    setBoard(newBoard);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="flex flex-col items-center">
      <DifficultySelector onSelectDifficulty={handleDifficultyChange} currentDifficulty={difficulty} />
      <div className="inline-block border-4 border-gray-500 bg-gray-400 p-1">
        <GameInfoBar remainingMines={remainingMines} timer={timer} />
        <Board 
          board={board} 
          gameState={gameState}
          onCellClick={handleCellClick}
          onCellAuxClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu} 
          onPlayAgain={initializeBoard}
        />
      </div>
    </div>
  );
};

export default Game;
