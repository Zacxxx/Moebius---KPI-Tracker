
import React from 'react';
import { Button } from '../ui/Button';
import { XIcon } from '../Icons';
import { SlashCommand } from './slashCommands';

interface AttachedContextProps {
    command: SlashCommand;
    onRemove: (commandId: string) => void;
}

export const AttachedContext: React.FC<AttachedContextProps> = ({ command, onRemove }) => {
    const Icon = command.icon;
    return (
        <div className="flex items-center gap-2 bg-zinc-700/50 border border-zinc-600 rounded-lg px-3 py-1.5 text-sm">
            <Icon className="h-4 w-4 text-violet-400" />
            <span className="font-medium text-zinc-200">Attached: {command.title}</span>
            <Button variant="ghost" size="icon" onClick={() => onRemove(command.id)} className="h-6 w-6 -mr-1" aria-label="Remove context">
                <XIcon className="h-4 w-4" />
            </Button>
        </div>
    );
};
