// src/lib/minesweeper.ts

export type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  adjacentMines: number;
};

export type Board = CellState[][];

export const createBoard = (
  width: number,
  height: number,
  mineCount: number,
  firstClickX: number,
  firstClickY: number,
): Board => {
  const board: Board = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      isQuestioned: false,
      adjacentMines: 0,
    })),
  );

  // --- 1. Place mines ---
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    const isSafeZone = Math.abs(x - firstClickX) <= 1 && Math.abs(y - firstClickY) <= 1;

    if (!board[y][x].isMine && !isSafeZone) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // --- 2. Calculate adjacent mines for each cell ---
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[y][x].isMine) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height && board[ny][nx].isMine) {
            count++;
          }
        }
      }
      board[y][x].adjacentMines = count;
    }
  }

  return board;
};

export const revealCell = (board: Board, x: number, y: number): Board => {
  let newBoard = JSON.parse(JSON.stringify(board));
  const cell = newBoard[y][x];

  if (cell.isRevealed || cell.isFlagged) {
    return newBoard;
  }

  cell.isRevealed = true;

  if (cell.adjacentMines === 0 && !cell.isMine) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < newBoard[0].length && ny >= 0 && ny < newBoard.length) {
          newBoard = revealCell(newBoard, nx, ny);
        }
      }
    }
  }

  return newBoard;
};

export const chordCell = (board: Board, x: number, y: number): Board => {
  let newBoard = JSON.parse(JSON.stringify(board));
  const cell = newBoard[y][x];

  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return newBoard;
  }

  let flagCount = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < newBoard[0].length && ny >= 0 && ny < newBoard.length && newBoard[ny][nx].isFlagged) {
        flagCount++;
      }
    }
  }

  if (flagCount === cell.adjacentMines) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < newBoard[0].length && ny >= 0 && ny < newBoard.length && !newBoard[ny][nx].isFlagged) {
          newBoard = revealCell(newBoard, nx, ny);
        }
      }
    }
  }

  return newBoard;
};
