import React from 'react';
import type { SlashCommand } from './contextCommands';
import type { ActionCommand } from './actionCommands';
import { ChevronLeftIcon } from '../Icons';

interface SlashCommandSuggestionsProps {
    commands: (SlashCommand | ActionCommand)[];
    onSelect: (command: SlashCommand | ActionCommand) => void;
    selectedIndex: number;
    path: SlashCommand[];
    onBack: () => void;
    trigger: '@' | '/' | null;
}

export const SlashCommandSuggestions: React.FC<SlashCommandSuggestionsProps> = ({ commands, onSelect, selectedIndex, path, onBack, trigger }) => {
    if (commands.length === 0) {
        return null;
    }

    const title = trigger === '/' ? 'Actions' : 'Attach Context';

    return (
        <div className="absolute bottom-full mb-2 w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 p-2">
            {path.length > 0 && trigger === '@' ? (
                <div className="flex items-center gap-2 px-2 py-1 border-b border-zinc-700 mb-1">
                    <button onClick={onBack} className="p-1 -ml-1 rounded-md hover:bg-zinc-700">
                        <ChevronLeftIcon className="h-4 w-4 text-zinc-400" />
                    </button>
                    <p className="text-xs font-semibold text-zinc-400 truncate">
                        {path.map(p => p.title).join(' / ')}
                    </p>
                </div>
            ) : (
                <p className="px-2 py-1 text-xs font-semibold text-zinc-400">{title}</p>
            )}
            <ul>
                {commands.map((command, index) => {
                    const Icon = command.icon;
                    const isSelected = selectedIndex === index;
                    return (
                        <li key={command.id}>
                            <button
                                onClick={() => onSelect(command)}
                                className={`w-full flex items-center gap-3 p-2 text-left rounded-md transition-colors ${
                                    isSelected ? 'bg-zinc-700' : 'hover:bg-zinc-700/50'
                                }`}
                            >
                                <div className="p-1.5 bg-zinc-900 rounded-md">
                                    <Icon className="h-5 w-5 text-zinc-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-zinc-100">{command.title}</p>
                                    <p className="text-xs text-zinc-400">{command.description}</p>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};