
import React from 'react';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';
import UserIcon from './icons/UserIcon';
import LogOutIcon from './icons/LogOutIcon';
import Logo from './Logo';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  onSignInClick: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode, isAuthenticated, onSignInClick, onSignOut }) => {
  return (
    <header className="flex-shrink-0 bg-dark-bg z-50">
      <div className="px-4 h-14 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
            {isAuthenticated ? (
                 <div className="flex items-center gap-4">
                    <button onClick={onSignOut} className="p-2 rounded-full text-dark-text-secondary hover:bg-dark-surface transition-colors" aria-label="Sign Out">
                        <LogOutIcon className="w-5 h-5" />
                    </button>
                 </div>
            ) : (
                <button 
                    onClick={onSignInClick} 
                    className="px-4 py-1.5 text-sm font-semibold text-dark-text-primary bg-dark-surface border border-dark-border rounded-md hover:bg-gray-800 transition-colors"
                >
                    Sign In
                </button>
            )}

            <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-dark-text-secondary bg-dark-surface hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
            >
            {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
