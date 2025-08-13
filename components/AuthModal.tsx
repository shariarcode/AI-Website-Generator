
import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSignIn, onSignUp }) => {
  const [isSignInView, setIsSignInView] = useState(true);

  // Form states (kept simple for simulation)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignInView) {
      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }
      onSignIn();
    } else {
      if (!name || !email || !password) {
        alert("Please fill in all fields.");
        return;
      }
      onSignUp();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-light-surface dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-light-text-secondary dark:text-dark-text-secondary rounded-full hover:bg-gray-200 dark:hover:bg-dark-border transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
              {isSignInView ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              {isSignInView ? "Sign in to continue your journey." : "Join us and start creating today."}
            </p>
          </div>
          
          <form onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              {!isSignInView && (
                <div>
                  <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full mt-1 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full mt-1 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full mt-8 py-3 text-base font-semibold text-white bg-brand-blue rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-dark-bg transition-all"
            >
              {isSignInView ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {isSignInView ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button onClick={() => setIsSignInView(!isSignInView)} className="ml-1 font-semibold text-brand-blue hover:underline">
              {isSignInView ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
