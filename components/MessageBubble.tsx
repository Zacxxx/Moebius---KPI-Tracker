
import React from 'react';
import type { Message } from '../types';
import { MessageToolbar } from './chat/MessageToolbar';
import { SparklesIcon, UserIcon } from './Icons';

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
                <div className="flex items-center gap-2 mb-1">
                    <SparklesIcon className="h-5 w-5 rounded-full bg-zinc-700 text-zinc-300 p-0.5" />
                    <span className="text-sm font-semibold text-zinc-100">AI Assistant</span>
                    <span className="text-xs text-zinc-500">{message.timestamp}</span>
                </div>
                <div className="text-zinc-200 text-sm whitespace-pre-wrap ml-7">
                    {message.text}
                </div>
                <div className="ml-7">
                    <MessageToolbar message={message} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                </div>
            </div>
        );
    }

    // User message
    return (
        <div className="flex justify-end">
            <div className="group max-w-sm relative">
                <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-100">You</span>
                    <span className="text-xs text-zinc-500">{message.timestamp}</span>
                    <UserIcon className="h-5 w-5 rounded-full bg-zinc-700 text-zinc-300 p-0.5" />
                </div>
                <div className="bg-zinc-200/10 border border-zinc-500/20 text-white rounded-2xl rounded-br-lg px-4 py-2.5 text-sm whitespace-pre-wrap">
                    {message.text}
                </div>
                <div className="absolute left-0 -bottom-8">
                     <MessageToolbar message={message} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                </div>
            </div>
        </div>
    );
};