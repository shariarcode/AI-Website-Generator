
import React, { useState, useRef } from 'react';
import { EXAMPLE_PROMPTS } from '../constants';
import LinkIcon from './icons/LinkIcon';
import SparklesIcon from './icons/SparklesIcon';
import ImageIcon from './icons/ImageIcon';
import { enhancePrompt } from '../services/geminiService';
import { ImageFile } from '../types';
import CloseIcon from './icons/CloseIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  image: ImageFile | null;
  setImage: (image: ImageFile | null) => void;
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
  image,
  setImage,
}) => {
  const isButtonDisabled = isLoading || !prompt.trim();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: reader.result as string,
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    if (e.target) {
        e.target.value = '';
    }
  };

  const handleComingSoonClick = () => {
    alert("Feature coming soon!");
  };
  
  const placeholderText = "Type your idea and we'll bring it to life...";

  return (
    <div className="w-full max-w-3xl text-center">
      <div className="relative mb-4 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-lg transition-colors">
        {image && (
          <div className="p-3 border-b border-light-border dark:border-dark-border">
            <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={image.data} alt="Preview" className="w-12 h-12 object-cover rounded-md" />
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{image.name}</span>
                </div>
                <button 
                    onClick={() => setImage(null)} 
                    className="p-1 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                    aria-label="Remove image"
                >
                    <CloseIcon className="w-5 h-5"/>
                </button>
            </div>
          </div>
        )}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholderText}
          className="w-full h-36 p-4 pt-4 pb-12 bg-transparent text-lg text-light-text-primary dark:text-dark-text-primary rounded-xl focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none transition-colors"
          disabled={isLoading || isEnhancing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isButtonDisabled) handleGenerate();
            }
          }}
        />
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
        />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <button onClick={handleComingSoonClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Attach link" disabled={isLoading || isEnhancing}><LinkIcon className="w-5 h-5"/></button>
          
          <button onClick={handleEnhanceClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Enhance with AI" disabled={!prompt.trim() || isLoading || isEnhancing}>
            {isEnhancing ? <LoadingSpinner className="text-light-text-secondary dark:text-dark-text-secondary" /> : <SparklesIcon className="w-5 h-5"/>}
          </button>

          <button onClick={handleImageUploadClick} className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Upload image" disabled={isLoading || isEnhancing || !!image}><ImageIcon className="w-5 h-5"/></button>
        </div>
        {enhanceError && <p className="absolute text-xs text-red-400 bottom-[-20px] left-4">{enhanceError}</p>}
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isButtonDisabled || isEnhancing}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold text-white bg-brand-blue rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue dark:focus:ring-offset-dark-bg disabled:bg-brand-blue/50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? <LoadingSpinner /> : null}
        {isLoading ? 'Generating Website...' : 'Generate Website'}
      </button>

      <div className="mt-8">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary mr-2 hidden sm:inline">Or try an example:</span>
          {EXAMPLE_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              disabled={isLoading || isEnhancing}
              className="px-4 py-2 text-sm text-light-text-secondary dark:text-dark-text-secondary bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-full hover:bg-gray-200 dark:hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-light-text-secondary dark:text-dark-text-secondary h-5">
        {/* Daily limit message removed */}
      </div>

    </div>
  );
};

export default PromptForm;