
import React from 'react';
import { TETRO_COLORS } from '../lib/tetrominos';

interface TetrisBlockProps {
  type: number;
  ghost?: boolean;
}

const TetrisBlock: React.FC<TetrisBlockProps> = ({ type, ghost = false }) => {
  // No block for empty cells
  if (type === 0) return <div className="grid-block bg-retro-grid w-6 h-6 md:w-8 md:h-8"></div>;

  // Get color based on tetromino type (1-7)
  const getBlockColor = () => {
    const colorMap = {
      1: TETRO_COLORS.I,
      2: TETRO_COLORS.J,
      3: TETRO_COLORS.L,
      4: TETRO_COLORS.O,
      5: TETRO_COLORS.S,
      6: TETRO_COLORS.T,
      7: TETRO_COLORS.Z,
    };

    return colorMap[type as keyof typeof colorMap] || 'rgb(128, 128, 128)';
  };

  const style = {
    backgroundColor: ghost ? 'transparent' : getBlockColor(),
    borderColor: getBlockColor(),
    borderWidth: ghost ? '2px' : '0',
    borderStyle: 'dashed',
    opacity: ghost ? 0.5 : 1,
  };

  return (
    <div 
      className="grid-block w-6 h-6 md:w-8 md:h-8"
      style={style}
    />
  );
};

export default TetrisBlock;
