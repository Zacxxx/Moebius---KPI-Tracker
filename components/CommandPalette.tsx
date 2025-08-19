
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './Icons';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

export interface Command {
    id: string;
    title: string;
    icon: React.FC<{ className?: string }>;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const commandPaletteRef = useRef<HTMLDivElement>(null);

    const filteredCommands = commands.filter(cmd => 
        cmd.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearch('');
        }
    }, [isOpen]);
    
    // This effect handles keydown for the entire window to control the palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => (i + 1) % (filteredCommands.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => (i - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, filteredCommands, selectedIndex]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);
    
    useEffect(() => {
        resultsRef.current?.querySelector(`[data-index="${selectedIndex}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-24 p-4 backdrop-blur-sm" onClick={onClose}>
            <div ref={commandPaletteRef} className="w-full max-w-xl" onClick={e => e.stopPropagation()}>
                <Card className="overflow-hidden border-violet-500/30">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <Input
                            ref={inputRef}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Type a command or search..."
                            className="h-14 w-full pl-12 text-base rounded-none border-0 border-b border-zinc-700/50 bg-zinc-900/50 focus:ring-0"
                            aria-label="Search commands"
                            autoComplete="off"
                        />
                    </div>
                    <div ref={resultsRef} className="max-h-96 overflow-y-auto p-2">
                        {filteredCommands.length > 0 ? (
                            <ul role="listbox">
                                {filteredCommands.map((cmd, index) => {
                                    const Icon = cmd.icon;
                                    const isSelected = selectedIndex === index;
                                    return (
                                        <li
                                            key={cmd.id}
                                            role="option"
                                            aria-selected={isSelected}
                                            data-index={index}
                                            onClick={cmd.action}
                                            className={`w-full flex items-center gap-4 p-3 text-left rounded-lg text-sm transition-colors cursor-pointer ${
                                                isSelected ? 'bg-zinc-800 text-white' : 'text-zinc-300 hover:bg-zinc-800/50'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5 text-zinc-400" />
                                            <span>{cmd.title}</span>
                                        </li>
                                    );
                                })
                            }
                            </ul>
                        ) : (
                            <p className="p-4 text-center text-sm text-zinc-500">No results found.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
