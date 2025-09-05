

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, MinusIcon, SparklesIcon, PlusIcon, BookmarkIcon, GitBranchIcon, FileTextIcon, FolderIcon, SettingsIcon, UsersIcon, CubeIcon, CheckSquareIcon, TargetIcon, FilterOffIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Message, ChatSession, Bookmark, WidgetContext } from '../types';

interface PerpetualDiscussionToastProps {
    session: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (payload: { displayText: string, promptText: string }) => void;
    onRegenerate: (messageId: number) => void;
    onClose: () => void;
    onMaximize: () => void;
    isMinimized: boolean;
    setIsMinimized: (minimized: boolean) => void;
    bookmarks: Bookmark[];
    onToggleBookmark: (message: Message) => void;
    setActiveChatId: (id: string) => void;
    getAppContextData?: (command: string) => string;
    attachedWidgetContexts: WidgetContext[];
    onRemoveWidgetContext: (id: string) => void;
    onClearWidgetContexts: () => void;
    actions: { [key: string]: (arg?: any) => void };
}

export const PerpetualDiscussionToast: React.FC<PerpetualDiscussionToastProps> = ({
    session,
    isLoading,
    isMessageQueued,
    onSend,
    onRegenerate,
    onClose,
    onMaximize,
    isMinimized,
    setIsMinimized,
    bookmarks,
    onToggleBookmark,
    setActiveChatId,
    getAppContextData,
    attachedWidgetContexts,
    onRemoveWidgetContext,
    onClearWidgetContexts,
    actions
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // FIX: Calculate contextPercentage based on the session messages.
    const contextPercentage = useMemo(() => {
        if (!session) return 0;
        // Approximation of token usage. Assume 20k chars is max for a more dynamic visual.
        const charCount = JSON.stringify(session.messages).length;
        return Math.min(100, (charCount / 20000) * 100);
    }, [session]);


    const scrollToBottom = () => {
        if (!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(scrollToBottom, [session.messages, isLoading, isMinimized]);
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 200); // Wait for animation
    };

    return (
        <div className={`fixed bottom-6 right-6 z-40 w-[26rem] max-w-[calc(100vw-3rem)] transition-all duration-200 ease-in-out ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <Card className="h-[65vh] max-h-[700px] flex flex-col shadow-2xl shadow-black/40 border-violet-500/30">
                <CardHeader className="flex flex-row items-center justify-between !py-2 !px-3 border-b border-zinc-700/50">
                     <CardTitle className="flex items-center gap-2 text-sm font-semibold truncate">
                        <SparklesIcon className="h-5 w-5 text-violet-400 flex-shrink-0" />
                        <span className="truncate">{(session.title && session.title !== 'New Chat') ? session.title : 'Moebius'}</span>
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7" aria-label="Minimize chat">
                            <MinusIcon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onMaximize} className="h-7 w-7" aria-label="Maximize chat">
                            <Maximize2Icon className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleClose} className="h-7 w-7" aria-label="Close chat">
                            <XIcon className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 pt-6 space-y-6">
                     {session.messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </CardContent>
                
                <ChatInput 
                    onSend={onSend} 
                    isLoading={isLoading} 
                    isMessageQueued={isMessageQueued}
                    getAppContextData={getAppContextData}
                    widgetContexts={attachedWidgetContexts}
                    onRemoveWidgetContext={onRemoveWidgetContext}
                    onClearWidgetContexts={onClearWidgetContexts}
                    context="toast"
                    bookmarks={bookmarks}
                    setActiveChatId={setActiveChatId}
                    onMaximize={onMaximize}
                    actions={actions}
                    // FIX: Pass the contextPercentage prop to the ChatInput component.
                    contextPercentage={contextPercentage}
                />
            </Card>
        </div>
    );
};