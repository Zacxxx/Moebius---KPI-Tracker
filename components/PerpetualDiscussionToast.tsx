
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon, Maximize2Icon, MinusIcon, SparklesIcon, ChevronUpIcon, BookmarkIcon as PanelBookmarkIcon, UserIcon } from './Icons';
import { ChatMessage, TypingIndicator } from './MessageBubble';
import { ChatInput } from './ChatInput';
import type { Message, ChatSession, Bookmark } from '../types';

interface PerpetualDiscussionToastProps {
    session: ChatSession & { messages: (Message & { isBookmarked?: boolean })[] };
    isLoading: boolean;
    onSend: (message: string) => void;
    onRegenerate: (messageId: number) => void;
    onClose: () => void;
    onMaximize: () => void;
    isMinimized: boolean;
    setIsMinimized: (minimized: boolean) => void;
    bookmarks: Bookmark[];
    onToggleBookmark: (message: Message) => void;
    setActiveChatId: (id: string) => void;
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

interface BookmarksPanelProps {
    bookmarks: Bookmark[];
    onSelectBookmark: (sessionId: string) => void;
}
const BookmarksPanel = forwardRef<HTMLDivElement, BookmarksPanelProps>(({ bookmarks, onSelectBookmark }, ref) => {
    return (
        <div ref={ref} className="absolute bottom-20 -right-2 w-80 max-w-sm z-50">
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

export const PerpetualDiscussionToast: React.FC<PerpetualDiscussionToastProps> = ({
    session,
    isLoading,
    onSend,
    onRegenerate,
    onClose,
    onMaximize,
    isMinimized,
    setIsMinimized,
    bookmarks,
    onToggleBookmark,
    setActiveChatId,
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);
    const bookmarksPanelRef = useRef<HTMLDivElement>(null);
    useClickOutside(bookmarksPanelRef, () => setIsBookmarksPanelOpen(false));


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

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="flex items-center gap-3 p-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-2xl shadow-black/30 transition-all duration-200 hover:scale-105"
                >
                    <SparklesIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">AI Assistant</span>
                    <ChevronUpIcon className="h-5 w-5" />
                </button>
            </div>
        )
    }

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

                <div className="relative" ref={bookmarksPanelRef}>
                    <ChatInput onSend={onSend} isLoading={isLoading} onToggleBookmarksPanel={() => setIsBookmarksPanelOpen(p => !p)} />
                    {isBookmarksPanelOpen && (
                        <BookmarksPanel
                            bookmarks={bookmarks}
                            onSelectBookmark={(sessionId) => {
                                setActiveChatId(sessionId);
                                onMaximize();
                                setIsBookmarksPanelOpen(false);
                            }}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};
