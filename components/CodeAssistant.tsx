
import React, { useState, useRef, useEffect } from 'react';
import { EXAMPLE_PROMPTS } from '../constants';
import LinkIcon from './icons/LinkIcon';
import SparklesIcon from './icons/SparklesIcon';
import ImageIcon from './icons/ImageIcon';
import { enhancePrompt } from '../services/geminiService';
import { ImageFile, ChatMessage } from '../types';
import CloseIcon from './icons/CloseIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';

interface CodeAssistantProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  image: ImageFile | null;
  setImage: (image: ImageFile | null) => void;
  chatHistory: ChatMessage[];
  onSendMessage: (instruction: string) => void;
  isModifying: boolean;
  hasGenerated: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const LoadingSpinner: React.FC<{className?: string}> = ({ className = "text-white" }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CodeAssistant: React.FC<CodeAssistantProps> = ({
  prompt, setPrompt, handleGenerate, isLoading, image, setImage,
  chatHistory, onSendMessage, isModifying, hasGenerated,
  error, setError
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isModifying]);
  
  const handleEnhanceClick = async () => {
    if (!prompt.trim() || isEnhancing || isLoading) return;
    setIsEnhancing(true);
    setEnhanceError(null);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (err: any) {
      setEnhanceError(err.message || "Failed to enhance prompt.");
      setTimeout(() => setEnhanceError(null), 3000);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleImageUploadClick = () => { fileInputRef.current?.click(); };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WEBP).'); return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ data: reader.result as string, mimeType: file.type, name: file.name });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleSendInstruction = () => {
    if(instruction.trim() && !isModifying) {
      onSendMessage(instruction);
      setInstruction('');
    }
  };

  const isButtonDisabled = isLoading || !prompt.trim();

  const InitialPromptView = () => (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">What do you want to build?</h3>
      <p className="text-sm text-dark-text-secondary">Describe your website idea or provide an image for inspiration.</p>
      
      <div className="relative bg-dark-bg border border-dark-border rounded-lg">
        {image && (
          <div className="p-2 border-b border-dark-border">
            <div className="bg-dark-surface rounded-md p-2 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                    <img src={image.data} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    <span className="text-sm text-dark-text-secondary truncate">{image.name}</span>
                </div>
                <button onClick={() => setImage(null)} className="p-1 rounded-full text-dark-text-secondary hover:bg-dark-border" aria-label="Remove image">
                    <CloseIcon className="w-4 h-4"/>
                </button>
            </div>
          </div>
        )}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A minimal landing page for a new SaaS product..."
          className="w-full h-36 p-3 bg-transparent text-base text-dark-text-primary focus:outline-none resize-none"
          disabled={isLoading || isEnhancing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!isButtonDisabled) handleGenerate(); }
          }}
        />
         <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/jpeg,image/png,image/webp" className="hidden"/>
         <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <button onClick={handleEnhanceClick} className="text-dark-text-secondary hover:text-dark-text-primary disabled:opacity-50" aria-label="Enhance with AI" disabled={!prompt.trim() || isLoading || isEnhancing}>
            {isEnhancing ? <LoadingSpinner className="text-dark-text-secondary" /> : <SparklesIcon className="w-5 h-5"/>}
          </button>
          <button onClick={handleImageUploadClick} className="text-dark-text-secondary hover:text-dark-text-primary disabled:opacity-50" aria-label="Upload image" disabled={isLoading || isEnhancing || !!image}><ImageIcon className="w-5 h-5"/></button>
        </div>
      </div>
      
       <button onClick={handleGenerate} disabled={isButtonDisabled || isEnhancing} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-base font-semibold text-white bg-brand-blue rounded-lg hover:bg-blue-600 disabled:bg-brand-blue/50 transition-colors">
        {isLoading ? <LoadingSpinner /> : null}
        {isLoading ? 'Generating...' : 'Generate'}
      </button>

      <div>
        <p className="text-sm text-dark-text-secondary mb-2">Or try an example:</p>
         <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.slice(0,2).map((p) => (
                <button key={p} onClick={() => setPrompt(p)} disabled={isLoading || isEnhancing} className="px-3 py-1.5 text-xs text-dark-text-secondary bg-dark-bg border border-dark-border rounded-md hover:bg-dark-border disabled:opacity-50">
                {p}
                </button>
            ))}
         </div>
      </div>
    </div>
  );

  const ChatView = () => (
    <div className="flex-grow flex flex-col overflow-hidden">
        <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
            {chatHistory.map((msg, index) => (
                <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-dark-bg flex items-center justify-center ${msg.role === 'model' ? 'text-brand-blue': ''}`}>
                        {msg.role === 'model' ? <SparklesIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-grow py-2 px-3 rounded-lg bg-dark-bg text-sm text-dark-text-primary whitespace-pre-wrap">{msg.text}</div>
                </div>
            ))}
            {isModifying && (
                 <div className="flex items-start gap-3 text-dark-text-secondary">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-bg flex items-center justify-center text-brand-blue"><SparklesIcon className="w-5 h-5" /></div>
                    <div className="flex-grow p-3 rounded-lg bg-dark-bg flex items-center"><LoadingSpinner /> <span className="ml-2 text-sm">Thinking...</span></div>
                </div>
            )}
        </div>
        <div className="p-4 border-t border-dark-border">
            <div className="relative">
                <textarea value={instruction} onChange={e => setInstruction(e.target.value)} placeholder="e.g., Change the hero title..." className="w-full h-24 p-3 pr-12 bg-dark-bg text-sm text-dark-text-primary rounded-lg border border-dark-border focus:ring-1 focus:ring-brand-blue focus:outline-none resize-none" disabled={isModifying} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInstruction(); } }}/>
                <button onClick={handleSendInstruction} disabled={!instruction.trim() || isModifying} className="absolute top-3 right-3 p-2 rounded-lg bg-brand-blue text-white hover:bg-blue-600 disabled:bg-brand-blue/50" aria-label="Send instruction">
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );


  return (
    <aside className="bg-dark-surface border-r border-dark-border flex flex-col">
        <header className="p-4 border-b border-dark-border h-[57px]">
            <h2 className="font-bold text-lg">Code Assistant</h2>
        </header>

        {error && (
            <div className="m-4 p-3 text-sm text-left bg-red-950/80 border border-red-800 text-red-200 rounded-lg">
                <strong className="font-semibold">Error:</strong> {error}
                <button onClick={() => setError(null)} className="float-right font-bold">X</button>
            </div>
        )}

        {hasGenerated ? <ChatView /> : <InitialPromptView />}
    </aside>
  );
};

export default CodeAssistant;
