
import React from 'react';
import type { Message } from '../types';
import { MessageToolbar } from './chat/MessageToolbar';

interface ChatMessageProps {
    message: Message;
    onRegenerate: (messageId: number) => void;
    onToggleBookmark: (message: Message) => void;
}

export const TypingIndicator: React.FC = () => (
    <div className="w-full max-w-xl">
        <div className="flex items-center space-x-1.5 p-2">
            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse-fast"></div>
            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse-fast" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse-fast" style={{ animationDelay: '0.4s' }}></div>
        </div>
    </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate, onToggleBookmark }) => {
    const isAi = message.sender === 'ai';

    if (isAi) {
        return (
            <div className="group w-full max-w-xl">
                <div className="text-zinc-200 text-sm whitespace-pre-wrap">
                    {message.text}
                </div>
                <MessageToolbar message={message} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
            </div>
        );
    }

    // User message
    return (
        <div className="flex justify-end">
            <div className="group max-w-sm relative">
                <div className="bg-zinc-700 text-white rounded-2xl rounded-br-lg px-4 py-2.5 text-sm whitespace-pre-wrap">
                    {message.text}
                </div>
                <div className="absolute left-0 -bottom-8">
                     <MessageToolbar message={message} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                </div>
            </div>
        </div>
    );
};
