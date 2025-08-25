import React, { useRef, useEffect, useState, useMemo } from 'react';
import type { ChatSession, Message, Bookmark, WidgetContext } from './types';
import { ChatMessage, TypingIndicator } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { MessageSquareIcon, PlusIcon, PaperclipIcon, BookmarkIcon, ClipboardIcon, SettingsIcon, UsersIcon, GitBranchIcon, FileTextIcon, FolderIcon, CubeIcon, CheckSquareIcon, TargetIcon, FilterOffIcon } from './components/Icons';
import { Button } from './components/ui/Button';
import { ActionButton } from './components/chat/ActionButton';
import { ContextWindowIndicator } from './components/chat/ContextWindowIndicator';


interface ChatProps {
    session?: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (message: string) => void;
    onRegenerate: (messageId: number) => void;
    bookmarks: Bookmark[];
    onToggleBookmark: (message: Message) => void;
    setActiveChatId: (id: string) => void;
    getAppContextData?: (command: string) => string;
    attachedWidgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
}

export default function Chat({ session, isLoading, isMessageQueued, onSend, onRegenerate, bookmarks, onToggleBookmark, setActiveChatId, getAppContextData, attachedWidgetContexts, onRemoveWidgetContext, onClearWidgetContexts }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activePanel, setActivePanel] = useState<string | null>(null);

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
        <div className="h-full flex flex-col bg-zinc-900/50">
            <div className="px-3 h-12 border-b border-zinc-700/50 text-xs text-zinc-400 flex items-center justify-end gap-2 flex-wrap flex-shrink-0">
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
                />
            </div>
        </div>
    );
}