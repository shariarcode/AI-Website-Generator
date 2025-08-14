
import React from 'react';

interface PreviewProps {
    htmlContent: string | null;
    isTab?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ htmlContent, isTab = false }) => {
    return (
        <section className="bg-light-bg dark:bg-black flex flex-col h-full">
            {!isTab && (
              <header className="p-2 flex justify-between items-center border-b border-dark-border bg-dark-bg h-[45px]">
                  <span className="text-sm font-medium px-2">Preview</span>
              </header>
            )}
            <div className="flex-grow bg-white">
                {htmlContent ? (
                    <iframe
                        srcDoc={htmlContent}
                        title="Generated Website Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-text-secondary bg-dark-bg">
                        <p>Preview will appear here</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Preview;
