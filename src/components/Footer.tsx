import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 mt-8 text-retro-green text-xs">
      <div className="container mx-auto">
        <p className="mb-2">© {new Date().getFullYear()} - Desarrollado por Ariel Elizalde</p>
        <div className="flex justify-center items-center space-x-4">
          <a 
            href="mailto:marcelo-elizalde@hotmail.com"
            className="hover:text-retro-blue-light transition-colors"
          >
            marcelo-elizalde@hotmail.com
          </a>
          <span>|</span>
          <a 
            href="https://portfolioariel.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-retro-blue-light transition-colors"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 