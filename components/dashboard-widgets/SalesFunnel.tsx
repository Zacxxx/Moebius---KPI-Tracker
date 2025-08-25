import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ChevronDownIcon } from '../Icons';
import { GenericWidgetProps } from '../../types';
import { WidgetHeader } from './ProductStockWidget';

const FunnelStage: React.FC<{ title: string; value: number; conversion?: number; color: string; isFirst?: boolean; isLast?: boolean; }> = ({ title, value, conversion, color, isFirst = false, isLast = false }) => (
    <div className="relative flex flex-col items-center">
        {!isFirst && <ChevronDownIcon className="h-6 w-6 text-zinc-600 my-1" />}
        <div className={`w-full p-3 rounded-lg text-center border-b-4 ${color}`}>
            <p className="text-sm text-zinc-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
        {!isLast && conversion && (
            <div className="mt-2 text-center text-xs text-zinc-400">
                <p>Conversion</p>
                <p className="font-semibold text-zinc-200">{conversion}%</p>
            </div>
        )}
    </div>
);


export const FunnelGraphicWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, data = [], onCite }) => {
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
            <CardContent className="space-y-2">
                {data.map((stage: any, index: number) => (
                    <FunnelStage
                        key={stage.title}
                        title={stage.title}
                        value={stage.value}
                        conversion={stage.conversion}
                        color={stage.color}
                        isFirst={index === 0}
                        isLast={index === data.length - 1}
                    />
                ))}
            </CardContent>
        </Card>
    );
};
