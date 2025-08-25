import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { Message, ChatSession, Bookmark, WidgetContext } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, MessageSquareIcon, PlusIcon, BookmarkIcon, ClipboardIcon, SettingsIcon, UsersIcon, RefreshCwIcon, GitBranchIcon, FileTextIcon, FolderIcon, CubeIcon, CheckSquareIcon, TargetIcon, FilterOffIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ContextWindowIndicator } from './chat/ContextWindowIndicator';

interface AiChatPanelProps {
    session?: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (message: string) => void;
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
                    <div className="flex items-center gap-2 text-lg font-bold text-white min-w-0">
                        <button onClick={() => alert('Project manager not implemented yet.')} className="hover:text-zinc-300 transition-colors">
                            ...
                        </button>
                        <span className="text-zinc-500">/</span>
                        <button onClick={() => alert('Conversation manager not implemented yet.')} className="hover:text-zinc-300 transition-colors truncate">
                            {session?.title || 'New Chat'}
                        </button>
                    </div>
                    <div>
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
                 <div className="px-3 h-12 border-b border-zinc-700/50 text-xs text-zinc-400 flex items-center justify-end gap-2 flex-wrap">
                    <div className="mr-auto">
                        <ContextWindowIndicator percentage={contextPercentage} onClick={() => alert('Context manager clicked')} />
                    </div>
                    <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => alert('Participants clicked')}>
                        <UsersIcon className="h-4 w-4 mr-1.5" /> Participants
                    </Button>
                    <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => alert('Parameters clicked')}>
                        <SettingsIcon className="h-4 w-4 mr-1.5" /> Parameters
                    </Button>
                    <Button variant="ghost" className="h-7 px-2 text-xs" onClick={() => alert('Tasklist not implemented.')}>
                        <ClipboardIcon className="h-4 w-4 mr-1.5" /> Tasklist
                    </Button>
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
                    />
                </div>
            </div>
        </aside>
    );
};