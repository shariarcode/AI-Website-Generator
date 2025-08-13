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
  const handleComingSoonClick = () => {
    alert("Feature coming soon!");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <button onClick={handleComingSoonClick} className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">Community</button>
            <button onClick={handleComingSoonClick} className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">Enterprise</button>
            <button onClick={handleComingSoonClick} className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">Resources</button>
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
                 <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={handleComingSoonClick} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors" aria-label="User Profile">
                        <UserIcon className="w-5 h-5" />
                    </button>
                    <button onClick={onSignOut} className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors" aria-label="Sign Out">
                        <LogOutIcon className="w-5 h-5" />
                    </button>
                 </div>
            ) : (
                <button 
                    onClick={onSignInClick} 
                    className="px-4 py-2 text-sm font-semibold text-light-text-primary dark:text-dark-text-primary bg-gray-100 dark:bg-dark-surface border border-transparent hover:border-light-border dark:hover:border-dark-border rounded-lg transition-colors"
                >
                    Sign In
                </button>
            )}

            <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary bg-gray-200 dark:bg-dark-surface hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
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