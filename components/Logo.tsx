import React from 'react';

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center gap-2" aria-label="AI Website Generator Home">
      <div className="flex-shrink-0 w-8 h-8 bg-brand-blue rounded-md flex items-center justify-center">
        <span className="text-white font-extrabold text-lg tracking-tighter">AI</span>
      </div>
      <span className="text-xl font-bold tracking-tight text-light-text-primary dark:text-dark-text-primary hidden sm:block whitespace-nowrap">
        Website Generator
      </span>
    </a>
  );
};

export default Logo;