import React from 'react';

const SparklesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M19 3v4M17 5h4M12 3v4M10 5h4M5 17v4M3 19h4M19 17v4M17 19h4M12 17v4M10 19h4" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm p-4 border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto flex items-center gap-3">
        <SparklesIcon />
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-500">
          AI Mockup & Image Studio
        </h1>
      </div>
    </header>
  );
};

export default Header;
