
import React, { useState, useCallback, useRef, useEffect } from 'react';
import DownloadIcon from './icons/DownloadIcon';
import CopyIcon from './icons/CopyIcon';
import UploadCloudIcon from './icons/UploadCloudIcon';
import VercelAuthModal from './VercelAuthModal';
import { deployToVercel } from '../services/vercelService';
import { ChatMessage } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import UserIcon from './icons/UserIcon';
import SendIcon from './icons/SendIcon';

declare const JSZip: any;

interface EditorModalProps {
  htmlContent: string;
  onClose: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (instruction: string) => void;
  isModifying: boolean;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const EditorModal: React.FC<EditorModalProps> = ({ htmlContent, onClose, chatHistory, onSendMessage, isModifying }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{ url: string | null; error: string | null }>({ url: null, error: null });
  const [instruction, setInstruction] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleDownload = useCallback(() => {
    if (typeof JSZip === 'undefined') {
        alert('Could not create ZIP file. JSZip library not found.');
        return;
    }
    const zip = new JSZip();
    zip.file("index.html", htmlContent);
    zip.generateAsync({ type: "blob" })
      .then(function(content: Blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "ai-generated-website.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }, [htmlContent]);
  
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(htmlContent).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  }, [htmlContent]);

  const startDeployment = useCallback(async (token: string) => {
    setIsDeploying(true);
    setDeploymentResult({ url: null, error: null });
    try {
      const url = await deployToVercel(htmlContent, token);
      setDeploymentResult({ url, error: null });
    } catch (err: any) {
      setDeploymentResult({ url: null, error: err.message || "Deployment failed." });
      if (err.message?.toLowerCase().includes('invalid token')) {
        localStorage.removeItem('vercelToken');
      }
    } finally {
      setIsDeploying(false);
    }
  }, [htmlContent]);
  
  const handlePublishClick = useCallback(() => {
    const storedToken = localStorage.getItem('vercelToken');
    if (storedToken) {
      startDeployment(storedToken);
    } else {
      setIsVercelModalOpen(true);
    }
  }, [startDeployment]);

  const handleSaveTokenAndDeploy = useCallback((token: string) => {
    localStorage.setItem('vercelToken', token);
    setIsVercelModalOpen(false);
    startDeployment(token);
  }, [startDeployment]);

  const handleSendInstruction = () => {
    if(instruction.trim() && !isModifying) {
      onSendMessage(instruction);
      setInstruction('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col z-50 transition-opacity duration-300">
        <header className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border-b bg-light-surface dark:bg-dark-surface border-light-border dark:border-dark-border">
            <div className="flex-grow">
                <h2 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">Website Editor</h2>
                {deploymentResult.url && (
                    <div className="mt-1 text-xs">
                    <span className="text-green-500 font-semibold">Published: </span>
                    <a href={deploymentResult.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline break-all">{deploymentResult.url}</a>
                    </div>
                )}
                {deploymentResult.error && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">Error: {deploymentResult.error}</p>
                )}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
               <button onClick={handlePublishClick} disabled={isDeploying} className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium text-light-text-secondary bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-dark-text-secondary dark:bg-dark-border dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-wait">
                {isDeploying ? <LoadingSpinner /> : <UploadCloudIcon className="w-5 h-5 sm:w-4 sm:h-4" />}
                <span className="hidden sm:inline">{isDeploying ? 'Publishing...' : 'Publish'}</span>
              </button>
              <button onClick={handleCopy} className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium text-light-text-secondary bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-dark-text-secondary dark:bg-dark-border dark:hover:bg-gray-700 transition-colors">
                <CopyIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button onClick={handleDownload} className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-blue-500 transition-colors">
                <DownloadIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download ZIP</span>
              </button>
              <button onClick={onClose} className="p-2 text-light-text-secondary dark:text-dark-text-secondary rounded-full hover:bg-gray-200 dark:hover:bg-dark-border transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
        </header>
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            {/* Chat Panel */}
            <aside className="w-full md:w-[400px] flex-shrink-0 bg-light-surface dark:bg-dark-surface flex flex-col h-1/3 md:h-full">
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'model' ? 'text-light-text-secondary dark:text-dark-text-secondary' : ''}`}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center">
                                {msg.role === 'model' ? <SparklesIcon className="w-5 h-5 text-brand-blue" /> : <UserIcon className="w-5 h-5" />}
                            </div>
                            <div className="flex-grow p-3 rounded-lg bg-light-bg dark:bg-dark-bg">
                                <p className="text-sm text-light-text-primary dark:text-dark-text-primary">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isModifying && (
                         <div className="flex items-start gap-3 text-light-text-secondary dark:text-dark-text-secondary">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center">
                                <SparklesIcon className="w-5 h-5 text-brand-blue" />
                            </div>
                            <div className="flex-grow p-3 rounded-lg bg-light-bg dark:bg-dark-bg flex items-center">
                                <LoadingSpinner />
                                <span className="ml-2 text-sm">Thinking...</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-light-border dark:border-dark-border">
                    <div className="relative">
                        <textarea
                            value={instruction}
                            onChange={e => setInstruction(e.target.value)}
                            placeholder="e.g., Change the hero title..."
                            className="w-full h-24 p-3 pr-12 bg-light-bg dark:bg-dark-bg text-sm text-light-text-primary dark:text-dark-text-primary rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none resize-none transition-colors"
                            disabled={isModifying}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendInstruction();
                                }
                            }}
                        />
                        <button 
                            onClick={handleSendInstruction}
                            disabled={!instruction.trim() || isModifying}
                            className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-brand-blue text-white hover:bg-blue-600 disabled:bg-brand-blue/50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Send instruction"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
            {/* Preview Panel */}
            <main className="flex-grow bg-gray-200 dark:bg-black">
                <iframe
                srcDoc={htmlContent}
                title="Generated Website Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </main>
        </div>
      </div>
      {isVercelModalOpen && (
        <VercelAuthModal 
          onClose={() => setIsVercelModalOpen(false)}
          onSave={handleSaveTokenAndDeploy}
          isDeploying={isDeploying}
        />
      )}
    </>
  );
};

export default EditorModal;
