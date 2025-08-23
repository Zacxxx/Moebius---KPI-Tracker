import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { GitBranchIcon, ChevronDownIcon, CheckIcon } from '../Icons';

interface VersionSelectorProps {
    versions: { id: string; label: string; }[];
    activeVersion: string;
    onVersionChange: (versionId: string) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({ versions, activeVersion, onVersionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const activeVersionLabel = versions.find(v => v.id === activeVersion)?.label || 'Select Version';

    return (
        <div className="relative" ref={dropdownRef}>
            <Button variant="secondary" onClick={() => setIsOpen(prev => !prev)}>
                <GitBranchIcon className="h-4 w-4 mr-2" />
                {activeVersionLabel}
                <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 p-1">
                    {versions.map(version => (
                        <button
                            key={version.id}
                            onClick={() => {
                                onVersionChange(version.id);
                                setIsOpen(false);
                            }}
                            className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md text-zinc-200 hover:bg-zinc-700"
                        >
                            <span>{version.label}</span>
                            {activeVersion === version.id && <CheckIcon className="h-4 w-4 text-violet-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
