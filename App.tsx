
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { generateProject, chatInEditor } from './services/geminiService';
import { ChatMessage, ImageFile } from './types';
import CodeEditor from './components/CodeEditor';
import PromptForm from './components/PromptForm';
import SideBar from './components/SideBar';

type GenerationType = 'frontend' | 'backend';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<Record<string, string> | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isModifying, setIsModifying] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>('frontend');

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
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setProjectFiles(null);
    setChatHistory([]);
    setActiveFile(null);
    
    if (generationType === 'frontend') {
      let tempHtml = '';
      const onStream = (chunk: string) => {
        tempHtml += chunk;
        // Batch updates to avoid too many re-renders
        requestAnimationFrame(() => setProjectFiles({ 'index.html': tempHtml }));
      };

      const onDone = () => {
        let finalHtml = tempHtml;
        if (finalHtml.trim().startsWith("```html")) {
            finalHtml = finalHtml.trim().substring(7);
        }
        if (finalHtml.trim().endsWith("```")) {
            finalHtml = finalHtml.trim().slice(0, -3);
        }
        setProjectFiles({ 'index.html': finalHtml.trim() });
        setChatHistory([{
            role: 'model',
            text: "Here is the website I generated. Let me know if you'd like to make any changes!"
        }]);
        setActiveFile('index.html');
        setIsLoading(false);
      };
      
      const onError = (err: Error) => {
          setError(err.message || 'An unknown error occurred.');
          setProjectFiles(null);
          setIsLoading(false);
      };

      generateProject(generationType, prompt, image, onStream, onDone, onError);
    } else { // Backend generation
      try {
        const files = await generateProject(generationType, prompt, null, () => {}, () => {}, (err) => { throw err; });
        if (files) {
          setProjectFiles(files);
          setChatHistory([{
            role: 'model',
            text: "Here is the backend project I generated. You can read the README for instructions. Let me know if you'd like to make any changes!"
          }]);
          setActiveFile('README.md');
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setProjectFiles(null);
      } finally {
        setIsLoading(false);
      }
    }

  }, [prompt, isLoading, image, generationType]);

  const handleEditorChatSubmit = useCallback(async (instruction: string) => {
    if (!instruction.trim() || isModifying || !projectFiles) return;

    setIsModifying(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', text: instruction };
    const newHistory: ChatMessage[] = [...chatHistory, userMessage];
    setChatHistory(newHistory);

    try {
      const { response, updatedFiles } = await chatInEditor(projectFiles, newHistory, instruction);
      
      if (updatedFiles && updatedFiles.length > 0) {
        setProjectFiles(prevFiles => {
          const newFiles = { ...prevFiles };
          updatedFiles.forEach(file => {
            newFiles[file.name] = file.content;
          });
          return newFiles;
        });
        // If the active file was updated, it will re-render. 
        // If a new file was created, maybe switch to it? For now, keep it simple.
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
  }, [projectFiles, isModifying, chatHistory]);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleFileContentChange = (path: string, content: string) => {
    setProjectFiles(prev => (prev ? { ...prev, [path]: content } : null));
  };
  
  const renderInitialView = () => (
    <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
      {error && (
          <div className="w-full max-w-3xl mb-4 p-3 text-sm text-left bg-red-950/80 border border-red-800 text-red-200 rounded-lg relative">
              <strong className="font-semibold">Error:</strong> {error}
              <button onClick={() => setError(null)} className="absolute top-2 right-3 font-bold text-red-200 hover:text-white">X</button>
          </div>
      )}
      <div className="flex items-center gap-2 mb-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-dark-text-primary tracking-tight">AI Full-Stack Generator</h1>
      </div>
      <p className="text-lg text-dark-text-secondary mb-8">
          Create and refine full-stack applications by chatting with AI.
      </p>
      <PromptForm
        prompt={prompt}
        setPrompt={setPrompt}
        handleGenerate={handleGenerate}
        isLoading={isLoading}
        image={image}
        setImage={setImage}
        generationType={generationType}
        setGenerationType={setGenerationType}
      />
    </div>
  );

  const renderIdeView = () => (
    <div className="flex-grow grid grid-cols-[minmax(0,_3fr),minmax(0,_2fr)] gap-px overflow-hidden border-t bg-dark-border border-dark-border">
      <CodeEditor
        projectFiles={projectFiles}
        activeFile={activeFile}
        onFileContentChange={handleFileContentChange}
        generationType={generationType}
      />
      <SideBar
        generationType={generationType}
        projectFiles={projectFiles}
        activeFile={activeFile}
        onFileSelect={setActiveFile}
        chatHistory={chatHistory}
        onSendMessage={handleEditorChatSubmit}
        isModifying={isModifying}
        error={error}
        setError={setError}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen font-sans bg-dark-bg text-dark-text-primary antialiased">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        isAuthenticated={isAuthenticated}
        onSignInClick={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-grow flex flex-col overflow-hidden">
        {projectFiles === null ? renderInitialView() : renderIdeView()}
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
