import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { UserIcon, SettingsIcon, CreditCardIcon, PaletteIcon, SunIcon, MoonIcon, LaptopIcon, MessageSquareIcon, ClockIcon } from './components/Icons';
import { Input } from './components/ui/Input';
import { Label } from './components/ui/Label';
import type { TeamMember, Page } from './types';
import { initialTeamMembers } from './data';
import { Sparkline } from './components/ui/Sparkline';

const menuItems: { id: string; label: string; icon: React.FC<{className?: string}> }[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'theme', label: 'Theme', icon: PaletteIcon },
];

const ThemeSelector: React.FC = () => {
    const [theme, setTheme] = useState('dark');
    const themeOptions = [
        { id: 'light', label: 'Light', icon: SunIcon },
        { id: 'dark', label: 'Dark', icon: MoonIcon },
        { id: 'system', label: 'System', icon: LaptopIcon },
    ];
    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-zinc-100">Appearance</h4>
            <p className="text-xs text-zinc-400">Customize the look and feel of your dashboard.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {themeOptions.map(option => (
                     <button 
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-colors ${theme === option.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500'}`}
                     >
                        <option.icon className={`h-6 w-6 ${theme === option.id ? 'text-violet-400' : 'text-zinc-400'}`}/>
                        <span className={`text-sm font-medium ${theme === option.id ? 'text-white' : 'text-zinc-300'}`}>{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

// New component for viewing another member's profile
const MemberProfile: React.FC<{ member: TeamMember; setPage: (page: Page) => void }> = ({ member, setPage }) => {
    const statusClasses = {
        online: 'bg-emerald-500',
        away: 'bg-yellow-500',
        offline: 'bg-zinc-500',
    };
    const statusText = {
        online: 'Online',
        away: 'Away',
        offline: 'Offline'
    };

    const handleSendMessage = () => {
        alert(`Starting DM with ${member.name}`);
        setPage('conversations');
    };

    return (
        <div className="space-y-8">
             <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">{member.name}'s Profile</h1>
                <p className="text-zinc-400 mt-1">Viewing team member details.</p>
            </header>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                         <div className="relative flex-shrink-0">
                             <div className="h-24 w-24 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-4xl">
                                {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className={`absolute bottom-1 right-1 block h-4 w-4 rounded-full ring-4 ring-zinc-900 ${statusClasses[member.status]}`} />
                        </div>
                        <div className="flex-1">
                             <h2 className="text-2xl font-bold text-white">{member.name}</h2>
                             <p className="text-lg text-zinc-400">{member.role}</p>
                             <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-300">
                                 <div className="flex items-center gap-2">
                                     <div className={`h-2.5 w-2.5 rounded-full ${statusClasses[member.status]}`} />
                                     <span>{statusText[member.status]}</span>
                                     <span className="text-zinc-500">· {member.lastActive}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <ClockIcon className="h-4 w-4 text-zinc-500" />
                                     <span>{member.timezone}</span>
                                 </div>
                             </div>
                             <div className="mt-4">
                                 <Button onClick={handleSendMessage}>
                                     <MessageSquareIcon className="h-4 w-4 mr-2" />
                                     Send Message
                                 </Button>
                             </div>
                        </div>
                        <div className="w-full sm:w-auto">
                            <p className="text-xs text-zinc-400 mb-1 text-right">Activity (Last 7d)</p>
                            <Sparkline data={member.activityData} width={120} height={30} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Existing content moved to its own component for clarity
const CurrentUserProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const ProfileContent: React.FC = () => {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <p className="text-sm text-zinc-400 mt-1">This information may be displayed publicly.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-3xl flex-shrink-0">
                            JD
                        </div>
                        <div className="space-y-2">
                            <Button variant="secondary">Upload new picture</Button>
                            <p className="text-xs text-zinc-500">Recommended size: 400x400px.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="john.doe@example.com" disabled className="cursor-not-allowed"/>
                        </div>
                    </div>
                     <div className="flex justify-end pt-2">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        )
    };
    
    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileContent />;
            case 'settings': return <Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent><p className="text-zinc-400">Account and security settings will be here.</p></CardContent></Card>;
            case 'billing': return <Card><CardHeader><CardTitle>Billing</CardTitle></CardHeader><CardContent><p className="text-zinc-400">Subscription and payment details will be here.</p></CardContent></Card>;
            case 'theme': return <Card><CardHeader><CardTitle>Theme</CardTitle></CardHeader><CardContent><ThemeSelector /></CardContent></Card>;
            default: return null;
        }
    };
    
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-white">My Account</h1>
                <p className="text-zinc-400 mt-1">Manage your profile, settings, and billing information.</p>
            </header>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="space-y-1">
                        {menuItems.map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-3 w-full p-3 text-sm rounded-lg text-left transition-colors ${activeTab === item.id ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800/60'}`}>
                                <item.icon className={`h-5 w-5 flex-shrink-0 ${activeTab === item.id ? 'text-violet-400' : 'text-zinc-500'}`} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

interface ProfileProps {
    viewedProfileId?: number | null;
    setPage: (page: Page) => void;
}

export default function Profile({ viewedProfileId = null, setPage }: ProfileProps) {
    if (viewedProfileId) {
        const member = initialTeamMembers.find(m => m.id === viewedProfileId);
        if (!member) {
            return (
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-white">User Not Found</h2>
                    <p className="text-zinc-400 mt-2">The team member you're looking for could not be found.</p>
                </div>
            )
        }
        return <MemberProfile member={member} setPage={setPage} />;
    }
    
    return <CurrentUserProfile />;
}
