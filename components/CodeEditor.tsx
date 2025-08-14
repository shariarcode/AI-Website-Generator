
import React, { useState, useCallback, useMemo } from 'react';
import DownloadIcon from './icons/DownloadIcon';
import CopyIcon from './icons/CopyIcon';
import UploadCloudIcon from './icons/UploadCloudIcon';
import VercelAuthModal from './VercelAuthModal';
import { deployToVercel } from '../services/vercelService';

declare const JSZip: any;

interface CodeEditorProps {
  htmlContent: string | null;
  onHtmlContentChange: (html: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const CodeEditor: React.FC<CodeEditorProps> = ({ htmlContent, onHtmlContentChange }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentResult, setDeploymentResult] = useState<{ url: string | null; error: string | null }>({ url: null, error: null });

    const lineCount = useMemo(() => htmlContent?.split('\n').length || 1, [htmlContent]);

    const handleDownload = useCallback(() => {
        if (!htmlContent) return;
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
        if (!htmlContent) return;
        navigator.clipboard.writeText(htmlContent).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [htmlContent]);

    const startDeployment = useCallback(async (token: string) => {
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
    }, [htmlContent]);

    const handlePublishClick = useCallback(() => {
        if (!htmlContent) return;
        const storedToken = localStorage.getItem('vercelToken');
        if (storedToken) {
            startDeployment(storedToken);
        } else {
            setIsVercelModalOpen(true);
        }
    }, [startDeployment, htmlContent]);
    
    const handleSaveTokenAndDeploy = useCallback((token: string) => {
        localStorage.setItem('vercelToken', token);
        setIsVercelModalOpen(false);
        startDeployment(token);
    }, [startDeployment]);

    return (
        <>
        <section className="bg-dark-bg flex flex-col border-r border-dark-border">
            <header className="p-2 flex justify-between items-center border-b border-dark-border bg-dark-surface h-[45px]">
                {htmlContent !== null ? (
                    <span className="text-sm font-medium px-2 py-1 rounded-md bg-dark-bg">index.html</span>
                ) : <div />}
                
                {htmlContent !== null && (
                    <div className="flex items-center gap-2">
                        <button onClick={handlePublishClick} disabled={isDeploying} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors disabled:opacity-50">
                            {isDeploying ? <LoadingSpinner /> : <UploadCloudIcon className="w-4 h-4" />}
                            {isDeploying ? 'Publishing...' : 'Publish'}
                        </button>
                        <button onClick={handleCopy} className="flex items-center justify-center gap-1.5 p-1.5 text-xs font-medium text-dark-text-secondary bg-dark-bg rounded-md hover:bg-dark-border transition-colors">
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

            <div className="flex-grow flex relative overflow-auto">
                {htmlContent !== null ? (
                    <>
                        <div className="text-right p-4 pr-2 font-mono text-sm text-dark-text-secondary select-none sticky top-0">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i} className="leading-6 h-6">{i + 1}</div>
                            ))}
                        </div>
                        <textarea
                            value={htmlContent}
                            onChange={(e) => onHtmlContentChange(e.target.value)}
                            className="flex-grow p-4 pl-2 font-mono text-sm bg-transparent resize-none focus:outline-none text-dark-text-primary leading-6"
                            spellCheck="false"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-secondary">
                        <p>Code will appear here</p>
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
