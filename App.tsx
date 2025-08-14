
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import { generateProject, chatInEditor } from './services/geminiService';
import { ChatMessage, ImageFile } from './types';
<<<<<<< HEAD
import PromptForm from './components/PromptForm';
import Preview from './components/Preview';
import CodeAssistant from './components/CodeAssistant';

import DownloadIcon from './components/icons/DownloadIcon';
import CopyIcon from './components/icons/CopyIcon';
import UploadCloudIcon from './components/icons/UploadCloudIcon';
import VercelAuthModal from './components/VercelAuthModal';
import { deployToVercel } from './services/vercelService';


declare const JSZip: any;

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

=======
import CodeEditor from './components/CodeEditor';
import PromptForm from './components/PromptForm';
import SideBar from './components/SideBar';
import FileExplorer from './components/FileExplorer';

type GenerationType = 'frontend' | 'backend';
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1

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

  // State for deployment and file actions (moved from CodeEditor)
  const [isCopied, setIsCopied] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{ url: string | null; error: string | null }>({ url: null, error: null });


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
<<<<<<< HEAD
    
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
      setIsLoading(false);
    };
    
    const onError = (err: Error) => {
        setError(err.message || 'An unknown error occurred.');
        setProjectFiles(null);
        setIsLoading(false);
    };

    generateProject(prompt, image, onStream, onDone, onError);

  }, [prompt, isLoading, image]);
=======
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
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1

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
<<<<<<< HEAD
=======
        // If the active file was updated, it will re-render. 
        // If a new file was created, maybe switch to it? For now, keep it simple.
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
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
<<<<<<< HEAD

    // Action handlers moved from CodeEditor
    const handleDownload = useCallback(() => {
        if (!projectFiles) return;
        if (typeof JSZip === 'undefined') {
            alert('Could not create ZIP file. JSZip library not found.');
            return;
        }
        const zip = new JSZip();
        for (const [name, content] of Object.entries(projectFiles)) {
            zip.file(name, content);
        }
        zip.generateAsync({ type: "blob" })
        .then(function(content: Blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "ai-generated-project.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }, [projectFiles]);

    const handleCopy = useCallback(() => {
        const contentToCopy = projectFiles ? projectFiles['index.html'] : null;
        if (!contentToCopy) return;
        navigator.clipboard.writeText(contentToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [projectFiles]);

    const startDeployment = useCallback(async (token: string) => {
        const htmlContent = projectFiles ? projectFiles['index.html'] : null;
        if (!htmlContent) return;
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
    }, [projectFiles]);

    const handlePublishClick = useCallback(() => {
        const htmlContent = projectFiles ? projectFiles['index.html'] : null;
        if (!htmlContent) return;
        const storedToken = localStorage.getItem('vercelToken');
        if (storedToken) {
            startDeployment(storedToken);
        } else {
            setIsVercelModalOpen(true);
        }
    }, [startDeployment, projectFiles]);
    
    const handleSaveTokenAndDeploy = useCallback((token: string) => {
        localStorage.setItem('vercelToken', token);
        setIsVercelModalOpen(false);
        startDeployment(token);
    }, [startDeployment]);
=======
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1

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
  
  const renderInitialView = () => (
    <div className="flex-grow flex flex-col items-center justify-start p-4 pt-12 text-center">
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
          Create and refine websites by chatting with AI.
      </p>
      <PromptForm
        prompt={prompt}
        setPrompt={setPrompt}
        handleGenerate={handleGenerate}
        isLoading={isLoading}
        image={image}
        setImage={setImage}
      />
    </div>
  );

  const renderIdeView = () => (
    <div className="flex-grow grid grid-cols-2 gap-px overflow-hidden border-t bg-dark-border border-dark-border">
      <section className="bg-dark-bg flex flex-col">
        <header className="p-2 flex justify-between items-center border-b border-dark-border bg-dark-surface h-[45px]">
          <span className="text-sm font-medium px-2">Preview</span>
          {projectFiles !== null && (
            <div className="flex items-center gap-2">
              <button onClick={handlePublishClick} disabled={isDeploying} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors disabled:opacity-50">
                  {isDeploying ? <LoadingSpinner /> : <UploadCloudIcon className="w-4 h-4" />}
                  {isDeploying ? 'Publishing...' : 'Publish'}
              </button>
              <button onClick={handleCopy} disabled={!projectFiles['index.html']} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors disabled:opacity-50">
                  <CopyIcon className="w-4 h-4" />
                  {isCopied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors">
                  <DownloadIcon className="w-4 h-4" />
                  Download
              </button>
            </div>
          )}
        </header>

        {deploymentResult.url && (
            <div className="text-xs p-2 bg-dark-surface border-b border-dark-border">
            <span className="text-green-400 font-semibold">Published: </span>
            <a href={deploymentResult.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline break-all">{deploymentResult.url}</a>
            </div>
        )}
        {deploymentResult.error && (
            <p className="text-xs p-2 text-red-400 font-semibold bg-dark-surface border-b border-dark-border">Error: {deploymentResult.error}</p>
        )}

        <div className="flex-grow relative">
            <Preview htmlContent={projectFiles ? projectFiles['index.html'] : null} />
        </div>
      </section>

      <div className="border-l border-dark-border">
        <CodeAssistant
          chatHistory={chatHistory}
          onSendMessage={handleEditorChatSubmit}
          isModifying={isModifying}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );


  const handleFileContentChange = (path: string, content: string) => {
    setProjectFiles(prev => (prev ? { ...prev, [path]: content } : null));
  };
  
  const renderInitialView = () => (
    <div className="flex-grow flex flex-col items-center justify-start p-4 pt-12 text-center">
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
    <div className="flex-grow grid grid-cols-12 gap-px overflow-hidden border-t bg-dark-border border-dark-border">
      <div className="col-span-2">
        <FileExplorer
          files={projectFiles ? Object.keys(projectFiles) : []}
          activeFile={activeFile}
          onFileSelect={setActiveFile}
        />
      </div>
      <div className="col-span-6">
        <CodeEditor
          projectFiles={projectFiles}
          activeFile={activeFile}
          onFileContentChange={handleFileContentChange}
          generationType={generationType}
        />
      </div>
      <div className="col-span-4">
        <SideBar
          generationType={generationType}
          projectFiles={projectFiles}
          chatHistory={chatHistory}
          onSendMessage={handleEditorChatSubmit}
          isModifying={isModifying}
          error={error}
          setError={setError}
        />
      </div>
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
      
      <main className={`flex-grow flex flex-col ${projectFiles === null ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {projectFiles === null ? renderInitialView() : renderIdeView()}
      </main>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      )}

      {isVercelModalOpen && (
        <VercelAuthModal 
          onClose={() => setIsVercelModalOpen(false)}
          onSave={handleSaveTokenAndDeploy}
          isDeploying={isDeploying}
        />
      )}
    </div>
  );
};

export default App;