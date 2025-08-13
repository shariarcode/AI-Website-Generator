
import React, { useState } from 'react';

interface VercelAuthModalProps {
  onClose: () => void;
  onSave: (token: string) => void;
  isDeploying: boolean;
}

const VercelAuthModal: React.FC<VercelAuthModalProps> = ({ onClose, onSave, isDeploying }) => {
  const [token, setToken] = useState('');

  const handleSave = () => {
    if (token.trim()) {
      onSave(token.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-light-surface dark:bg-dark-surface w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-light-text-secondary dark:text-dark-text-secondary rounded-full hover:bg-gray-200 dark:hover:bg-dark-border transition-colors z-10" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8">
          <div className="mb-6 text-left">
            <h2 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">
              Publish to Vercel
            </h2>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2">
              Enter your Vercel Access Token to deploy your website. Your token will be saved in your browser's local storage for future use.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary" htmlFor="vercel-token">Vercel Access Token</label>
              <input
                id="vercel-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Ex: AbC1dEfGhIjKlMnOpQrSt"
                className="w-full mt-1 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition"
                aria-label="Vercel Access Token Input"
              />
               <p className="mt-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                You can create a new token in your Vercel account settings under the "Tokens" tab.
                {' '}
                <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                    Create a token
                </a>.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={!token.trim() || isDeploying}
            className="w-full mt-6 py-3 text-base font-semibold text-white bg-brand-blue rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-dark-bg transition-all disabled:bg-brand-blue/50 disabled:cursor-not-allowed"
          >
            {isDeploying ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VercelAuthModal;
