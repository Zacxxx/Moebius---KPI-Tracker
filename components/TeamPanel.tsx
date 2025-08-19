
import React, { forwardRef } from 'react';
import { CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { UserPlusIcon } from './Icons';
import { initialTeamMembers } from '../data';
import type { TeamMember } from '../types';
import { HeaderPanel } from './ui/HeaderPanel';

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

const TeamPanel = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <HeaderPanel ref={ref} className="right-40 w-[24rem] max-w-md">
            <CardHeader className="flex flex-row items-center justify-between !pb-4">
                <CardTitle>Team Members</CardTitle>
                <Button variant="ghost" size="default" className="text-xs h-auto py-1 px-2">
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Invite
                </Button>
            </CardHeader>
            <CardContent className="!p-0">
                <ul className="divide-y divide-zinc-700/50 max-h-96 overflow-y-auto">
                    {initialTeamMembers.map(member => (
                        <li key={member.id} className="p-3 hover:bg-zinc-800/40">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-shrink-0">
                                    <Avatar member={member} />
                                    <StatusIndicator status={member.status} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-100 truncate">{member.name}</p>
                                    <p className="text-xs text-zinc-400 truncate">{member.role}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </HeaderPanel>
    );
});

export default TeamPanel;
