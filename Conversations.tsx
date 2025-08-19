import React, { useState, useMemo, useRef, useEffect } from 'react';
import { initialConversationUsers, initialTeams } from './data';
import type { ConversationChannel, ConversationUser, ConversationMessage } from './types';
import { SearchIcon, HashIcon, LockIcon, SendIcon, ChevronDownIcon, PaperclipIcon } from './components/Icons';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';

const ChannelIcon: React.FC<{ type: ConversationChannel['type'] }> = ({ type }) => {
    switch (type) {
        case 'public': return <HashIcon className="h-4 w-4 text-zinc-500" />;
        case 'private': return <LockIcon className="h-4 w-4 text-zinc-500" />;
        default: return null;
    }
};

const UserAvatar: React.FC<{ user: ConversationUser | undefined, size?: 'sm' | 'md' }> = ({ user, size = 'md' }) => {
    const sizes = {
        sm: { container: 'h-5 w-5', text: 'text-xs', status: 'h-2 w-2 -bottom-0.5 -right-0.5' },
        md: { container: 'h-9 w-9', text: 'text-base', status: 'h-2.5 w-2.5 bottom-0 right-0' }
    };
    const s = sizes[size];

    if (!user) return <div className={`${s.container} rounded-full bg-zinc-700`} />;
    
    const statusClasses = {
        online: 'bg-emerald-500',
        away: 'bg-yellow-500',
        offline: 'bg-zinc-500',
    };
    
    return (
        <div className="relative flex-shrink-0">
             <div className={`${s.container} rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold ${s.text}`}>
                {user.name.split(' ').map(n=>n[0]).join('')}
            </div>
            {size === 'md' && <span className={`absolute block rounded-full ring-2 ring-zinc-800 ${s.status} ${statusClasses[user.status]}`} />}
        </div>
    );
};

const ChannelSidebar: React.FC<{
    channels: ConversationChannel[];
    activeChannelId: string;
    onSelectChannel: (id: string) => void;
    activeTeamId: string;
    setActiveTeamId: (id: string) => void;
}> = ({ channels, activeChannelId, onSelectChannel, activeTeamId, setActiveTeamId }) => {
    const [search, setSearch] = useState('');
    const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
    
    const activeTeam = useMemo(() => initialTeams.find(t => t.id === activeTeamId), [activeTeamId]);
    
    const filteredChannels = useMemo(() => {
        const teamChannel = initialTeams.find(t => t.id === activeTeamId)?.channelId;

        return channels.filter(c => {
            const nameMatch = c.name.toLowerCase().includes(search.toLowerCase());
            if (!nameMatch) return false;

            if (c.type === 'public' || c.type === 'dm') return true;
            if (c.type === 'private') return c.id === teamChannel;
            
            return false;
        });
    }, [search, channels, activeTeamId]);
    
    const publicChannels = filteredChannels.filter(c => c.type === 'public');
    const privateChannels = filteredChannels.filter(c => c.type === 'private');
    const dms = filteredChannels.filter(c => c.type === 'dm');

    const ChannelList: React.FC<{title: string, data: ConversationChannel[]}> = ({title, data}) => (
        <div>
            <h4 className="px-3 pt-4 pb-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</h4>
            {data.map(channel => {
                const isActive = channel.id === activeChannelId;
                const user = channel.type === 'dm' ? initialConversationUsers.find(u => u.id === channel.members?.[0]) : null;
                return (
                <button key={channel.id} onClick={() => onSelectChannel(channel.id)} className={`w-full text-left px-3 py-1.5 rounded-md flex items-center justify-between gap-2 text-sm transition-colors ${
                    isActive ? 'bg-violet-500/20 text-white font-semibold' : `${channel.unreadCount > 0 ? 'text-white' : 'text-zinc-400'} hover:bg-zinc-800/60`
                }`}>
                    <div className="flex items-center gap-2 truncate">
                        {channel.type === 'dm' ? <UserAvatar user={user || undefined} size="sm" /> : <ChannelIcon type={channel.type} />}
                        <span className="truncate">{channel.name}</span>
                    </div>
                    {channel.unreadCount > 0 && <span className="flex-shrink-0 text-xs font-bold bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">{channel.unreadCount}</span>}
                </button>
            )})}
        </div>
    );

    return (
        <div className="w-[280px] h-full flex flex-col bg-zinc-900/80 border-r border-zinc-700/50">
            <div className="p-4 border-b border-zinc-700/50 flex-shrink-0">
                <div className="relative">
                    <button onClick={() => setIsTeamDropdownOpen(p => !p)} className="flex w-full items-center justify-between p-2 -m-2 rounded-lg hover:bg-zinc-800/60">
                        <h2 className="font-bold text-white text-lg">{activeTeam?.name || 'Select a Team'}</h2>
                        <ChevronDownIcon className={`h-5 w-5 text-zinc-400 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTeamDropdownOpen && (
                        <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
                            {initialTeams.map(team => (
                                <button 
                                    key={team.id} 
                                    onClick={() => { setActiveTeamId(team.id); setIsTeamDropdownOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
                                >
                                    {team.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
             <div className="p-2 border-b border-zinc-700/50">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input 
                        placeholder="Jump to..." 
                        className="h-9 pl-9 text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
                <ChannelList title="Channels" data={[...publicChannels, ...privateChannels]} />
                <ChannelList title="Direct Messages" data={dms} />
            </nav>
        </div>
    );
}

const Message: React.FC<{ message: ConversationMessage }> = ({ message }) => {
    const user = initialConversationUsers.find(u => u.id === message.userId);
    return (
        <div className="flex items-start gap-3 py-1.5 hover:bg-zinc-800/20 px-4 -mx-4 rounded-lg">
            <UserAvatar user={user} />
            <div>
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-zinc-100 text-sm">{message.userName}</span>
                    <span className="text-xs text-zinc-500">{message.timestamp}</span>
                </div>
                <p className="text-zinc-300 text-sm">{message.text}</p>
            </div>
        </div>
    )
}

const ChatWindow: React.FC<{ 
    channel: ConversationChannel | undefined;
    messages: Record<string, ConversationMessage[]>;
}> = ({ channel, messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeMessages = channel ? messages[channel.id] || [] : [];
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);
    
    if (!channel) return <div className="flex-1 flex items-center justify-center text-zinc-500">Select a channel to start talking</div>;

    const channelIcon = channel.type === 'dm' ? <UserAvatar user={initialConversationUsers.find(u => u.id === channel.members?.[0])} size="sm" /> : <ChannelIcon type={channel.type} />;

    return (
         <div className="flex-1 flex flex-col h-full bg-zinc-900">
            <header className="p-4 border-b border-zinc-700/50 flex items-center gap-2 flex-shrink-0">
                {channelIcon}
                <h3 className="font-semibold text-white">{channel.name}</h3>
            </header>
            
            <main className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeMessages.map(msg => <Message key={msg.id} message={msg} />)}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-zinc-700/50 bg-zinc-900">
                 <div className="relative flex items-end gap-2 bg-zinc-800 border border-zinc-700 rounded-lg p-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" aria-label="Add attachment">
                        <PaperclipIcon className="h-5 w-5 text-zinc-400"/>
                    </Button>
                    <textarea
                        rows={1}
                        placeholder={`Message ${channel.type === 'dm' ? '' : '#'}${channel.name}`}
                        className="w-full resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none max-h-40"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0" aria-label="Send Message">
                        <SendIcon className="h-5 w-5 text-zinc-400" />
                    </Button>
                </div>
            </footer>
        </div>
    )
}

interface ConversationsProps {
    activeTeamId: string;
    setActiveTeamId: (id: string) => void;
    channels: ConversationChannel[];
    messages: Record<string, ConversationMessage[]>;
    activeChannelId: string;
    setActiveChannelId: (id: string) => void;
}

export default function Conversations({ activeTeamId, setActiveTeamId, channels, messages, activeChannelId, setActiveChannelId }: ConversationsProps) {
    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <div className="h-full flex text-zinc-200" style={{ margin: '-2rem' }}>
            <ChannelSidebar 
                channels={channels} 
                activeChannelId={activeChannelId} 
                onSelectChannel={setActiveChannelId}
                activeTeamId={activeTeamId}
                setActiveTeamId={setActiveTeamId}
            />
            <ChatWindow channel={activeChannel} messages={messages} />
        </div>
    );
}