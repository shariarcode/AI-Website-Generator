
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import EditorModal from './components/EditorModal';
import AuthModal from './components/AuthModal';
import { generateWebsite, chatInEditor } from './services/geminiService';
import { ChatMessage, ImageFile } from './types';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isModifying, setIsModifying] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
       const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
       setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const html = await generateWebsite(prompt, image);
      setGeneratedHtml(html);
      setChatHistory([{
        role: 'model',
        text: "Here is the website I generated. Let me know if you'd like to make any changes!"
      }]);
      setIsEditorOpen(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, image]);

  const handleEditorChatSubmit = useCallback(async (instruction: string) => {
    if (!instruction.trim() || isModifying || !generatedHtml) return;

    setIsModifying(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', text: instruction };
    const newHistory: ChatMessage[] = [...chatHistory, userMessage];
    setChatHistory(newHistory);

    try {
      const { response, html } = await chatInEditor(generatedHtml, newHistory, instruction);
      
      if (html && html.trim() !== '') {
        setGeneratedHtml(html);
      }

      setChatHistory(prev => [...prev, {
        role: 'model',
        text: response
      }]);

    } catch (err: any) {
      const typedError = err as Error;
      setError(typedError.message || 'An unknown error occurred during chat.');
      setChatHistory(prev => [...prev, {
        role: 'model',
        text: `I encountered an error: ${typedError.message}`
      }]);
    } finally {
      setIsModifying(false);
    }
  }, [generatedHtml, isModifying, chatHistory]);


  const handleSignIn = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    alert('Successfully signed in! (This is a simulation)');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    alert('Account created and signed in! (This is a simulation)');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary transition-colors duration-300">
      {isDarkMode && <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/40 via-blue-900/10 to-transparent -z-0" />}
      
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        isAuthenticated={isAuthenticated}
        onSignInClick={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      
      <main className="relative z-10 flex-grow flex items-center justify-center container mx-auto px-4 pt-24 pb-8">
        <div className="w-full max-w-3xl text-center">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            What do you want to build? <span className="font-medium text-light-text-secondary dark:text-dark-text-secondary">(with Tamim)</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-dark-text-secondary">
            Create stunning apps & websites by chatting with AI.
            </p>

            <div className="w-full mt-10">
            <PromptForm
                prompt={prompt}
                setPrompt={setPrompt}
                handleGenerate={handleGenerate}
                isLoading={isLoading}
                image={image}
                setImage={setImage}
            />
            </div>
            
            {error && (
                <div className="mt-6 p-4 max-w-3xl w-full text-left bg-red-950/80 border border-red-800 text-red-200 rounded-lg">
                    <strong className="font-semibold">Error:</strong> {error}
                </div>
            )}
        </div>
      </main>

      {isEditorOpen && generatedHtml && (
        <EditorModal 
          htmlContent={generatedHtml} 
          onClose={() => setIsEditorOpen(false)}
          chatHistory={chatHistory}
          onSendMessage={handleEditorChatSubmit}
          isModifying={isModifying}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}
    </div>
  );
};

export default App;
