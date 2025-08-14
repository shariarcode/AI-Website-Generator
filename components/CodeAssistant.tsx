import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';

interface CodeAssistantProps {
  chatHistory: ChatMessage[];
  onSendMessage: (instruction: string) => void;
  isModifying: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  isTab?: boolean;
}

const LoadingSpinner: React.FC<{className?: string}> = ({ className = "text-white" }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CodeAssistant: React.FC<CodeAssistantProps> = ({
  chatHistory, onSendMessage, isModifying, error, setError, isTab = false
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isModifying]);
  
  const handleSendInstruction = () => {
    if(instruction.trim() && !isModifying) {
      onSendMessage(instruction);
      setInstruction('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-surface">
      {!isTab && (
        <header className="flex-shrink-0 p-4 border-b border-dark-border h-[57px] flex items-center">
            <h2 className="font-bold text-lg">AI Assistant</h2>
        </header>
      )}

      {error && (
          <div className="flex-shrink-0 m-4 p-3 text-sm text-left bg-red-950/80 border border-red-800 text-red-200 rounded-lg relative">
              <strong className="font-semibold">Error:</strong> {error}
              <button onClick={() => setError(null)} className="absolute top-2 right-3 font-bold text-red-200 hover:text-white">X</button>
          </div>
      )}

      {/* The scrollable chat log. flex-1 allows it to grow, min-h-0 fixes scrolling in flexbox. */}
      <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0">
          {chatHistory.map((msg, index) => (
              <div key={index} className="flex items-start gap-3 chat-message-fade-in">
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
      
      {/* The chat input area */}
      <div className="flex-shrink-0 p-4 border-t border-dark-border">
          <div className="relative">
              <textarea 
                value={instruction} 
                onChange={e => setInstruction(e.target.value)} 
                placeholder="e.g., Change the hero title..." 
                className="w-full h-24 p-3 pr-12 bg-dark-bg text-sm text-dark-text-primary rounded-lg border border-dark-border focus:ring-1 focus:ring-brand-blue focus:outline-none resize-none" 
                disabled={isModifying} 
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInstruction(); } }}
              />
              <button 
                onClick={handleSendInstruction} 
                disabled={!instruction.trim() || isModifying} 
                className="absolute top-3 right-3 p-2 rounded-lg bg-brand-blue text-white hover:bg-blue-600 disabled:bg-brand-blue/50" 
                aria-label="Send instruction"
              >
                  <SendIcon className="w-5 h-5" />
              </button>
          </div>
      </div>
    </div>
  );
};

export default CodeAssistant;