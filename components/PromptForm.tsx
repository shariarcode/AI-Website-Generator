import React, { useState } from 'react';
import { EXAMPLE_PROMPTS } from '../constants';
import LinkIcon from './icons/LinkIcon';
import SparklesIcon from './icons/SparklesIcon';
import ImageIcon from './icons/ImageIcon';
import { enhancePrompt } from '../services/geminiService';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  hasGenerationsLeft: boolean;
  remainingGenerations: number;
}

const LoadingSpinner: React.FC<{className?: string}> = ({ className = "text-white" }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  handleGenerate,
  isLoading,
  hasGenerationsLeft,
  remainingGenerations,
}) => {
  const isButtonDisabled = isLoading || !hasGenerationsLeft || !prompt.trim();

  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  const handleEnhanceClick = async () => {
    if (!prompt.trim() || isEnhancing || isLoading) return;
    setIsEnhancing(true);
    setEnhanceError(null);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (err: any) {
      setEnhanceError(err.message || "Failed to enhance prompt.");
      setTimeout(() => setEnhanceError(null), 3000); // Clear error after 3s
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleComingSoonClick = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="w-full max-w-3xl text-center">
      <div className="relative mb-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-lg transition-colors">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your idea and we'll bring it to life..."
          className="w-full h-36 p-4 pt-4 pb-12 bg-transparent text-lg text-light-text-primary dark:text-dark-text-primary rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none transition-colors"
          disabled={!hasGenerationsLeft || isLoading || isEnhancing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isButtonDisabled) handleGenerate();
            }
          }}
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <button onClick={handleComingSoonClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Attach link" disabled={isLoading || isEnhancing}><LinkIcon className="w-5 h-5"/></button>
          
          <button onClick={handleEnhanceClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Enhance with AI" disabled={!prompt.trim() || isLoading || isEnhancing}>
            {isEnhancing ? <LoadingSpinner className="text-light-text-secondary dark:text-dark-text-secondary" /> : <SparklesIcon className="w-5 h-5"/>}
          </button>

          <button onClick={handleComingSoonClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Upload image" disabled={isLoading || isEnhancing}><ImageIcon className="w-5 h-5"/></button>
        </div>
        {enhanceError && <p className="absolute text-xs text-red-400 bottom-[-20px] left-4">{enhanceError}</p>}
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isButtonDisabled || isEnhancing}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white bg-brand-blue rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-dark-bg disabled:bg-brand-blue/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? <LoadingSpinner /> : null}
        {isLoading ? 'Generating...' : 'Generate Website'}
      </button>

      <div className="mt-8">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary mr-2 hidden sm:inline">Or try an example:</span>
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              disabled={!hasGenerationsLeft || isLoading || isEnhancing}
              className="px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-full hover:bg-gray-200 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-light-text-secondary dark:text-dark-text-secondary h-5">
        {!hasGenerationsLeft && (
          <p className="font-semibold text-yellow-500 dark:text-yellow-400">
            You've used all your free generations. Come back tomorrow for more!
          </p>
        )}
      </div>

    </div>
  );
};

export default PromptForm;