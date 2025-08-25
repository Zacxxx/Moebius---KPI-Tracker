
import React, { useRef } from 'react';
import { Card } from './ui/Card';
import useResizeObserver from '../hooks/useResizeObserver';

export interface KpiWidgetProps {
  title: string;
  value: string;
  change?: string;
  icon: React.FC<{className?: string}>;
  iconColor?: string;
  inverse?: boolean;
  isKpiSentimentColoringEnabled?: boolean;
}

export const KpiWidget: React.FC<KpiWidgetProps> = ({ title, value, change, icon: Icon, iconColor = 'text-violet-400', inverse = false, isKpiSentimentColoringEnabled = true }) => {
    const widgetRef = useRef<HTMLDivElement>(null);
    const { width } = useResizeObserver(widgetRef);

    const isPositiveChange = change?.includes('+');
    const isNegativeChange = change?.includes('-');

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (isPositiveChange) {
        sentiment = inverse ? 'negative' : 'positive';
    } else if (isNegativeChange) {
        sentiment = inverse ? 'positive' : 'negative';
    }

    const valueColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400' : 'text-white';
    const changeColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400/80' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400/80' : 'text-zinc-500';

    const getSizeConfig = (w: number) => {
        if (w < 120) { // Micro
            return { titleSize: 'text-xs', valueSize: 'text-lg', iconSize: 'h-4 w-4', showChange: false };
        }
        if (w < 200) { // Compact
            return { titleSize: 'text-xs', valueSize: 'text-xl', iconSize: 'h-4 w-4', showChange: true };
        }
        // Normal
        return { titleSize: 'text-sm', valueSize: 'text-2xl', iconSize: 'h-5 w-5', showChange: true };
    };

    const { titleSize, valueSize, iconSize, showChange } = getSizeConfig(width);

    return (
        <Card className="h-full" ref={widgetRef}>
            <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start">
                    <h3 className={`${titleSize} font-medium text-zinc-400`}>{title}</h3>
                    <Icon className={`${iconSize} ${iconColor}`} />
                </div>
                <div className="mt-auto text-left">
                    <p className={`${valueSize} font-bold ${valueColor}`}>{value}</p>
                    {change && showChange && <p className={`text-xs ${changeColor} truncate`}>{change}</p>}
                </div>
            </div>
        </Card>
    );
};
