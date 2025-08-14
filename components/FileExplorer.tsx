
import React, { useMemo } from 'react';
import FileCodeIcon from './icons/FileCodeIcon';
import FileJsonIcon from './icons/FileJsonIcon';
import FileTextIcon from './icons/FileTextIcon';
import FileIcon from './icons/FileIcon';

const getFileIcon = (fileName: string) => {
    const className = "flex-shrink-0 w-4 h-4 text-dark-text-secondary";
    const extension = fileName.split('.').pop();
    
    switch (extension) {
        case 'js':
        case 'ts':
        case 'tsx':
        case 'jsx':
        case 'html':
        case 'css':
             return <FileCodeIcon className={className} />;
        case 'json':
            return <FileJsonIcon className={className} />;
        case 'md':
        case 'txt':
            return <FileTextIcon className={className} />;
        default:
            return <FileIcon className={className} />;
    }
};

interface FileExplorerProps {
    files: string[];
    activeFile: string | null;
    onFileSelect: (file: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onFileSelect }) => {
    
    const sortedFiles = useMemo(() => {
        return [...files].sort((a, b) => {
            // Prioritize specific files
            if (a === 'README.md') return -1;
            if (b === 'README.md') return 1;
            if (a === 'package.json') return -1;
            if (b === 'package.json') return 1;
            // Then sort by path depth and alphabetically
            const aDepth = a.split('/').length;
            const bDepth = b.split('/').length;
            if (aDepth !== bDepth) {
                return aDepth - bDepth;
            }
            return a.localeCompare(b);
        });
    }, [files]);

    return (
        <aside className="bg-dark-surface p-4 flex flex-col text-sm h-full">
            <h3 className="font-bold text-dark-text-primary mb-4 text-base">Explorer</h3>
            <div className="flex-grow overflow-y-auto">
                {sortedFiles.length > 0 ? (
                    <ul>
                        {sortedFiles.map(file => (
                            <li key={file}>
                                <button 
                                    onClick={() => onFileSelect(file)}
                                    className={`w-full flex items-center gap-2 p-1.5 rounded-md text-left transition-colors ${activeFile === file ? 'bg-brand-blue/20 text-white' : 'hover:bg-dark-bg'}`}
                                >
                                    {getFileIcon(file)}
                                    <span className="truncate">{file}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-dark-text-secondary text-center px-2 py-8">
                        <p>Generate a project to see its files here.</p>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default FileExplorer;