import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface ActionPanelProps {
    title: string;
    icon: React.FC<{className?: string}>;
    children: React.ReactNode;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ title, icon: Icon, children }) => {
    return (
        <div className="z-50">
            <Card className="overflow-hidden shadow-2xl shadow-black/40 border-zinc-700/30">
                <CardHeader className="flex flex-row items-center justify-between !py-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="h-5 w-5" /> {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="!p-0">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};
