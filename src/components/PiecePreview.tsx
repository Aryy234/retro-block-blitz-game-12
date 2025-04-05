import React from 'react';
import TetrisBlock from './TetrisBlock';
import { TetroShape } from '../lib/tetrominos';

interface PiecePreviewProps {
  shape: TetroShape;
  title: string;
}

const PiecePreview: React.FC<PiecePreviewProps> = ({ shape, title }) => {
  const renderPreview = () => {
    if (!shape) return null;

    // Eliminar filas y columnas vacías
    const rows = shape.length;
    const cols = shape[0].length;
    
    return (
      <div className="grid" style={{ 
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
      }}>
        {shape.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div 
              key={`${rowIndex}-${cellIndex}`} 
              className="w-6 h-6 md:w-8 md:h-8"
            >
              {cell > 0 ? (
                <TetrisBlock type={cell} />
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-xs mb-1 text-retro-green text-glow">{title}</h3>
      <div className="box-retro border-2 p-3 bg-retro-black flex items-center justify-center">
        {renderPreview()}
      </div>
    </div>
  );
};

export default PiecePreview;
