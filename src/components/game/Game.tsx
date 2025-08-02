// src/components/game/Game.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Board as BoardType, CellState, createBoard, revealCell, chordCell } from '@/lib/minesweeper';
import { Difficulty, DIFFICULTY_SETTINGS } from '@/types';
import Board from './Board';
import DifficultySelector from './DifficultySelector';
import GameInfoBar from './GameInfoBar';
import GameSettings from './GameSettings';
import { loginOrRegister, saveGameRecord } from '@/app/auth/actions';
import { GameResultModal } from './GameResultModal';
import { audioManager } from '@/lib/audio';

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
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [focusedCell, setFocusedCell] = useState<{ x: number; y: number } | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showKeyboardCursor, setShowKeyboardCursor] = useState(false);
  // const [gameId, setGameId] = useState<string>(''); // Future: unique game session tracking
  const [scoreSaved, setScoreSaved] = useState(false);
  const [finalClearTimeMs, setFinalClearTimeMs] = useState<number | null>(null);

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
            isExploded: false,
          }) as CellState,
      ),
    );
    setBoard(placeholderBoard);
    setGameState('playing');
    setIsFirstClick(true);
    setRemainingMines(settings.mineCount);
    setTimer(0);
    setGameStartTime(null);
    setScore(0);
    setFocusedCell({ x: 0, y: 0 });
    setIsResultModalOpen(false);
    setSaveStatus('idle');
    setShowKeyboardCursor(false);
    // Reset score saving flag to allow saving for new game
    setScoreSaved(false);
    setFinalClearTimeMs(null);
  }, [difficulty]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && !isFirstClick) {
      if (!gameStartTime) {
        setGameStartTime(Date.now());
      }
      interval = setInterval(() => {
        if (gameStartTime) {
          const elapsedMs = Date.now() - gameStartTime;
          setTimer(Math.floor(elapsedMs / 1000)); // Display in seconds
        }
      }, 100); // Update more frequently for smoother display
    }
    return () => clearInterval(interval);
  }, [gameState, isFirstClick, gameStartTime]);

  const handleSaveRecord = useCallback(
    async (username: string, password?: string) => {
      setSaveStatus('saving');
      // Use the captured final clear time (immutable once game ends) instead of recalculating
      const clearTimeMs = finalClearTimeMs || (gameStartTime ? Date.now() - gameStartTime : timer * 1000);

      let userId: number;

      if (session) {
        userId = session.id;
      } else {
        if (!password) {
          setSaveStatus('error');
          return;
        }
        const result = await loginOrRegister(username, password);
        if (result.error || !result.user) {
          setSaveStatus('error');
          return;
        }
        userId = result.user.id;
      }

      const gameData = {
        difficulty: difficulty,
        win: gameState === 'won',
        clear_time_ms: clearTimeMs,
        score: score,
      };

      const saveResult = await saveGameRecord(userId, gameData);
      if (saveResult.error) {
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setScoreSaved(true);
      }
    },
    [session, difficulty, gameState, timer, score, gameStartTime, finalClearTimeMs],
  );

  useEffect(() => {
    if ((gameState === 'won' || gameState === 'lost') && !scoreSaved) {
      setIsResultModalOpen(true);
      if (session) {
        handleSaveRecord(session.username);
      }
    }
  }, [gameState, session, handleSaveRecord, scoreSaved]);

  const checkWinCondition = useCallback((currentBoard: BoardType): boolean => {
    return currentBoard.every((row) => row.every((cell) => cell.isMine || cell.isRevealed));
  }, []);

  const captureGameEndTime = useCallback(() => {
    if (gameStartTime && !finalClearTimeMs) {
      const endTime = Date.now() - gameStartTime;
      setFinalClearTimeMs(endTime);
      return endTime;
    }
    return finalClearTimeMs || timer * 1000;
  }, [gameStartTime, finalClearTimeMs, timer]);

  const updateBoardState = useCallback(
    (newBoard: BoardType) => {
      if (checkWinCondition(newBoard)) {
        captureGameEndTime(); // Capture exact win time
        setGameState('won');
        setScore((prev) => prev + 500); // Win bonus
        audioManager.playSound('win');
      }
      setBoard(newBoard);
    },
    [checkWinCondition, captureGameEndTime],
  );

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (gameState !== 'playing' || !board[y]?.[x]) return;

      // Initialize audio on first user interaction
      audioManager.initialize();

      // Hide keyboard cursor when using mouse
      setShowKeyboardCursor(false);
      setFocusedCell({ x, y });

      if (isFirstClick) {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        const newBoard = createBoard(settings.width, settings.height, settings.mineCount, x, y);
        const revealedBoard = revealCell(newBoard, x, y);
        setIsFirstClick(false);
        setScore((prev) => prev + 10); // First click score
        audioManager.playSound('click');
        updateBoardState(revealedBoard);
        return;
      }

      const cell = board[y][x];
      if (cell.isRevealed) {
        const newBoard = chordCell(board, x, y);
        // Check if chord action revealed any new cells
        if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
          setScore((prev) => prev + 50); // Chord click bonus
          audioManager.playSound('chord');

          // Check if chord revealed any mines (game over)
          const hasRevealedMine = newBoard.some((row) => row.some((cell) => cell.isMine && cell.isRevealed));

          if (hasRevealedMine) {
            captureGameEndTime(); // Capture exact loss time
            setGameState('lost');
            audioManager.playSound('explosion');
            // Find the first exploded mine for visual indication
            let explodedX = -1,
              explodedY = -1;
            for (let row = 0; row < newBoard.length; row++) {
              for (let col = 0; col < newBoard[row].length; col++) {
                if (newBoard[row][col].isMine && newBoard[row][col].isRevealed && !board[row][col].isRevealed) {
                  explodedX = col;
                  explodedY = row;
                  break;
                }
              }
              if (explodedX !== -1) break;
            }

            const finalBoard = newBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (cell.isMine) {
                  return {
                    ...cell,
                    isRevealed: true,
                    isExploded: rowIndex === explodedY && colIndex === explodedX, // Mark the exploded mine
                  };
                }
                return cell;
              }),
            );
            setBoard(finalBoard);
            return;
          }
        }
        updateBoardState(newBoard);
      } else {
        const newBoard = revealCell(board, x, y);
        if (newBoard[y][x].isMine && newBoard[y][x].isRevealed) {
          captureGameEndTime(); // Capture exact loss time
          setGameState('lost');
          audioManager.playSound('explosion');
          const finalBoard = newBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (cell.isMine) {
                return {
                  ...cell,
                  isRevealed: true,
                  isExploded: rowIndex === y && colIndex === x, // Mark the exploded mine
                };
              }
              return cell;
            }),
          );
          setBoard(finalBoard);
          return;
        }
        setScore((prev) => prev + 10); // Regular click score
        audioManager.playSound('click');
        updateBoardState(newBoard);
      }
    },
    [gameState, board, isFirstClick, difficulty, updateBoardState, captureGameEndTime],
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
        audioManager.playSound('flag');
      } else if (cell.isFlagged) {
        cell.isFlagged = false;
        cell.isQuestioned = true;
        setRemainingMines((prev) => prev + 1);
        setScore((prev) => prev + 5); // Remove flag bonus
        audioManager.playSound('unflag');
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
      if (isResultModalOpen || !focusedCell) return;

      const { x, y } = focusedCell;
      const settings = DIFFICULTY_SETTINGS[difficulty];

      // Prevent default behavior for game keys to avoid browser shortcuts
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'f', '1', 'q', '2'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          setShowKeyboardCursor(true);
          setFocusedCell({ x, y: Math.max(0, y - 1) });
          break;
        case 'ArrowDown':
          setShowKeyboardCursor(true);
          setFocusedCell({ x, y: Math.min(settings.height - 1, y + 1) });
          break;
        case 'ArrowLeft':
          setShowKeyboardCursor(true);
          setFocusedCell({ x: Math.max(0, x - 1), y });
          break;
        case 'ArrowRight':
          setShowKeyboardCursor(true);
          setFocusedCell({ x: Math.min(settings.width - 1, x + 1), y });
          break;
        case ' ': // Spacebar
          if (e.shiftKey) {
            if (board[y]?.[x]?.isRevealed) {
              const newBoard = chordCell(board, x, y);
              if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
                setScore((prev) => prev + 50);
                audioManager.playSound('chord');

                // Check if chord revealed any mines (game over)
                const hasRevealedMine = newBoard.some((row) => row.some((cell) => cell.isMine && cell.isRevealed));

                if (hasRevealedMine) {
                  captureGameEndTime(); // Capture exact loss time
                  setGameState('lost');
                  audioManager.playSound('explosion');
                  // Find the first exploded mine for visual indication
                  let explodedX = -1,
                    explodedY = -1;
                  for (let row = 0; row < newBoard.length; row++) {
                    for (let col = 0; col < newBoard[row].length; col++) {
                      if (newBoard[row][col].isMine && newBoard[row][col].isRevealed && !board[row][col].isRevealed) {
                        explodedX = col;
                        explodedY = row;
                        break;
                      }
                    }
                    if (explodedX !== -1) break;
                  }

                  const finalBoard = newBoard.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      if (cell.isMine) {
                        return {
                          ...cell,
                          isRevealed: true,
                          isExploded: rowIndex === explodedY && colIndex === explodedX, // Mark the exploded mine
                        };
                      }
                      return cell;
                    }),
                  );
                  setBoard(finalBoard);
                  return;
                }
              }
              updateBoardState(newBoard);
            }
          } else {
            handleCellClick(x, y);
          }
          break;
        case 'f':
        case '1':
          setShowKeyboardCursor(true);
          toggleMark(x, y);
          break;
        case 'q':
        case '2':
          setShowKeyboardCursor(true);
          toggleMark(x, y);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, board, difficulty, handleCellClick, toggleMark, updateBoardState, isResultModalOpen]);

  return (
    <div className="flex flex-col items-center px-2 sm:px-4">
      <div className="w-full max-w-6xl">
        <DifficultySelector onSelectDifficulty={handleDifficultyChange} currentDifficulty={difficulty} />
        <div className="border-4 border-[var(--game-border-dark)] bg-[var(--game-background)] p-2 max-w-fit mx-auto">
          <GameInfoBar remainingMines={remainingMines} timer={timer} score={score} />
          <Board
            board={board}
            focusedCell={focusedCell}
            showKeyboardCursor={showKeyboardCursor}
            onCellClick={handleCellClick}
            onCellAuxClick={handleCellClick}
            onCellContextMenu={handleCellContextMenu}
          />
        </div>
        <GameSettings onRestart={initializeBoard} />
      </div>
      {isResultModalOpen && (
        <GameResultModal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          gameResult={{
            status: gameState as 'won' | 'lost',
            time: timer,
            timeMs: finalClearTimeMs || (gameStartTime ? Date.now() - gameStartTime : timer * 1000),
            score,
            difficulty,
          }}
          session={session}
          onSaveRecord={!session ? handleSaveRecord : undefined}
          onPlayAgain={initializeBoard}
          saveStatus={saveStatus}
        />
      )}
    </div>
  );
};

export default Game;
