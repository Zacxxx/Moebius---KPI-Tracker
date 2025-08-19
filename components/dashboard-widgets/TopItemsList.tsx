import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface Item {
    id: number;
    name: string;
    value: string;
}

interface TopItemsListProps {
    title: string;
    items: Item[];
}

export const TopItemsList: React.FC<TopItemsListProps> = ({ title, items }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {items.map(p => (
                        <li key={p.id} className="flex justify-between items-center text-sm">
                            <span className="text-zinc-300">{p.name}</span>
                            <span className="font-semibold text-white">{p.value}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};
