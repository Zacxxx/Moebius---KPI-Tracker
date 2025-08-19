import React, { useMemo, useState } from 'react';
import { initialTeams, initialTeamMembers } from './data';
import type { TeamMember, Page } from './types';
import { Button } from './components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { ChevronDownIcon, HashIcon, MessageSquareIcon, UserPlusIcon, UsersIcon } from './components/Icons';
import { Sparkline } from './components/ui/Sparkline';

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
    const statusText = {
        online: 'Online',
        away: 'Away',
        offline: 'Offline'
    }
    return (
        <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${statusClasses[status]}`} />
            <span className="capitalize">{statusText[status]}</span>
        </div>
    );
};


interface TeamManagementProps {
    activeTeamId: string;
    setActiveTeamId: (id: string) => void;
    setPage: (page: Page) => void;
}

export default function TeamManagement({ activeTeamId, setActiveTeamId, setPage }: TeamManagementProps) {
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
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative">
                    <button onClick={() => setIsTeamDropdownOpen(p => !p)} className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-zinc-800/60">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <UsersIcon className="h-6 w-6 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">{activeTeam?.name}</h1>
                            <p className="text-zinc-400 text-sm">Manage your team members and settings.</p>
                        </div>
                        <ChevronDownIcon className={`h-5 w-5 text-zinc-400 transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                     {isTeamDropdownOpen && (
                        <div className="absolute top-full mt-2 w-60 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10">
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
                 <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={handleJoinChannel}>
                        <HashIcon className="h-4 w-4 mr-2" />
                        Join Channel
                    </Button>
                    <Button onClick={() => alert('Invite member modal not implemented.')}>
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Invite Member
                    </Button>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>{teamMembers.length} Members</CardTitle>
                </CardHeader>
                <CardContent className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Timezone</th>
                                    <th scope="col" className="px-6 py-3">Activity (Last 7d)</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.map(member => (
                                   <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800/40">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar member={member} />
                                                <div>
                                                    <p className="font-semibold text-white">{member.name}</p>
                                                    <p className="text-zinc-400">{member.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-zinc-300"><StatusIndicator status={member.status} /></td>
                                        <td className="px-6 py-3 text-zinc-300">{member.timezone}</td>
                                        <td className="px-6 py-3"><Sparkline data={member.activityData} width={100} height={20} /></td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="secondary" size="icon" onClick={() => alert(`Messaging ${member.name}`)}>
                                                <MessageSquareIcon className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
