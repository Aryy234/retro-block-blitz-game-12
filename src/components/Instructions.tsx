
import React from 'react';

const Instructions: React.FC = () => {
  return (
    <div className="box-retro bg-retro-black p-2 mt-4 text-xs">
      <h3 className="text-center mb-2 text-glow">CONTROLS</h3>
      <div className="grid grid-cols-2 gap-1">
        <div className="text-left text-retro-green">←→ :</div>
        <div className="text-left">MOVE</div>
        
        <div className="text-left text-retro-green">↑ :</div>
        <div className="text-left">ROTATE</div>
        
        <div className="text-left text-retro-green">↓ :</div>
        <div className="text-left">SPEED UP</div>
        
        <div className="text-left text-retro-green">SPACE :</div>
        <div className="text-left">DROP</div>
        
        <div className="text-left text-retro-green">C :</div>
        <div className="text-left">HOLD</div>
      </div>
    </div>
  );
};

export default Instructions;
