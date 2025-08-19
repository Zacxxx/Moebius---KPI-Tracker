
import React, { useState, forwardRef } from 'react';
import { Card } from './ui/Card';
import { UserIcon, SettingsIcon, CreditCardIcon, PaletteIcon, LogOutIcon, SunIcon, MoonIcon, LaptopIcon } from './Icons';
import { Button } from './ui/Button';

type Tab = 'profile' | 'settings' | 'billing' | 'theme';

const menuItems: { id: Tab; label: string; icon: React.FC<{className?: string}> }[] = [
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
            <div className="flex items-center gap-2 pt-2">
                {themeOptions.map(option => (
                     <button 
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`flex-1 p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-colors ${theme === option.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500'}`}
                     >
                        <option.icon className={`h-5 w-5 ${theme === option.id ? 'text-violet-400' : 'text-zinc-400'}`}/>
                        <span className={`text-xs font-medium ${theme === option.id ? 'text-white' : 'text-zinc-300'}`}>{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

const UserPanel = forwardRef<HTMLDivElement>((props, ref) => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <div className="text-sm text-zinc-400">Profile settings placeholder.</div>;
            case 'settings':
                return <div className="text-sm text-zinc-400">General settings placeholder.</div>;
            case 'billing':
                return <div className="text-sm text-zinc-400">Billing information placeholder.</div>;
            case 'theme':
                return <ThemeSelector />;
            default:
                return null;
        }
    };
    
    return (
        <div ref={ref} className="absolute top-16 right-6 w-[26rem] max-w-md z-50">
            <Card className="overflow-hidden">
                <div className="flex">
                    {/* Left Menu */}
                    <nav className="w-1/3 border-r border-zinc-700/50 bg-zinc-900/30 p-2">
                        <div className="text-zinc-100 p-2 mb-2">
                            <p className="font-semibold text-sm">John Doe</p>
                            <p className="text-xs text-zinc-400 truncate">john.doe@example.com</p>
                        </div>
                        {menuItems.map(({ id, label, icon: Icon }) => (
                             <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center w-full gap-3 px-3 py-2.5 text-sm rounded-md text-left transition-colors ${
                                    activeTab === id
                                    ? 'bg-violet-500/10 text-violet-300'
                                    : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                                }`}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <span>{label}</span>
                            </button>
                        ))}
                        <div className="border-t border-zinc-700/50 my-2"></div>
                         <button
                            className="flex items-center w-full gap-3 px-3 py-2.5 text-sm rounded-md text-left transition-colors text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                        >
                            <LogOutIcon className="h-5 w-5 flex-shrink-0" />
                            <span>Log Out</span>
                        </button>
                    </nav>

                    {/* Right Content */}
                    <div className="w-2/3 p-4 flex flex-col">
                        {renderContent()}
                    </div>
                </div>
            </Card>
        </div>
    )
});

export default UserPanel;
