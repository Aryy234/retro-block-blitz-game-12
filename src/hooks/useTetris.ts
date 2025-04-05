import { useState, useEffect, useCallback } from 'react';
import { 
  TETROMINOES, 
  TetroShape, 
  TetroType, 
  isValidPosition,
  randomTetromino,
  rotateTetromino 
} from '../lib/tetrominos';

// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_DROP_TIME = 1000; // in ms
const SPEED_UP_DROP_TIME = 50; // in ms when down arrow is pressed

// Define Game State
export interface TetrisState {
  board: number[][];
  currentPiece: {
    shape: TetroShape;
    type: TetroType;
    x: number;
    y: number;
  };
  nextPiece: {
    shape: TetroShape;
    type: TetroType;
  };
  heldPiece: {
    shape: TetroShape;
    type: TetroType;
  } | null;
  hasHeldThisTurn: boolean;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
}

export const useTetris = () => {
  // Create empty board
  const createEmptyBoard = (): number[][] => 
    Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(0));
  
  // Generate new piece
  const generateNewPiece = () => {
    const type = randomTetromino();
    return {
      shape: TETROMINOES[type],
      type,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[type][0].length / 2),
      y: 0
    };
  };

  // Initialize state
  const [gameState, setGameState] = useState<TetrisState>({
    board: createEmptyBoard(),
    currentPiece: generateNewPiece(),
    nextPiece: {
      shape: TETROMINOES[randomTetromino()],
      type: randomTetromino(),
    },
    heldPiece: null,
    hasHeldThisTurn: false,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false
  });

  // Game timing
  const [dropTime, setDropTime] = useState<number | null>(INITIAL_DROP_TIME);
  const [speedUp, setSpeedUp] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: generateNewPiece(),
      nextPiece: {
        shape: TETROMINOES[randomTetromino()],
        type: randomTetromino(),
      },
      heldPiece: null,
      hasHeldThisTurn: false,
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false
    });
    setDropTime(INITIAL_DROP_TIME);
    setIsPaused(false);
  }, []);

  // Merge current tetromino with the board
  const mergePieceWithBoard = useCallback((board: number[][], piece: TetrisState['currentPiece']) => {
    const newBoard = [...board.map(row => [...row])];
    
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = y + piece.y;
          const boardX = x + piece.x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = cell;
          }
        }
      });
    });
    
    return newBoard;
  }, []);

  // Check for completed rows and clear them
  const clearCompletedRows = useCallback((board: number[][]) => {
    let clearedRows = 0;
    const newBoard = board.filter(row => {
      const isRowComplete = row.every(cell => cell !== 0);
      if (isRowComplete) clearedRows++;
      return !isRowComplete;
    });
    
    // Add empty rows at the top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { newBoard, clearedRows };
  }, []);

  // Calculate score based on cleared rows
  const calculateScore = useCallback((clearedRows: number, level: number) => {
    const basePoints = [0, 40, 100, 300, 1200]; // Points for 0, 1, 2, 3, 4 rows cleared
    return basePoints[clearedRows] * level;
  }, []);

  // Move tetromino
  const moveTetromino = useCallback((x: number, y: number) => {
    if (isPaused) return;
    
    setGameState(prev => {
      const newX = prev.currentPiece.x + x;
      const newY = prev.currentPiece.y + y;
      
      if (isValidPosition(prev.board, prev.currentPiece.shape, newX, newY)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            x: newX,
            y: newY
          }
        };
      }
      
      // If moving down and invalid position, piece has landed
      if (y > 0) {
        // Check for game over
        if (prev.currentPiece.y <= 0) {
          return { ...prev, gameOver: true };
        }
        
        // Merge piece with board
        const newBoard = mergePieceWithBoard(prev.board, prev.currentPiece);
        
        // Clear completed rows
        const { newBoard: clearedBoard, clearedRows } = clearCompletedRows(newBoard);
        
        // Calculate new score and level
        const newScore = prev.score + calculateScore(clearedRows, prev.level);
        const newLines = prev.lines + clearedRows;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        // Generate new piece
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: {
            ...prev.nextPiece,
            x: Math.floor(BOARD_WIDTH / 2) - Math.floor(prev.nextPiece.shape[0].length / 2),
            y: 0
          },
          nextPiece: {
            shape: TETROMINOES[randomTetromino()],
            type: randomTetromino(),
          },
          hasHeldThisTurn: false,
          score: newScore,
          lines: newLines,
          level: newLevel
        };
      }
      
      return prev;
    });
  }, [calculateScore, clearCompletedRows, isPaused, mergePieceWithBoard]);

  // Rotate tetromino
  const rotatePiece = useCallback(() => {
    if (isPaused) return;
    
    setGameState(prev => {
      const rotatedShape = rotateTetromino(prev.currentPiece.shape);
      
      // Check if rotated position is valid
      if (isValidPosition(prev.board, rotatedShape, prev.currentPiece.x, prev.currentPiece.y)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            shape: rotatedShape
          }
        };
      }
      
      // Wall kick attempts (try shifting the piece to make rotation possible)
      const kicks = [
        { x: 1, y: 0 },  // Try right
        { x: -1, y: 0 }, // Try left
        { x: 0, y: -1 }, // Try up
        { x: 2, y: 0 },  // Try two steps right
        { x: -2, y: 0 }, // Try two steps left
      ];
      
      for (const kick of kicks) {
        if (isValidPosition(prev.board, rotatedShape, prev.currentPiece.x + kick.x, prev.currentPiece.y + kick.y)) {
          return {
            ...prev,
            currentPiece: {
              ...prev.currentPiece,
              shape: rotatedShape,
              x: prev.currentPiece.x + kick.x,
              y: prev.currentPiece.y + kick.y
            }
          };
        }
      }
      
      // If rotation not possible, return unchanged state
      return prev;
    });
  }, [isPaused]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (isPaused) return;
    
    setGameState(prev => {
      let dropDistance = 0;
      let newY = prev.currentPiece.y;
      
      // Find the maximum distance the piece can drop
      while (isValidPosition(prev.board, prev.currentPiece.shape, prev.currentPiece.x, newY + 1)) {
        newY++;
        dropDistance++;
      }
      
      const landedPiece = {
        ...prev.currentPiece,
        y: newY
      };
      
      // Check for game over
      if (landedPiece.y <= 0) {
        return { ...prev, gameOver: true };
      }
      
      // Merge piece with board
      const newBoard = mergePieceWithBoard(prev.board, landedPiece);
      
      // Clear completed rows
      const { newBoard: clearedBoard, clearedRows } = clearCompletedRows(newBoard);
      
      // Calculate new score (add bonus for hard drop)
      const hardDropBonus = dropDistance * 2;
      const newScore = prev.score + calculateScore(clearedRows, prev.level) + hardDropBonus;
      const newLines = prev.lines + clearedRows;
      const newLevel = Math.floor(newLines / 10) + 1;
      
      // Generate new piece
      return {
        ...prev,
        board: clearedBoard,
        currentPiece: {
          ...prev.nextPiece,
          x: Math.floor(BOARD_WIDTH / 2) - Math.floor(prev.nextPiece.shape[0].length / 2),
          y: 0
        },
        nextPiece: {
          shape: TETROMINOES[randomTetromino()],
          type: randomTetromino(),
        },
        hasHeldThisTurn: false,
        score: newScore,
        lines: newLines,
        level: newLevel
      };
    });
  }, [calculateScore, clearCompletedRows, isPaused, mergePieceWithBoard]);

  // Hold piece
  const holdPiece = useCallback(() => {
    if (isPaused) return;
    
    setGameState(prev => {
      // Skip if already held this turn
      if (prev.hasHeldThisTurn) return prev;
      
      // If no held piece, swap with next piece
      if (!prev.heldPiece) {
        return {
          ...prev,
          currentPiece: {
            ...prev.nextPiece,
            x: Math.floor(BOARD_WIDTH / 2) - Math.floor(prev.nextPiece.shape[0].length / 2),
            y: 0
          },
          nextPiece: {
            shape: TETROMINOES[randomTetromino()],
            type: randomTetromino(),
          },
          heldPiece: {
            shape: prev.currentPiece.shape,
            type: prev.currentPiece.type
          },
          hasHeldThisTurn: true
        };
      }
      
      // Swap current piece with held piece
      const heldShape = prev.heldPiece.shape;
      const heldType = prev.heldPiece.type;
      
      return {
        ...prev,
        currentPiece: {
          shape: heldShape,
          type: heldType,
          x: Math.floor(BOARD_WIDTH / 2) - Math.floor(heldShape[0].length / 2),
          y: 0
        },
        heldPiece: {
          shape: prev.currentPiece.shape,
          type: prev.currentPiece.type
        },
        hasHeldThisTurn: true
      };
    });
  }, [isPaused]);

  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Drop piece automatically based on level
  useEffect(() => {
    if (!dropTime || gameState.gameOver || isPaused) return;
    
    const dropSpeedByLevel = INITIAL_DROP_TIME - (gameState.level - 1) * 50;
    const currentDropTime = speedUp ? SPEED_UP_DROP_TIME : Math.max(dropSpeedByLevel, 100);
    
    const dropInterval = setInterval(() => {
      moveTetromino(0, 1);
    }, currentDropTime);
    
    return () => clearInterval(dropInterval);
  }, [gameState.gameOver, gameState.level, dropTime, moveTetromino, speedUp, isPaused]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (!isPaused) moveTetromino(-1, 0);
          break;
        case 'ArrowRight':
          if (!isPaused) moveTetromino(1, 0);
          break;
        case 'ArrowDown':
          if (!isPaused) setSpeedUp(true);
          break;
        case 'ArrowUp':
          if (!isPaused) rotatePiece();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
        case ' ':
          if (!isPaused) hardDrop();
          break;
        case 'c':
        case 'C':
          if (!isPaused) holdPiece();
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setSpeedUp(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.gameOver, hardDrop, holdPiece, moveTetromino, rotatePiece, isPaused, togglePause]);

  // Calculate shadow position for current piece
  const getShadowPosition = useCallback(() => {
    let shadowY = gameState.currentPiece.y;
    
    while (isValidPosition(
      gameState.board, 
      gameState.currentPiece.shape, 
      gameState.currentPiece.x, 
      shadowY + 1
    )) {
      shadowY++;
    }
    
    return shadowY;
  }, [gameState.board, gameState.currentPiece.shape, gameState.currentPiece.x, gameState.currentPiece.y]);

  return {
    gameState,
    resetGame,
    moveTetromino,
    rotatePiece,
    hardDrop,
    holdPiece,
    getShadowPosition,
    togglePause,
    isPaused
  };
};
