
import React, { useState, useCallback, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

import DownloadIcon from './icons/DownloadIcon';
import CopyIcon from './icons/CopyIcon';
import UploadCloudIcon from './icons/UploadCloudIcon';
import VercelAuthModal from './VercelAuthModal';
import { deployToVercel } from '../services/vercelService';

declare const JSZip: any;

interface CodeEditorProps {
  projectFiles: Record<string, string> | null;
  activeFile: string | null;
  onFileContentChange: (path: string, content: string) => void;
<<<<<<< HEAD
=======
  generationType: 'frontend' | 'backend';
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const getLanguage = (filename: string | null): string => {
    if (!filename) return 'markup';
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'jsx';
        case 'ts':
            return 'typescript';
        case 'tsx':
            return 'tsx';
        case 'json':
            return 'json';
        case 'css':
            return 'css';
        case 'html':
        case 'md':
        default:
            return 'markup';
    }
};

<<<<<<< HEAD
const CodeEditor: React.FC<CodeEditorProps> = ({ projectFiles, activeFile, onFileContentChange }) => {
=======
const CodeEditor: React.FC<CodeEditorProps> = ({ projectFiles, activeFile, onFileContentChange, generationType }) => {
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
    const [isCopied, setIsCopied] = useState(false);
    const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentResult, setDeploymentResult] = useState<{ url: string | null; error: string | null }>({ url: null, error: null });

    const activeFileContent = activeFile && projectFiles ? projectFiles[activeFile] : null;

    const lineCount = useMemo(() => activeFileContent?.split('\n').length || 1, [activeFileContent]);

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
        if (!activeFileContent) return;
        navigator.clipboard.writeText(activeFileContent).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [activeFileContent]);

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
<<<<<<< HEAD
        if (!htmlContent) return;
=======
        if (!htmlContent || generationType === 'backend') return;
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
        const storedToken = localStorage.getItem('vercelToken');
        if (storedToken) {
            startDeployment(storedToken);
        } else {
            setIsVercelModalOpen(true);
        }
<<<<<<< HEAD
    }, [startDeployment, projectFiles]);
=======
    }, [startDeployment, projectFiles, generationType]);
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
    
    const handleSaveTokenAndDeploy = useCallback((token: string) => {
        localStorage.setItem('vercelToken', token);
        setIsVercelModalOpen(false);
        startDeployment(token);
    }, [startDeployment]);

    const language = useMemo(() => getLanguage(activeFile), [activeFile]);

    return (
        <>
        <section className="bg-dark-bg flex flex-col border-r border-dark-border">
            <header className="p-2 flex justify-between items-center border-b border-dark-border bg-dark-surface h-[45px]">
                {activeFile ? (
                    <span className="text-sm font-medium px-2 py-1 rounded-md bg-dark-bg">{activeFile}</span>
                ) : <div />}
                
                {projectFiles !== null && (
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                        <button onClick={handlePublishClick} disabled={isDeploying} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors disabled:opacity-50">
                            {isDeploying ? <LoadingSpinner /> : <UploadCloudIcon className="w-4 h-4" />}
                            {isDeploying ? 'Publishing...' : 'Publish'}
                        </button>
=======
                        {generationType === 'frontend' && (
                            <button onClick={handlePublishClick} disabled={isDeploying} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors disabled:opacity-50">
                                {isDeploying ? <LoadingSpinner /> : <UploadCloudIcon className="w-4 h-4" />}
                                {isDeploying ? 'Publishing...' : 'Publish'}
                            </button>
                        )}
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
                        <button onClick={handleCopy} disabled={!activeFileContent} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors disabled:opacity-50">
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

            <div className="flex-grow flex relative overflow-auto editor-container">
                {activeFileContent !== null ? (
                    <>
                        <div className="text-right font-mono text-sm text-dark-text-secondary select-none sticky top-0 line-numbers">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>
                        <Editor
                            value={activeFileContent || ''}
                            onValueChange={code => activeFile && onFileContentChange(activeFile, code)}
                            highlight={code => Prism.highlight(code, Prism.languages[language] || Prism.languages.markup, language)}
                            padding={0}
                            className="flex-grow font-mono text-sm bg-transparent resize-none focus:outline-none text-dark-text-primary caret-white"
                            style={{
                                fontFamily: '"Fira Code", monospace',
                            }}
                            textareaClassName="prism-editor__textarea !min-h-full"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-secondary">
                        <p>{projectFiles ? 'Select a file to view its code' : 'Code will appear here'}</p>
                    </div>
                )}
            </div>
        </section>
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

export default CodeEditor;