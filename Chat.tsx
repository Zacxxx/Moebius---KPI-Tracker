
import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { ChatSession, Message, Bookmark, WidgetContext, Page } from './types';
import { ChatMessage, TypingIndicator } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { MessageSquareIcon } from './components/Icons';


interface ChatProps {
    session?: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (payload: { displayText: string, promptText: string }) => void;
    onRegenerate: (messageId: number) => void;
    bookmarks: Bookmark[];
    onToggleBookmark: (message: Message) => void;
    setActiveChatId: (id: string) => void;
    getAppContextData?: (command: string) => string;
    attachedWidgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
    actions: { [key: string]: (arg?: any) => void };
}

export default function Chat({ session, isLoading, isMessageQueued, onSend, onRegenerate, bookmarks, onToggleBookmark, setActiveChatId, getAppContextData, attachedWidgetContexts, onRemoveWidgetContext, onClearWidgetContexts, actions }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const contextPercentage = useMemo(() => {
        if (!session) return 0;
        // Approximation of token usage. Assume 20k chars is max for a more dynamic visual.
        const charCount = JSON.stringify(session.messages).length;
        return Math.min(100, (charCount / 20000) * 100);
    }, [session]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [session?.messages, isLoading]);

    return (
        <div className="h-full flex flex-col bg-zinc-900" style={{ margin: '-2rem' }}>
            <header className="flex items-center justify-between h-16 px-6 border-b border-zinc-700/50 flex-shrink-0 bg-zinc-900/50">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                    <MessageSquareIcon className="h-6 w-6 text-violet-400" />
                    <span>{(session?.title && session.title !== 'New Chat') ? session.title : 'Moebius'}</span>
                </h1>
            </header>
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6">
                {!session ? (
                     <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                        <MessageSquareIcon className="h-16 w-16 mb-4" />
                        <h2 className="text-xl font-semibold text-zinc-300">Start a conversation</h2>
                        <p className="max-w-sm mt-1">Use the input below or start a new chat from the sidebar.</p>
                    </div>
                ) : (
                    <>
                        {session.messages.map(msg => (
                            <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </main>
            <div className="relative mt-auto">
                <ChatInput 
                    onSend={onSend} 
                    isLoading={isLoading} 
                    isMessageQueued={isMessageQueued}
                    getAppContextData={getAppContextData}
                    widgetContexts={attachedWidgetContexts}
                    onRemoveWidgetContext={onRemoveWidgetContext}
                    onClearWidgetContexts={onClearWidgetContexts}
                    context="full"
                    bookmarks={bookmarks}
                    setActiveChatId={setActiveChatId}
                    actions={actions}
                    contextPercentage={contextPercentage}
                />
            </div>
        </div>
    );
}