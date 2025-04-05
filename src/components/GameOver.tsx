
import React from 'react';

interface GameOverProps {
  score: number;
  onReset: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onReset }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
      <div className="box-retro bg-retro-black border-4 border-retro-green p-6 text-center">
        <h2 className="text-xl text-retro-green text-glow mb-4 animate-blink">GAME OVER</h2>
        <p className="mb-4">SCORE: <span className="text-glow">{score}</span></p>
        <button 
          onClick={onReset} 
          className="box-retro bg-retro-blue-dark hover:bg-retro-blue-light text-retro-green px-4 py-2"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOver;
