import React from 'react';
import {
    PlusCircleIcon, Trash2Icon, RefreshCwIcon, BookmarkIcon, FilterOffIcon,
    SendIcon, PaletteIcon, MessageSquareIcon, InfoIcon
} from '../Icons';

export interface ActionCommand {
    id: string;
    icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
    params?: string; // e.g., "[on|off]"
}

export const actionCommands: ActionCommand[] = [
    { id: 'help', icon: InfoIcon, title: 'help', description: 'Show a list of available commands' },
    { id: 'new', icon: PlusCircleIcon, title: 'new', description: 'Start a new chat session' },
    { id: 'clear', icon: Trash2Icon, title: 'clear', description: 'Clear the current chat history' },
    { id: 'regenerate', icon: RefreshCwIcon, title: 'regenerate', description: 'Regenerate the last AI response' },
    { id: 'bookmark', icon: BookmarkIcon, title: 'bookmark', description: 'Bookmark the last AI response' },
    { id: 'clear-context', icon: FilterOffIcon, title: 'clear-context', description: 'Clear all attached context items' },
    { id: 'goto', icon: SendIcon, title: 'goto', description: 'Navigate to a page', params: '[page-name]' },
    { id: 'ui', icon: MessageSquareIcon, title: 'ui', description: 'Change chat UI style', params: '[panel|toast]' },
    { id: 'kpi-colors', icon: PaletteIcon, title: 'kpi-colors', description: 'Toggle KPI sentiment colors', params: '[on|off]' },
];
