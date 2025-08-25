

import React from 'react';
import { CopyButton } from './CopyButton';
import { FeedbackButtons } from './FeedbackButtons';
import { ActionButton } from './ActionButton';
import { Volume2Icon, EditIcon, ShareIcon, RefreshCwIcon, BookmarkIcon } from '../Icons';
import type { Message } from '../../types';

interface BookmarkButtonProps {
    isBookmarked: boolean;
    onToggle: () => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onToggle }) => (
    <ActionButton label={isBookmarked ? "Remove bookmark" : "Bookmark"} onClick={onToggle}>
        <BookmarkIcon className={`h-4 w-4 transition-all ${isBookmarked ? 'fill-current text-violet-400 stroke-violet-400' : ''}`} />
    </ActionButton>
);

interface MessageToolbarProps {
    message: Message;
    onRegenerate: (messageId: number) => void;
    onToggleBookmark: (message: Message) => void;
}

export const MessageToolbar: React.FC<MessageToolbarProps> = ({ message, onRegenerate, onToggleBookmark }) => {
    return (
        <div className="mt-2 h-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 shadow-lg">
                <CopyButton textToCopy={message.text} />
                <FeedbackButtons />
                <BookmarkButton isBookmarked={!!message.isBookmarked} onToggle={() => onToggleBookmark(message)} />
                <div className="w-px h-4 bg-zinc-600 mx-1" />
                <ActionButton label="Listen" onClick={() => alert('Text-to-speech not implemented.')}><Volume2Icon className="h-4 w-4" /></ActionButton>
                {message.sender === 'user' && <ActionButton label="Edit" onClick={() => alert('Editing not implemented.')}><EditIcon className="h-4 w-4" /></ActionButton>}
                <ActionButton label="Share" onClick={() => alert('Sharing not implemented.')}><ShareIcon className="h-4 w-4" /></ActionButton>
                {message.sender === 'ai' && <ActionButton label="Regenerate" onClick={() => onRegenerate(message.id)}><RefreshCwIcon className="h-4 w-4" /></ActionButton>}
            </div>
        </div>
    );
};