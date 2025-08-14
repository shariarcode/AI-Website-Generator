<<<<<<< HEAD
=======

>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
import React from 'react';

interface PreviewProps {
    htmlContent: string | null;
    isTab?: boolean;
}

<<<<<<< HEAD
const Preview: React.FC<PreviewProps> = ({ htmlContent }) => {
    return (
        <div className="w-full h-full bg-white">
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
    );
};

export default Preview;
=======
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
>>>>>>> d12339c7711e28370510fd63f20909720fc886a1
