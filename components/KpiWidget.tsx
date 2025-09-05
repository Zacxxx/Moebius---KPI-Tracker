import React from 'react';
import { Card } from './ui/Card';

interface KpiWidgetProps {
    title: string;
    value: string;
    change?: string;
    icon: React.FC<{ className?: string }>;
    iconColor?: string;
    inverse?: boolean;
    isKpiSentimentColoringEnabled?: boolean;
}

export const KpiWidget: React.FC<KpiWidgetProps> = ({
    title,
    value,
    change,
    icon: Icon,
    iconColor = 'text-violet-400',
    inverse = false,
    isKpiSentimentColoringEnabled = true,
}) => {
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (change) {
        if (change.includes('+')) {
            sentiment = inverse ? 'negative' : 'positive';
        } else if (change.includes('-')) {
            sentiment = inverse ? 'positive' : 'negative';
        }
    }

    const valueColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400' : 'text-white';
    const changeColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400/80' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400/80' : 'text-zinc-500';

    return (
        <Card className="h-full">
            <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div className="mt-auto text-left">
                    <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
                    {change && <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>}
                </div>
            </div>
        </Card>
    );
};
