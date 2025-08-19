
import React, { useRef, useEffect, useState, forwardRef } from 'react';
import type { ChatSession, Message, Bookmark } from './types';
import { ChatMessage, TypingIndicator } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { MessageSquareIcon, BookmarkIcon as PanelBookmarkIcon, SparklesIcon, UserIcon } from './components/Icons';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';

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

interface BookmarksPanelProps {
    bookmarks: Bookmark[];
    onSelectBookmark: (sessionId: string) => void;
}

const BookmarksPanel = forwardRef<HTMLDivElement, BookmarksPanelProps>(({ bookmarks, onSelectBookmark }, ref) => {
    return (
        <div ref={ref} className="absolute bottom-20 left-4 w-80 max-w-sm z-50">
            <Card className="overflow-hidden shadow-2xl shadow-black/40 border-violet-500/30">
                <CardHeader className="flex flex-row items-center justify-between !py-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <PanelBookmarkIcon className="h-5 w-5" /> Bookmarks
                    </CardTitle>
                </CardHeader>
                <CardContent className="!p-0">
                   {bookmarks.length > 0 ? (
                       <ul className="divide-y divide-zinc-700/50 max-h-80 overflow-y-auto">
                            {bookmarks.map(({ message, sessionId, sessionTitle }) => (
                                <li key={message.id}>
                                    <button 
                                        onClick={() => onSelectBookmark(sessionId)}
                                        className="p-3 w-full text-left hover:bg-zinc-800/40 transition-colors"
                                    >
                                        <p className="text-xs text-zinc-400 truncate mb-1">{sessionTitle}</p>
                                        <div className="flex items-start gap-2">
                                            {message.sender === 'user' ? <UserIcon className="h-4 w-4 mt-0.5 text-zinc-500 flex-shrink-0" /> : <SparklesIcon className="h-4 w-4 mt-0.5 text-violet-400 flex-shrink-0" />}
                                            <p className="text-sm text-zinc-200 line-clamp-2">{message.text}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                       </ul>
                   ) : (
                       <div className="p-8 text-center">
                           <p className="text-sm text-zinc-500">No bookmarks yet.</p>
                           <p className="text-xs text-zinc-600 mt-1">Click the bookmark icon on a message to save it.</p>
                       </div>
                   )}
                </CardContent>
            </Card>
        </div>
    )
});

interface ChatProps {
    session?: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    onSend: (message: string) => void;
    onRegenerate: (messageId: number) => void;
    bookmarks: Bookmark[];
    onToggleBookmark: (message: Message) => void;
    setActiveChatId: (id: string) => void;
}

export default function Chat({ session, isLoading, onSend, onRegenerate, bookmarks, onToggleBookmark, setActiveChatId }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);
    const bookmarksPanelRef = useRef<HTMLDivElement>(null);
    useClickOutside(bookmarksPanelRef, () => setIsBookmarksPanelOpen(false));

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
        <div className="h-full flex flex-col">
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6">
                {session.messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} onToggleBookmark={onToggleBookmark} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </main>
            <div className="relative" ref={bookmarksPanelRef}>
                <ChatInput onSend={onSend} isLoading={isLoading} onToggleBookmarksPanel={() => setIsBookmarksPanelOpen(p => !p)} />
                {isBookmarksPanelOpen && (
                    <BookmarksPanel
                      bookmarks={bookmarks}
                      onSelectBookmark={(sessionId) => {
                        setActiveChatId(sessionId);
                        setIsBookmarksPanelOpen(false);
                      }}
                    />
                )}
            </div>
        </div>
    );
}
