
import React from 'react';
import TetrisBlock from './TetrisBlock';
import { TetrisState } from '../hooks/useTetris';

interface TetrisGridProps {
  board: number[][];
  currentPiece: TetrisState['currentPiece'];
  shadowY: number;
}

const TetrisGrid: React.FC<TetrisGridProps> = ({ board, currentPiece, shadowY }) => {
  // Create a copy of the board to render
  const displayBoard = board.map(row => [...row]);

  // Add shadow piece to display board
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        const boardY = y + shadowY;
        const boardX = x + currentPiece.x;
        
        // Only render shadow if it's within board bounds and the position is empty
        if (
          boardY >= 0 && 
          boardY < displayBoard.length && 
          boardX >= 0 && 
          boardX < displayBoard[0].length && 
          displayBoard[boardY][boardX] === 0
        ) {
          // Use negative values to indicate shadow cells
          displayBoard[boardY][boardX] = -cell;
        }
      }
    });
  });

  // Add current piece to display board
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        const boardY = y + currentPiece.y;
        const boardX = x + currentPiece.x;
        
        // Only render if within board bounds
        if (
          boardY >= 0 && 
          boardY < displayBoard.length && 
          boardX >= 0 && 
          boardX < displayBoard[0].length
        ) {
          displayBoard[boardY][boardX] = cell;
        }
      }
    });
  });

  return (
    <div className="box-retro bg-retro-black border-4 border-retro-border">
      <div className="grid grid-cols-10 gap-[1px]">
        {displayBoard.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <TetrisBlock 
              key={`${rowIndex}-${cellIndex}`} 
              type={Math.abs(cell)} 
              ghost={cell < 0}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TetrisGrid;
