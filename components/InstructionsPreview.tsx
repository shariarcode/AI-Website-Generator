
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InstructionsPreviewProps {
    content: string | null;
    isTab?: boolean;
}

const InstructionsPreview: React.FC<InstructionsPreviewProps> = ({ content, isTab = false }) => {
    return (
        <div className="flex flex-col h-full">
            {!isTab && (
              <header className="p-2 flex justify-between items-center border-b border-dark-border bg-dark-surface h-[45px]">
                  <span className="text-sm font-medium px-2">Instructions (README.md)</span>
              </header>
            )}
            <div className="flex-grow p-6 overflow-y-auto bg-dark-surface">
                {content ? (
                    <article className="prose-custom max-w-none">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </article>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-secondary">
                        <p>README.md will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructionsPreview;
