import React, { forwardRef, useState, useMemo } from 'react';
import { CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { UserPlusIcon, Maximize2Icon, ChevronDownIcon, MessageSquareIcon, HashIcon } from './Icons';
import { initialTeamMembers, initialTeamActivity, initialTeams } from '../data';
import type { TeamMember, Page } from '../types';
import { HeaderPanel } from './ui/HeaderPanel';
import { Sparkline } from './ui/Sparkline';

const Avatar: React.FC<{ member: TeamMember }> = ({ member }) => {
    if (member.avatarUrl) {
        return <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />;
    }
    const initials = member.name.split(' ').map(n => n[0]).join('');
    return (
        <div className="h-10 w-10 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-sm">
            {initials}
        </div>
    );
};

const StatusIndicator: React.FC<{ status: TeamMember['status'] }> = ({ status }) => {
    const statusClasses = {
        online: 'bg-emerald-500',
        away: 'bg-yellow-500',
        offline: 'bg-zinc-500',
    };
    return (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-zinc-900 ${statusClasses[status]}`} />
    );
};

interface TeamPanelProps {
    activeTeamId: string;
    setActiveTeamId: (id: string) => void;
    onGoToFullscreen: () => void;
    setPage: (page: Page) => void;
    onViewProfile: (memberId: number) => void;
    onStartDm: (memberId: number) => void;
}

const TeamPanel = forwardRef<HTMLDivElement, TeamPanelProps>(({ activeTeamId, setActiveTeamId, onGoToFullscreen, setPage, onViewProfile, onStartDm }, ref) => {
    const [activeTab, setActiveTab] = useState<'members' | 'activity'>('members');
    const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);

    const activeTeam = useMemo(() => initialTeams.find(t => t.id === activeTeamId), [activeTeamId]);
    const teamMembers = useMemo(() => initialTeamMembers.filter(m => m.teamIds.includes(activeTeamId)), [activeTeamId]);
    
    const handleJoinChannel = () => {
        if (activeTeam) {
            alert(`Joining channel for ${activeTeam.name}`);
            setPage('conversations');
        }
    };
    
    return (
        <HeaderPanel ref={ref} className="right-40 w-[26rem] max-w-md">
            <CardHeader className="flex flex-row items-center justify-between !pb-3">
                 <div className="relative">
                    <button onClick={() => setIsTeamDropdownOpen(p => !p)} className="flex items-center gap-2 p-1 -m-1 rounded-md hover:bg-zinc-800">
                       <CardTitle>{activeTeam?.name || 'Select Team'}</CardTitle>
                       <ChevronDownIcon className={`h-4 w-4 text-zinc-400 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isTeamDropdownOpen && (
                        <div className="absolute top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
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
                <div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onGoToFullscreen} aria-label="Fullscreen View">
                        <Maximize2Icon className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Invite User">
                        <UserPlusIcon className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <div className="px-4 border-b border-zinc-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => setActiveTab('members')} className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'members' ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>Members</button>
                    <button onClick={() => setActiveTab('activity')} className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'activity' ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}>Activity</button>
                </div>
                <Button variant="ghost" size="default" className="text-xs h-auto py-1 px-2" onClick={handleJoinChannel}>
                    <HashIcon className="h-4 w-4 mr-2" />
                    Join Channel
                </Button>
            </div>
            <CardContent className="!p-0">
                {activeTab === 'members' ? (
                    <ul className="divide-y divide-zinc-700/50 max-h-96 overflow-y-auto">
                        {teamMembers.map(member => (
                            <li key={member.id} className="hover:bg-zinc-800/40 group">
                                <div className="p-3 flex items-center justify-between gap-4">
                                    <button onClick={() => onViewProfile(member.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                                        <div className="relative flex-shrink-0">
                                            <Avatar member={member} />
                                            <StatusIndicator status={member.status} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-100 truncate">{member.name}</p>
                                            <p className="text-xs text-zinc-400 truncate">{member.role}</p>
                                        </div>
                                    </button>
                                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onStartDm(member.id); }}>
                                            <MessageSquareIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className="divide-y divide-zinc-700/50 max-h-96 overflow-y-auto">
                        {initialTeamActivity.map(activity => (
                            <li key={activity.id} className="p-3">
                                <p className="text-sm text-zinc-200">
                                    <span className="font-semibold text-white">{activity.memberName}</span> {activity.action}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1">{activity.timestamp}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </HeaderPanel>
    );
});

export default TeamPanel;