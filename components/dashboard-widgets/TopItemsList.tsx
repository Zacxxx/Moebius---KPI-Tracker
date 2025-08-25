import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { GenericWidgetProps } from '../../types';
import { WidgetHeader } from './ProductStockWidget';

export const ListViewWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, data = [], onCite }) => {
    const { title, dataSourceKey } = instance.config;

    if (!dataSourceKey) {
        return (
             <Card className="h-full">
                <CardHeader>
                    <WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} />
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48 text-zinc-500">
                    Click the settings icon to configure this widget.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} />
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {data.map((item: any) => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-zinc-300">{item.name}</span>
                            <span className="font-semibold text-white">{item.value}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};
