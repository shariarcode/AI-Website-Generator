import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M9.93 2.23 12 5l2.07-2.77A3.76 3.76 0 0 1 18 4a3.76 3.76 0 0 1 1.93 3.23L22 9l-2.77 2.07A3.76 3.76 0 0 1 18 14a3.76 3.76 0 0 1-3.23-1.93L12 15l-2.07 2.77A3.76 3.76 0 0 1 6 14a3.76 3.76 0 0 1-1.93-3.23L2 9l2.77-2.07A3.76 3.76 0 0 1 6 4a3.76 3.76 0 0 1 3.23-1.93Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

export default SparklesIcon;
