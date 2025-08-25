import React, { useState, useMemo, forwardRef } from 'react';
import { CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { MessageSquareIcon, EditIcon, Maximize2Icon, SearchIcon, HashIcon, LockIcon } from './Icons';
import { HeaderPanel } from './ui/HeaderPanel';
import { Input } from './ui/Input';
import { initialConversationChannels, initialConversationUsers } from '../data';
import type { ConversationChannel, ConversationUser } from '../types';

const ChannelIcon: React.FC<{ type: ConversationChannel['type'] }> = ({ type }) => {
    switch (type) {
        case 'public': return <HashIcon className="h-4 w-4 text-zinc-500" />;
        case 'private': return <LockIcon className="h-4 w-4 text-zinc-500" />;
        case 'dm': return null;
        default: return null;
    }
};

const UserAvatar: React.FC<{ user: ConversationUser | undefined }> = ({ user }) => {
    if (!user) return <div className="h-5 w-5 rounded-full bg-zinc-700" />;
    
    const statusClasses = {
        online: 'bg-emerald-500',
        away: 'bg-yellow-500',
        offline: 'bg-zinc-500',
    };
    
    return (
        <div className="relative">
             <div className="h-5 w-5 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full ring-1 ring-zinc-800 ${statusClasses[user.status]}`} />
        </div>
    );
};

interface ConversationsPanelProps {
    onGoToFullscreen: () => void;
    onOpenConversationToast: (channelId: string) => void;
    position?: { top: number; left: number } | null;
}

const ConversationsPanel = forwardRef<HTMLDivElement, ConversationsPanelProps>(
    ({ onGoToFullscreen, onOpenConversationToast, position }, ref) => {
    const [search, setSearch] = useState('');
    
    const filteredChannels = useMemo(() => {
        return initialConversationChannels.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    }, [search]);

    const publicChannels = filteredChannels.filter(c => c.type === 'public');
    const privateChannels = filteredChannels.filter(c => c.type === 'private');
    const dms = filteredChannels.filter(c => c.type === 'dm');

    return (
        <HeaderPanel ref={ref} position={position}>
            <div className="w-[22rem] max-w-md">
                <CardHeader className="flex flex-row items-center justify-between !pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquareIcon className="h-5 w-5" />
                        Conversations
                    </CardTitle>
                     <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="New Message">
                            <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onGoToFullscreen} aria-label="Fullscreen">
                            <Maximize2Icon className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <div className="px-3 pb-3 border-b border-zinc-700/50">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input 
                            placeholder="Search..." 
                            className="h-9 pl-9"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <CardContent className="!p-0 max-h-96 overflow-y-auto">
                    <div className="p-2 space-y-1">
                        <h4 className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Channels</h4>
                        {publicChannels.map(channel => (
                            <button key={channel.id} onClick={() => onOpenConversationToast(channel.id)} className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between gap-2 text-sm transition-colors ${channel.unreadCount > 0 ? 'text-white font-semibold' : 'text-zinc-400'} hover:bg-zinc-800/60`}>
                                <div className="flex items-center gap-2 truncate">
                                    <ChannelIcon type={channel.type} />
                                    <span className="truncate">{channel.name}</span>
                                </div>
                                {channel.unreadCount > 0 && <span className="flex-shrink-0 text-xs font-bold bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">{channel.unreadCount}</span>}
                            </button>
                        ))}
                         {privateChannels.map(channel => (
                            <button key={channel.id} onClick={() => onOpenConversationToast(channel.id)} className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between gap-2 text-sm transition-colors ${channel.unreadCount > 0 ? 'text-white font-semibold' : 'text-zinc-400'} hover:bg-zinc-800/60`}>
                                 <div className="flex items-center gap-2 truncate">
                                    <ChannelIcon type={channel.type} />
                                    <span className="truncate">{channel.name}</span>
                                </div>
                                {channel.unreadCount > 0 && <span className="flex-shrink-0 text-xs font-bold bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">{channel.unreadCount}</span>}
                            </button>
                        ))}

                        <h4 className="px-2 pt-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Direct Messages</h4>
                        {dms.map(channel => {
                             const user = initialConversationUsers.find(u => u.id === channel.members?.[0]);
                            return (
                            <button key={channel.id} onClick={() => onOpenConversationToast(channel.id)} className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between gap-2 text-sm transition-colors ${channel.unreadCount > 0 ? 'text-white font-semibold' : 'text-zinc-400'} hover:bg-zinc-800/60`}>
                                <div className="flex items-center gap-2 truncate">
                                    <UserAvatar user={user} />
                                    <span className="truncate">{channel.name}</span>
                                </div>
                                {channel.unreadCount > 0 && <span className="flex-shrink-0 text-xs font-bold bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">{channel.unreadCount}</span>}
                            </button>
                        )})}
                    </div>
                </CardContent>
            </div>
        </HeaderPanel>
    );
});
ConversationsPanel.displayName = 'ConversationsPanel';
export default ConversationsPanel;
