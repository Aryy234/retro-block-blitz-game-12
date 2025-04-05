
// Tetromino shapes and utilities
export type TetroShape = number[][];
export type TetroType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
export type TetroColors = Record<TetroType, string>;

// Each tetromino shape represented as a 2D matrix
export const TETROMINOES: Record<TetroType, TetroShape> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  O: [
    [4, 4],
    [4, 4],
  ],
  S: [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  Z: [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
};

// Retro color palette for each tetromino type
export const TETRO_COLORS: TetroColors = {
  I: 'rgb(0, 255, 255)', // Cyan
  J: 'rgb(0, 0, 255)',   // Blue
  L: 'rgb(255, 165, 0)', // Orange
  O: 'rgb(255, 255, 0)', // Yellow
  S: 'rgb(0, 255, 0)',   // Green
  T: 'rgb(128, 0, 128)', // Purple
  Z: 'rgb(255, 0, 0)',   // Red
};

// Get random tetromino type
export const randomTetromino = (): TetroType => {
  const tetroTypes: TetroType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return tetroTypes[Math.floor(Math.random() * tetroTypes.length)];
};

// Rotate a tetromino matrix (clockwise)
export const rotateTetromino = (matrix: TetroShape): TetroShape => {
  const N = matrix.length;
  const result = Array(N).fill(0).map(() => Array(N).fill(0));

  // Transpose matrix
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j][N - 1 - i] = matrix[i][j];
    }
  }

  return result;
};

// Check if position is valid (not colliding with other blocks or out of bounds)
export const isValidPosition = (
  board: number[][],
  tetromino: TetroShape,
  offsetX: number,
  offsetY: number
): boolean => {
  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      if (tetromino[y][x] !== 0) {
        const boardX = x + offsetX;
        const boardY = y + offsetY;
        
        // Check if outside the board boundaries or colliding with non-empty cell
        if (
          boardX < 0 || 
          boardX >= board[0].length || 
          boardY >= board.length ||
          (boardY >= 0 && board[boardY][boardX] !== 0)
        ) {
          return false;
        }
      }
    }
  }
  return true;
};
