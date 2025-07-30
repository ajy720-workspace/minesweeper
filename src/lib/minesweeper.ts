// src/lib/minesweeper.ts

export type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  adjacentMines: number;
};

export type Board = CellState[][];

export const createBoard = (width: number, height: number, mineCount: number): Board => {
  // First, create a blank board
  const board: Board = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      isQuestioned: false,
      adjacentMines: 0,
    }))
  );

  // This is a placeholder.
  // Mine placement and adjacent mine calculation will be implemented later.
  // For now, it just returns a blank board.

  return board;
};
