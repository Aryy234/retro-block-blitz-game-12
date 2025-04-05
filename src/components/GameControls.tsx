
import React from 'react';

interface GameControlsProps {
  onReset: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  onReset, 
  isPaused, 
  onTogglePause,
  gameOver 
}) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button 
        onClick={onReset} 
        className="box-retro bg-retro-blue-dark hover:bg-retro-blue-light text-retro-green text-xs px-4 py-2"
      >
        NEW GAME
      </button>
      
      <button 
        onClick={onTogglePause} 
        className="box-retro bg-retro-blue-dark hover:bg-retro-blue-light text-retro-green text-xs px-4 py-2"
        disabled={gameOver}
      >
        {isPaused ? "RESUME" : "PAUSE"}
      </button>
    </div>
  );
};

export default GameControls;
