import React, { useState, forwardRef } from 'react';
import { CardHeader, CardTitle, CardContent } from './ui/Card';
import { BellIcon } from './Icons';
import { Button } from './ui/Button';
import { HeaderPanel } from './ui/HeaderPanel';
import { initialNotifications } from '../data';

type Tab = 'All' | 'Unread';

interface NotificationsPanelProps {
    onGoToFullscreen: () => void;
    position?: { top: number; left: number } | null;
}

const NotificationsPanel = forwardRef<HTMLDivElement, NotificationsPanelProps>(({ onGoToFullscreen, position }, ref) => {
    const [activeTab, setActiveTab] = useState<Tab>('All');

    const filteredNotifications = initialNotifications.filter(n => 
        activeTab === 'All' || (activeTab === 'Unread' && n.unread)
    );
    
    return (
        <HeaderPanel ref={ref} position={position}>
            <div className="w-[30rem] max-w-lg">
                <CardHeader className="flex flex-row items-center justify-between !pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <BellIcon className="h-5 w-5" /> Notifications
                    </CardTitle>
                    <Button variant="ghost" size="default" className="text-xs h-auto py-1 px-2">Mark all as read</Button>
                </CardHeader>
                <CardContent className="!p-0">
                    <div className="flex border-t border-zinc-700/50">
                        {/* Left Menu */}
                        <aside className="w-1/4 border-r border-zinc-700/50 p-2">
                            {(['All', 'Unread'] as Tab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                                        activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/60'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </aside>

                        {/* Right Content */}
                        <div className="w-3/4">
                            {filteredNotifications.length > 0 ? (
                                <ul className="divide-y divide-zinc-700/50 max-h-96 overflow-y-auto">
                                {filteredNotifications.map(n => {
                                    const Icon = n.icon;
                                    return (
                                        <li key={n.id} className="p-3 hover:bg-zinc-800/40">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                     <Icon className={`h-5 w-5 ${n.iconColor}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-zinc-100">{n.title}</p>
                                                    <p className="text-xs text-zinc-400">{n.detail}</p>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-xs text-zinc-500">{n.time}</p>
                                                    {n.unread && <div className="w-2 h-2 rounded-full bg-violet-500 ml-auto mt-1"></div>}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                                </ul>
                            ) : (
                                <div className="h-full flex items-center justify-center p-8">
                                    <p className="text-sm text-zinc-500">No unread notifications.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <div className="p-2 border-t border-zinc-700/50 text-center">
                    <button onClick={onGoToFullscreen} className="text-sm font-medium text-violet-400 hover:text-violet-300 w-full p-1 rounded-md transition-colors duration-200">
                        View All Notifications
                    </button>
                </div>
            </div>
        </HeaderPanel>
    )
});
NotificationsPanel.displayName = 'NotificationsPanel';
export default NotificationsPanel;
