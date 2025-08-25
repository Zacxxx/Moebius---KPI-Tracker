import React from 'react';
import type { ActivityItem, GenericWidgetProps } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';
import { WidgetHeader } from './dashboard-widgets/ProductStockWidget';

const ActivityFeed: React.FC<GenericWidgetProps> = ({ instance, onConfigure, data, onCite }) => {
    const activities = (data as ActivityItem[]) || [];
    const { title } = instance.config;

    return (
        <Card className="h-full">
            <CardHeader>
                <WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} />
            </CardHeader>
            <CardContent>
                {activities.length > 0 ? (
                    <ul className="space-y-4">
                        {activities.map(item => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1 p-2 bg-zinc-800/70 rounded-full">
                                        <Icon className={`h-5 w-5 ${item.iconColor || 'text-zinc-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-zinc-300">
                                            {item.descriptionParts.map((part, index) => (
                                                part.strong ? <strong key={index} className="font-semibold text-zinc-100">{part.text}</strong> : part.text
                                            ))}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{item.timestamp}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-zinc-400 text-sm text-center py-8">No recent activity.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;
