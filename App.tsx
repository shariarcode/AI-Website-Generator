
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { generateWebsite, chatInEditor } from './services/geminiService';
import { ChatMessage, ImageFile } from './types';
import CodeAssistant from './components/CodeAssistant';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isModifying, setIsModifying] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);

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
      setActiveFile('index.html');
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
    // alert('Successfully signed in! (This is a simulation)');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    // alert('Account created and signed in! (This is a simulation)');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleFileSelect = (file: string) => {
    if (file === 'index.html') {
      setActiveFile(file);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-dark-bg text-dark-text-primary antialiased">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        isAuthenticated={isAuthenticated}
        onSignInClick={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-grow grid grid-cols-[minmax(300px,1.2fr)_minmax(200px,0.8fr)_minmax(400px,2fr)_minmax(400px,2fr)] overflow-hidden border-t border-dark-border">
          <CodeAssistant 
            prompt={prompt}
            setPrompt={setPrompt}
            image={image}
            setImage={setImage}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            chatHistory={chatHistory}
            onSendMessage={handleEditorChatSubmit}
            isModifying={isModifying}
            hasGenerated={!!generatedHtml}
            error={error}
            setError={setError}
          />
          <FileExplorer
            files={generatedHtml ? ['index.html'] : []}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
          <CodeEditor
            htmlContent={generatedHtml}
            onHtmlContentChange={setGeneratedHtml}
          />
          <Preview htmlContent={generatedHtml} />
      </main>

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
