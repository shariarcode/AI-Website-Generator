
import React from 'react';
import DocumentIcon from './icons/DocumentIcon'; // Assuming a generic document icon exists or is created

const FileExplorer: React.FC<{
    files: string[];
    activeFile: string | null;
    onFileSelect: (file: string) => void;
}> = ({ files, activeFile, onFileSelect }) => {
    
    return (
        <aside className="bg-dark-bg border-r border-dark-border p-4 flex flex-col text-sm">
            <h3 className="font-bold text-dark-text-primary mb-4 text-base">Explorer</h3>
            <div className="flex-grow">
                {files.length > 0 ? (
                    <ul>
                        {files.map(file => (
                            <li key={file}>
                                <button 
                                    onClick={() => onFileSelect(file)}
                                    className={`w-full flex items-center gap-2 p-1.5 rounded-md text-left ${activeFile === file ? 'bg-brand-blue/30 text-white' : 'hover:bg-dark-surface'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-dark-text-secondary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                    <span className="truncate">{file}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-dark-text-secondary text-center px-2 py-8">
                        <p>Generate a website to see its files here.</p>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default FileExplorer;
