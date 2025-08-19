import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '../Icons';
import { ActionButton } from './ActionButton';

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ActionButton label={copied ? "Copied!" : "Copy"} onClick={handleCopy}>
            {copied ? <CheckIcon className="h-4 w-4 text-emerald-400" /> : <ClipboardIcon className="h-4 w-4" />}
        </ActionButton>
    );
};