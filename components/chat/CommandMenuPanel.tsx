import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { actionCommands } from './actionCommands';
import { contextCommands } from './contextCommands';

interface CommandMenuPanelProps {
    onSelect: (commandString: string) => void;
}

export const CommandMenuPanel: React.FC<CommandMenuPanelProps> = ({ onSelect }) => {
    return (
        <Card className="overflow-hidden shadow-2xl shadow-black/40 border-zinc-700/30">
            <CardContent className="!p-1 max-h-80 overflow-y-auto">
                <div className="p-2">
                    <h4 className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</h4>
                    <ul className="mt-1">
                        {actionCommands.map(cmd => (
                            <li key={cmd.id}>
                                <button
                                    onClick={() => onSelect(`/${cmd.title} `)}
                                    className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700/50"
                                >
                                    <cmd.icon className="h-4 w-4 text-zinc-400" />
                                    <div>
                                        <p className="text-sm text-zinc-200">/{cmd.title} <span className="text-zinc-500">{cmd.params || ''}</span></p>
                                        <p className="text-xs text-zinc-400">{cmd.description}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-2 border-t border-zinc-700/50">
                    <h4 className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Attach Context</h4>
                     <ul className="mt-1">
                        {contextCommands.map(cmd => (
                             <li key={cmd.id}>
                                <button
                                    onClick={() => onSelect(`@${cmd.title}`)}
                                    className="w-full text-left flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700/50"
                                >
                                    <cmd.icon className="h-4 w-4 text-zinc-400" />
                                     <div>
                                        <p className="text-sm text-zinc-200">@{cmd.title}</p>
                                        <p className="text-xs text-zinc-400">{cmd.description}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
