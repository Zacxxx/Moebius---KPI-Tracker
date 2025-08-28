
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Message, ChatSession, Bookmark, WidgetContext } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, MessageSquareIcon, PlusIcon, RefreshCwIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface AiChatPanelProps {
    session?: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (payload: { displayText: string, promptText: string }) => void;
    onRegenerate: (messageId: number) => void;
    onNewChat: () => void;
    onReload: () => void;
    onClose: () => void;
    onMaximize: () => void;
    bookmarks: Bookmark[];
    onToggleBookmark: (message: Message) => void;
    setActiveChatId: (id: string) => void;
    getAppContextData?: (command: string) => string;
    width: number;
    onResize: (newWidth: number) => void;
    setIsResizing: (isResizing: boolean) => void;
    attachedWidgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
    actions: { [key: string]: (arg?: any) => void };
}

export const AiChatPanel: React.FC<AiChatPanelProps> = ({
    session,
    isLoading,
    isMessageQueued,
    onSend,
    onRegenerate,
    onNewChat,
    onReload,
    onClose,
    onMaximize,
    bookmarks,
    onToggleBookmark,
    setActiveChatId,
    getAppContextData,
    width,
    onResize,
    setIsResizing,
    attachedWidgetContexts,
    onRemoveWidgetContext,
    onClearWidgetContexts,
    actions
}) => {
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

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseMove = (event: MouseEvent) => {
            const newWidth = window.innerWidth - event.clientX;
            onResize(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [onResize, setIsResizing]);

    return (
        <aside
            style={{ width: `${width}px` }} 
            className="fixed top-0 right-0 h-full bg-zinc-900/70 backdrop-blur-xl z-30"
        >
             <div 
                onMouseDown={handleMouseDown}
                className="absolute top-0 left-0 -ml-1 w-2 h-full cursor-col-resize group z-10"
                aria-label="Resize panel"
                role="separator"
            >
                <div className="w-0.5 h-full bg-transparent group-hover:bg-violet-500/50 transition-colors duration-200 mx-auto" />
            </div>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-700/50 flex-shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold truncate">
                        <MessageSquareIcon className="h-5 w-5 text-violet-400 flex-shrink-0" />
                        <span className="truncate">{(session?.title && session.title !== 'New Chat') ? session.title : 'Moebius'}</span>
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={onNewChat} className="h-8 w-8" aria-label="New chat">
                            <PlusIcon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onReload} className="h-8 w-8" aria-label="Reload chat">
                            <RefreshCwIcon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onMaximize} className="h-8 w-8" aria-label="Maximize chat">
                            <Maximize2Icon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Close chat panel">
                            <XIcon className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 pt-6 space-y-6">
                    {session ? (
                        <>
                            {session.messages.map(msg => (
                                <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                            <MessageSquareIcon className="h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold text-zinc-300">Start a conversation</h3>
                            <p className="max-w-sm mt-1 text-sm">Send a message to begin.</p>
                        </div>
                    )}
                </div>
                <div className="relative mt-auto">
                    <ChatInput 
                        onSend={onSend} 
                        isLoading={isLoading || !session} 
                        isMessageQueued={isMessageQueued}
                        getAppContextData={getAppContextData} 
                        widgetContexts={attachedWidgetContexts}
                        onRemoveWidgetContext={onRemoveWidgetContext}
                        onClearWidgetContexts={onClearWidgetContexts}
                        context="panel"
                        bookmarks={bookmarks}
                        setActiveChatId={setActiveChatId}
                        onMaximize={onMaximize}
                        actions={actions}
                        contextPercentage={contextPercentage}
                    />
                </div>
            </div>
        </aside>
    );
};