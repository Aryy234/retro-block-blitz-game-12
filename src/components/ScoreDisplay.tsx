
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  lines: number;
  level: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, lines, level }) => {
  return (
    <div className="box-retro bg-retro-black p-2 mt-4">
      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
        <div className="text-left text-retro-green">Score:</div>
        <div className="text-right text-glow">{score}</div>
        
        <div className="text-left text-retro-green">Lines:</div>
        <div className="text-right text-glow">{lines}</div>
        
        <div className="text-left text-retro-green">Level:</div>
        <div className="text-right text-glow">{level}</div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
