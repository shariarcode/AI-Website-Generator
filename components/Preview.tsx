import React from 'react';

interface PreviewProps {
    htmlContent: string | null;
    isTab?: boolean;
}

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