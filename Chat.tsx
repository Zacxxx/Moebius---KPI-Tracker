

import React, { useRef, useEffect, useState } from 'react';
import type { ChatSession, Message, Bookmark, WidgetContext } from './types';
import { ChatMessage, TypingIndicator } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { MessageSquareIcon, SparklesIcon, PlusCircleIcon, PaperclipIcon, BookmarkIcon, ClipboardIcon, FolderIcon, SettingsIcon, UsersIcon, WifiIcon, ClockIcon, LightningBoltIcon } from './components/Icons';
import { Button } from './components/ui/Button';
import { ActionButton } from './components/chat/ActionButton';
import { BookmarksPanel } from './components/chat/BookmarksPanel';
import { ActionPanel } from './components/chat/ActionPanel';

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
    const panelContainerRef = useRef<HTMLDivElement>(null);
    useClickOutside(panelContainerRef, () => setActivePanel(null));


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [session?.messages, isLoading]);
    
    if (!session) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                <MessageSquareIcon className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold text-zinc-300">Welcome to AI Chat</h2>
                <p className="max-w-sm mt-1">Select a conversation from the sidebar or start a new one to begin.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-zinc-900/50">
            <div className="px-3 py-1.5 border-b border-zinc-700/50 text-xs text-zinc-400 flex items-center justify-between gap-2 flex-wrap flex-shrink-0">
                <div className="flex items-center gap-1 text-emerald-400 font-medium"><WifiIcon className="h-4 w-4" /> Connected</div>
                <div className="flex items-center gap-1"><UsersIcon className="h-4 w-4" /> 1 online</div>
                <div className="flex items-center gap-1"><MessageSquareIcon className="h-4 w-4" /> {session.messages.length} messages</div>
                <div className="flex items-center gap-1"><LightningBoltIcon className="h-4 w-4 text-emerald-400" /> AI Ready <span className="text-zinc-500">(1.2s avg)</span></div>
                <ClockIcon className="h-4 w-4" />
            </div>
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6">
                {session.messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </main>
            <div className="relative mt-auto" ref={panelContainerRef}>
                <div className="absolute bottom-full mb-2 left-4 w-80 max-w-sm z-50">
                    {activePanel === 'bookmark' && (
                        <BookmarksPanel
                          bookmarks={bookmarks}
                          onSelectBookmark={(sessionId) => {
                            setActiveChatId(sessionId);
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
        </div>
    );
}