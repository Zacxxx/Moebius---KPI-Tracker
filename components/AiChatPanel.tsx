

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Message, ChatSession, Bookmark, WidgetContext } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, SparklesIcon, MessageSquareIcon, WifiIcon, UsersIcon, ClockIcon, LightningBoltIcon, PlusCircleIcon, PaperclipIcon, BookmarkIcon, ClipboardIcon, FolderIcon, SettingsIcon, RefreshCwIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { BookmarksPanel } from './chat/BookmarksPanel';
import { ActionButton } from './chat/ActionButton';
import { ActionPanel } from './chat/ActionPanel';

interface AiChatPanelProps {
    session?: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    isMessageQueued: boolean;
    onSend: (message: string) => void;
    onRegenerate: (messageId: number) => void;
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

export const AiChatPanel: React.FC<AiChatPanelProps> = ({
    session,
    isLoading,
    isMessageQueued,
    onSend,
    onRegenerate,
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
    const [activePanel, setActivePanel] = useState<string | null>(null);
    const panelContainerRef = useRef<HTMLDivElement>(null);
    useClickOutside(panelContainerRef, () => setActivePanel(null));

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
            className="fixed top-0 right-0 h-full bg-zinc-900/70 backdrop-blur-xl border-l border-zinc-700/50 z-30"
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
                 <div className="px-3 py-1.5 border-b border-zinc-700/50 text-xs text-zinc-400 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-emerald-400 font-medium"><WifiIcon className="h-4 w-4" /> Connected</div>
                    <div className="flex items-center gap-1"><UsersIcon className="h-4 w-4" /> 1 online</div>
                    <div className="flex items-center gap-1"><MessageSquareIcon className="h-4 w-4" /> {session?.messages?.length || 0} messages</div>
                    <div className="flex items-center gap-1"><LightningBoltIcon className="h-4 w-4 text-emerald-400" /> AI Ready <span className="text-zinc-500">(1.2s avg)</span></div>
                    <ClockIcon className="h-4 w-4" />
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
                            <h3 className="text-lg font-semibold text-zinc-300">No active chat</h3>
                            <p className="max-w-sm mt-1 text-sm">Start a new chat from the sidebar.</p>
                        </div>
                    )}
                </div>
                <div className="relative mt-auto" ref={panelContainerRef}>
                     <div className="absolute bottom-full mb-2 right-4 w-80 max-w-sm">
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
                    {session && (
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
                    )}
                    <ChatInput 
                        onSend={onSend} 
                        isLoading={isLoading || !session} 
                        isMessageQueued={isMessageQueued}
                        getAppContextData={getAppContextData} 
                        widgetContexts={attachedWidgetContexts}
                        onRemoveWidgetContext={onRemoveWidgetContext}
                        onClearWidgetContexts={onClearWidgetContexts}
                    />
                </div>
            </div>
        </aside>
    );
};