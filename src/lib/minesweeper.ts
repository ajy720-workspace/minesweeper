// src/lib/minesweeper.ts
// Core game logic for Minesweeper implementation

/**
 * Represents the state of a single cell in the minesweeper board
 */
export type CellState = {
  /** Whether this cell contains a mine */
  isMine: boolean;
  /** Whether this cell has been revealed by the player */
  isRevealed: boolean;
  /** Whether this cell has been flagged as containing a mine */
  isFlagged: boolean;
  /** Whether this cell has been marked with a question mark */
  isQuestioned: boolean;
  /** Number of mines in the 8 adjacent cells */
  adjacentMines: number;
  /** Whether this mine exploded (caused game over) */
  isExploded?: boolean;
};

/**
 * Represents the entire minesweeper board as a 2D array of cells
 */
export type Board = CellState[][];

/**
 * Creates a new minesweeper board with mines placed randomly
 * Ensures the first click is safe by creating a 3x3 safe zone around it
 *
 * @param width - Board width in cells
 * @param height - Board height in cells
 * @param mineCount - Total number of mines to place
 * @param firstClickX - X coordinate of first click (safe zone center)
 * @param firstClickY - Y coordinate of first click (safe zone center)
 * @returns A new board with mines placed and adjacent mine counts calculated
 */
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

  // Place mines randomly, avoiding the 3x3 safe zone around first click
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    // Check if current position is in the 3x3 safe zone around first click
    const isSafeZone = Math.abs(x - firstClickX) <= 1 && Math.abs(y - firstClickY) <= 1;

    // Place mine only if cell doesn't already have one and isn't in safe zone
    if (!board[y][x].isMine && !isSafeZone) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mine counts for each non-mine cell
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[y][x].isMine) continue; // Skip mine cells

      let count = 0;
      // Check all 8 adjacent cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue; // Skip current cell

          const nx = x + dx;
          const ny = y + dy;

          // Count mines in adjacent cells within board bounds
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

/**
 * Reveals a cell and recursively reveals adjacent empty cells
 * Implements flood-fill algorithm for empty cells (adjacentMines === 0)
 *
 * @param board - Current board state
 * @param x - X coordinate of cell to reveal
 * @param y - Y coordinate of cell to reveal
 * @returns New board state with cell(s) revealed
 */
export const revealCell = (board: Board, x: number, y: number): Board => {
  // Create deep copy to avoid mutating original board
  let newBoard = JSON.parse(JSON.stringify(board));
  const cell = newBoard[y][x];

  // Don't reveal already revealed or flagged cells
  if (cell.isRevealed || cell.isFlagged) {
    return newBoard;
  }

  // Reveal the cell
  cell.isRevealed = true;

  // If cell is empty (no adjacent mines) and not a mine, recursively reveal adjacent cells
  if (cell.adjacentMines === 0 && !cell.isMine) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue; // Skip current cell

        const nx = x + dx;
        const ny = y + dy;

        // Recursively reveal adjacent cells within bounds
        if (nx >= 0 && nx < newBoard[0].length && ny >= 0 && ny < newBoard.length) {
          newBoard = revealCell(newBoard, nx, ny);
        }
      }
    }
  }

  return newBoard;
};

/**
 * Implements chord clicking - reveals all unflagged adjacent cells when
 * the number of flagged adjacent cells equals the cell's adjacent mine count
 * This is an advanced minesweeper technique for faster gameplay
 *
 * @param board - Current board state
 * @param x - X coordinate of cell to chord
 * @param y - Y coordinate of cell to chord
 * @returns New board state with adjacent cells potentially revealed
 */
export const chordCell = (board: Board, x: number, y: number): Board => {
  // Create deep copy to avoid mutating original board
  let newBoard = JSON.parse(JSON.stringify(board));
  const cell = newBoard[y][x];

  // Can only chord revealed cells that have adjacent mines
  if (!cell.isRevealed || cell.adjacentMines === 0) {
    return newBoard;
  }

  // Count flagged adjacent cells
  let flagCount = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue; // Skip current cell

      const nx = x + dx;
      const ny = y + dy;

      // Count flags in adjacent cells within bounds
      if (nx >= 0 && nx < newBoard[0].length && ny >= 0 && ny < newBoard.length && newBoard[ny][nx].isFlagged) {
        flagCount++;
      }
    }
  }

  // Only reveal adjacent cells if flag count matches adjacent mine count
  // This ensures the player has correctly identified all adjacent mines
  if (flagCount === cell.adjacentMines) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue; // Skip current cell

        const nx = x + dx;
        const ny = y + dy;

        // Reveal all unflagged adjacent cells within bounds
        if (nx >= 0 && nx < newBoard[0].length && ny >= 0 && ny < newBoard.length && !newBoard[ny][nx].isFlagged) {
          newBoard = revealCell(newBoard, nx, ny);
        }
      }
    }
  }

  return newBoard;
};
