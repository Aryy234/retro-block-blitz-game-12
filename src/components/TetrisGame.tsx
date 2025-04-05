
import React, { useState, useEffect } from 'react';
import { useTetris } from '../hooks/useTetris';
import TetrisGrid from './TetrisGrid';
import PiecePreview from './PiecePreview';
import ScoreDisplay from './ScoreDisplay';
import GameControls from './GameControls';
import Instructions from './Instructions';
import GameOver from './GameOver';

const TetrisGame: React.FC = () => {
  const {
    gameState,
    resetGame,
    getShadowPosition
  } = useTetris();

  const [isPaused, setIsPaused] = useState(false);
  const shadowY = getShadowPosition();

  // Pause/resume game
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Handle reset
  const handleReset = () => {
    setIsPaused(false);
    resetGame();
  };

  // Pause game if window loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className="tetris-container relative select-none">
      <div className="mx-auto max-w-4xl p-4">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-pixel text-retro-green text-glow">RETRO TETRIS</h1>
        </div>

        {/* Main game layout */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4">
          {/* Left sidebar */}
          <div className="md:order-1 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4">
            <ScoreDisplay 
              score={gameState.score} 
              lines={gameState.lines} 
              level={gameState.level} 
            />
            <Instructions />
          </div>

          {/* Game board */}
          <div className="md:order-2 relative">
            <TetrisGrid 
              board={gameState.board} 
              currentPiece={gameState.currentPiece} 
              shadowY={shadowY} 
            />
            {gameState.gameOver && (
              <GameOver score={gameState.score} onReset={handleReset} />
            )}
            {isPaused && !gameState.gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-retro-green text-2xl animate-blink">PAUSED</div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="md:order-3 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-4">
            <div className="md:order-1">
              <PiecePreview 
                shape={gameState.nextPiece.shape} 
                title="NEXT" 
              />
              {gameState.heldPiece && (
                <PiecePreview 
                  shape={gameState.heldPiece.shape} 
                  title="HOLD" 
                />
              )}
            </div>
            <div className="md:order-2">
              <GameControls 
                onReset={handleReset} 
                isPaused={isPaused} 
                onTogglePause={togglePause} 
                gameOver={gameState.gameOver} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;
