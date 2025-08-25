
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { BookmarkIcon as PanelBookmarkIcon, SparklesIcon, UserIcon } from '../Icons';
import type { Bookmark } from '../../types';

interface BookmarksPanelProps {
    bookmarks: Bookmark[];
    onSelectBookmark: (sessionId: string) => void;
}
export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({ bookmarks, onSelectBookmark }) => {
    return (
        <div className="z-50">
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
};
