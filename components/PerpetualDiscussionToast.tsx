

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, MinusIcon, SparklesIcon, ChevronUpIcon, PlusCircleIcon, PaperclipIcon, BookmarkIcon, ClipboardIcon, FolderIcon, SettingsIcon, UsersIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Message, ChatSession, Bookmark, WidgetContext } from '../types';
import { BookmarksPanel } from './chat/BookmarksPanel';
import { ActionButton } from './chat/ActionButton';
import { ActionPanel } from './chat/ActionPanel';

interface PerpetualDiscussionToastProps {
    session: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (message: string) => void;
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
}

const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

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
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const panelContainerRef = useRef<HTMLDivElement>(null);
    useClickOutside(panelContainerRef, () => setActivePanel(null));


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
                     <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                        <SparklesIcon className="h-5 w-5 text-violet-400" />
                        AI Assistant
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
                
                <div className="relative" ref={panelContainerRef}>
                    <div className="absolute bottom-full mb-2 right-0 w-80 max-w-sm">
                        {activePanel === 'bookmark' && (
                            <BookmarksPanel
                                bookmarks={bookmarks}
                                onSelectBookmark={(sessionId) => {
                                    setActiveChatId(sessionId);
                                    onMaximize();
                                    setActivePanel(null);
                                }}
                            />
                        )}
                        {activePanel === 'link' && (
                            <ActionPanel title="Attach Link" icon={PaperclipIcon}>
                                <div className="p-4 text-sm text-zinc-400">Attach link functionality placeholder.</div>
                            </ActionPanel>
                        )}
                        {activePanel === 'copy' && (
                            <ActionPanel title="Copy Conversation" icon={ClipboardIcon}>
                                <div className="p-4 text-sm text-zinc-400">Copy conversation functionality placeholder.</div>
                            </ActionPanel>
                        )}
                        {activePanel === 'folder' && (
                            <ActionPanel title="Save to Folder" icon={FolderIcon}>
                                <div className="p-4 text-sm text-zinc-400">Save to folder functionality placeholder.</div>
                            </ActionPanel>
                        )}
                        {activePanel === 'settings' && (
                            <ActionPanel title="Chat Settings" icon={SettingsIcon}>
                                <div className="p-4 text-sm text-zinc-400">Chat settings functionality placeholder.</div>
                            </ActionPanel>
                        )}
                        {activePanel === 'users' && (
                            <ActionPanel title="Participants" icon={UsersIcon}>
                                <div className="p-4 text-sm text-zinc-400">Chat participants functionality placeholder.</div>
                            </ActionPanel>
                        )}
                    </div>

                    <div className="px-4 py-2 border-t border-zinc-700/50 flex items-center gap-2">
                        <Button size="icon" className="h-8 w-8 bg-violet-600 hover:bg-violet-700 flex-shrink-0"><PlusCircleIcon className="h-5 w-5"/></Button>
                        <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 overflow-x-auto">
                            <ActionButton label="Link" onClick={() => setActivePanel(p => p === 'link' ? null : 'link')}><PaperclipIcon className="h-4 w-4"/></ActionButton>
                            <ActionButton label="Bookmark" onClick={() => setActivePanel(p => p === 'bookmark' ? null : 'bookmark')}><BookmarkIcon className="h-4 w-4"/></ActionButton>
                            <ActionButton label="Copy" onClick={() => setActivePanel(p => p === 'copy' ? null : 'copy')}><ClipboardIcon className="h-4 w-4"/></ActionButton>
                            <ActionButton label="Folder" onClick={() => setActivePanel(p => p === 'folder' ? null : 'folder')}><FolderIcon className="h-4 w-4"/></ActionButton>
                            <ActionButton label="Settings" onClick={() => setActivePanel(p => p === 'settings' ? null : 'settings')}><SettingsIcon className="h-4 w-4"/></ActionButton>
                            <ActionButton label="Users" onClick={() => setActivePanel(p => p === 'users' ? null : 'users')}><UsersIcon className="h-4 w-4"/></ActionButton>
                        </div>
                    </div>

                    <ChatInput 
                        onSend={onSend} 
                        isLoading={isLoading} 
                        isMessageQueued={isMessageQueued}
                        getAppContextData={getAppContextData}
                        widgetContexts={attachedWidgetContexts}
                        onRemoveWidgetContext={onRemoveWidgetContext}
                        onClearWidgetContexts={onClearWidgetContexts}
                    />
                </div>
            </Card>
        </div>
    );
};