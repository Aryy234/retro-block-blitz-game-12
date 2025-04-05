
import React from 'react';
import TetrisBlock from './TetrisBlock';
import { TetroShape } from '../lib/tetrominos';

interface PiecePreviewProps {
  shape: TetroShape;
  title: string;
}

const PiecePreview: React.FC<PiecePreviewProps> = ({ shape, title }) => {
  // Center the piece in a 4x4 grid for consistent display
  const renderPreview = () => {
    // Create a 4x4 empty grid
    const previewGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    
    if (!shape) return previewGrid;
    
    // Calculate offsets to center the piece
    const offsetY = Math.floor((4 - shape.length) / 2);
    const offsetX = Math.floor((4 - shape[0].length) / 2);
    
    // Place the piece in the center
    shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (y + offsetY >= 0 && y + offsetY < 4 && x + offsetX >= 0 && x + offsetX < 4) {
          previewGrid[y + offsetY][x + offsetX] = cell;
        }
      });
    });
    
    return previewGrid;
  };
  
  const previewGrid = renderPreview();
  
  return (
    <div className="mt-4">
      <h3 className="text-xs mb-1 text-retro-green text-glow">{title}</h3>
      <div className="box-retro border-2 p-1 bg-retro-black">
        <div className="grid grid-cols-4 gap-[1px]">
          {previewGrid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div key={`${rowIndex}-${cellIndex}`} className="w-4 h-4 md:w-6 md:h-6">
                {cell > 0 && <TetrisBlock type={cell} />}
                {cell === 0 && <div className="w-full h-full bg-retro-grid grid-block"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PiecePreview;
