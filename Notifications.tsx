import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { initialNotifications } from './data';
import type { NotificationItem } from './types';

type Tab = 'All' | 'Unread';

export default function Notifications() {
    const [activeTab, setActiveTab] = useState<Tab>('All');
    const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

    const filteredNotifications = notifications.filter(n => 
        activeTab === 'All' || (activeTab === 'Unread' && n.unread)
    );

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };
    
    return (
        <div className="space-y-8">
             <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Notifications</h1>
                    <p className="text-zinc-400 mt-1">Manage all your account and system notifications.</p>
                </div>
                <Button onClick={markAllAsRead} disabled={!notifications.some(n => n.unread)}>Mark all as read</Button>
            </header>

            <Card>
                <CardHeader className="!p-0">
                    <div className="border-b border-zinc-700/50">
                        <div className="flex items-center gap-2 px-4">
                             {(['All', 'Unread'] as Tab[]).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                                        activeTab === tab ? 'border-violet-400 text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="!p-0">
                    {filteredNotifications.length > 0 ? (
                        <ul className="divide-y divide-zinc-800">
                        {filteredNotifications.map(n => {
                            const Icon = n.icon;
                            return (
                                <li key={n.id} className={`transition-colors ${n.unread ? 'bg-zinc-900/30' : ''}`}>
                                    <div className="p-4 hover:bg-zinc-800/40 flex items-start gap-4">
                                        {n.unread && <div className="w-2 h-2 rounded-full bg-violet-500 mt-2.5 flex-shrink-0" aria-label="Unread"></div>}
                                        <div className={`p-2 bg-zinc-800/70 rounded-full flex-shrink-0 ${n.unread ? '' : 'ml-6'}`}>
                                            <Icon className={`h-6 w-6 ${n.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-zinc-100">{n.title}</p>
                                            <p className="text-sm text-zinc-400 mt-0.5">{n.detail}</p>
                                        </div>
                                        <div className="flex-shrink-0 text-right">
                                            <p className="text-xs text-zinc-500">{n.time}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                        </ul>
                    ) : (
                        <div className="h-full text-center py-24">
                            <p className="text-lg text-zinc-400">You're all caught up!</p>
                            <p className="text-sm text-zinc-500 mt-1">No new notifications.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}