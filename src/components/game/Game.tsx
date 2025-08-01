// src/components/game/Game.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Board as BoardType, CellState, createBoard, revealCell, chordCell } from '@/lib/minesweeper';
import { Difficulty, DIFFICULTY_SETTINGS } from '@/types';
import Board from './Board';
import DifficultySelector from './DifficultySelector';
import GameInfoBar from './GameInfoBar';
import { loginOrRegister, saveGameRecord } from '@/app/auth/actions';
import { AuthModal } from '../auth/AuthModal';

type GameState = 'playing' | 'won' | 'lost';

interface GameProps {
  session: { id: number; username: string } | null;
}

const Game: React.FC<GameProps> = ({ session }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [board, setBoard] = useState<BoardType>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [remainingMines, setRemainingMines] = useState(DIFFICULTY_SETTINGS.beginner.mineCount);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [focusedCell, setFocusedCell] = useState<{ x: number; y: number } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const initializeBoard = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const placeholderBoard = Array.from({ length: settings.height }, () =>
      Array.from(
        { length: settings.width },
        () =>
          ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            isQuestioned: false,
            adjacentMines: 0,
          }) as CellState,
      ),
    );
    setBoard(placeholderBoard);
    setGameState('playing');
    setIsFirstClick(true);
    setRemainingMines(settings.mineCount);
    setTimer(0);
    setScore(0);
    setFocusedCell({ x: 0, y: 0 });
    setIsAuthModalOpen(false);
  }, [difficulty]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && !isFirstClick) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, isFirstClick]);

  const handleSaveRecord = useCallback(
    async (username: string, password?: string) => {
      let userId: number;

      if (session) {
        userId = session.id;
      } else {
        if (!password) {
          alert('Password is required.');
          return;
        }
        const result = await loginOrRegister(username, password);
        if (result.error || !result.user) {
          alert(result.error || 'Failed to login or register.');
          return;
        }
        userId = result.user.id;
      }

      const gameData = {
        difficulty: difficulty,
        win: gameState === 'won',
        clear_time_ms: timer * 1000,
        score: score,
      };

      const saveResult = await saveGameRecord(userId, gameData);
      if (saveResult.error) {
        alert(saveResult.error);
      } else {
        alert('Score saved successfully!');
        setIsAuthModalOpen(false);
        initializeBoard();
      }
    },
    [session, difficulty, gameState, timer, score, initializeBoard],
  );

  useEffect(() => {
    if ((gameState === 'won' || gameState === 'lost') && !session) {
      setIsAuthModalOpen(true);
    } else if ((gameState === 'won' || gameState === 'lost') && session) {
      handleSaveRecord(session.username);
    }
  }, [gameState, session, handleSaveRecord]);

  const checkWinCondition = useCallback((currentBoard: BoardType): boolean => {
    return currentBoard.every((row) => row.every((cell) => cell.isMine || cell.isRevealed));
  }, []);

  const updateBoardState = useCallback(
    (newBoard: BoardType) => {
      if (checkWinCondition(newBoard)) {
        setGameState('won');
        setScore((prev) => prev + 500); // Win bonus
      }
      setBoard(newBoard);
    },
    [checkWinCondition],
  );

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (gameState !== 'playing' || !board[y]?.[x]) return;

      if (isFirstClick) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const newBoard = createBoard(settings.width, settings.height, settings.mineCount, x, y);
        const revealedBoard = revealCell(newBoard, x, y);
        setIsFirstClick(false);
        setScore((prev) => prev + 10); // First click score
        updateBoardState(revealedBoard);
        return;
      }

      const cell = board[y][x];
      if (cell.isRevealed) {
        const newBoard = chordCell(board, x, y);
        // Check if chord action revealed any new cells
        if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
          setScore((prev) => prev + 50); // Chord click bonus
        }
        updateBoardState(newBoard);
      } else {
        const newBoard = revealCell(board, x, y);
        if (newBoard[y][x].isMine && newBoard[y][x].isRevealed) {
          setGameState('lost');
          const finalBoard = newBoard.map((row) =>
            row.map((cell) => (cell.isMine ? { ...cell, isRevealed: true } : cell)),
          );
          setBoard(finalBoard);
          return;
        }
        setScore((prev) => prev + 10); // Regular click score
        updateBoardState(newBoard);
      }
    },
    [gameState, board, isFirstClick, difficulty, updateBoardState],
  );

  const toggleMark = useCallback(
    (x: number, y: number) => {
      if (gameState !== 'playing' || isFirstClick || !board[y]?.[x]) return;

      const newBoard = JSON.parse(JSON.stringify(board));
      const cell = newBoard[y][x];
      if (cell.isRevealed) return;

      if (!cell.isFlagged && !cell.isQuestioned) {
        cell.isFlagged = true;
        setRemainingMines((prev) => prev - 1);
        setScore((prev) => prev - 5); // Flag penalty
      } else if (cell.isFlagged) {
        cell.isFlagged = false;
        cell.isQuestioned = true;
        setRemainingMines((prev) => prev + 1);
        setScore((prev) => prev + 5); // Remove flag bonus
      } else if (cell.isQuestioned) {
        cell.isQuestioned = false;
      }
      setBoard(newBoard);
    },
    [gameState, isFirstClick, board],
  );

  const handleCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    toggleMark(x, y);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAuthModalOpen || !focusedCell) return;

      const { x, y } = focusedCell;
      const settings = DIFFICULTY_SETTINGS[difficulty];

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedCell({ x, y: Math.max(0, y - 1) });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedCell({ x, y: Math.min(settings.height - 1, y + 1) });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedCell({ x: Math.max(0, x - 1), y });
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedCell({ x: Math.min(settings.width - 1, x + 1), y });
          break;
        case ' ': // Spacebar
          e.preventDefault();
          if (e.shiftKey) {
            if (board[y]?.[x]?.isRevealed) {
              const newBoard = chordCell(board, x, y);
              if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
                setScore((prev) => prev + 50);
              }
              updateBoardState(newBoard);
            }
          } else {
            handleCellClick(x, y);
          }
          break;
        case 'f':
        case '1':
          e.preventDefault();
          toggleMark(x, y);
          break;
        case 'q':
        case '2':
          e.preventDefault();
          toggleMark(x, y);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, board, difficulty, handleCellClick, toggleMark, updateBoardState, isAuthModalOpen]);

  return (
    <div className="flex flex-col items-center">
      <DifficultySelector onSelectDifficulty={handleDifficultyChange} currentDifficulty={difficulty} />
      <div className="inline-block border-4 border-gray-500 bg-gray-400 p-1">
        <GameInfoBar remainingMines={remainingMines} timer={timer} score={score} />
        <Board
          board={board}
          gameState={gameState}
          focusedCell={focusedCell}
          onCellClick={handleCellClick}
          onCellAuxClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu}
          onPlayAgain={initializeBoard}
        />
      </div>
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          gameResult={{ status: gameState as 'won' | 'lost', time: timer, score, difficulty }}
          onSaveRecord={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default Game;
