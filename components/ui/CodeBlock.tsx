import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '../Icons';

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <pre className="bg-zinc-900 rounded-lg p-4 font-mono text-sm text-zinc-300 border border-zinc-700 overflow-x-auto">
                <code>{code}</code>
            </pre>
            <button 
                onClick={handleCopy} 
                className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
                aria-label="Copy code to clipboard"
            >
                {copied ? <CheckIcon className="h-5 w-5 text-emerald-400" /> : <ClipboardIcon className="h-5 w-5" />}
            </button>
        </div>
    );
};
