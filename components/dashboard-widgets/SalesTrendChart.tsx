import React, { useMemo } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PALETTE } from '../../constants';
import { fmtEuro } from '../../utils';
import { GenericWidgetProps, TimeConfig, WidgetConfig } from '../../types';
import { WidgetHeader } from './ProductStockWidget';
import { Button } from '../ui/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

// Helper to get ISO week number for a date
const getWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const formatDate = (dateString: string, granularity: TimeConfig['granularity']) => {
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent date shifts
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    
    switch (granularity) {
        case 'daily':
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'weekly':
            const year = date.getUTCFullYear().toString().slice(-2);
            return `W${getWeek(date)} '${year}`;
        case 'monthly':
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        case 'yearly':
            return date.toLocaleDateString('en-US', { year: 'numeric' });
        default:
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
};

interface TrendGraphicWidgetProps extends GenericWidgetProps {
  onConfigChange: (newConfig: Partial<WidgetConfig>) => void;
}

export const TrendGraphicWidget: React.FC<TrendGraphicWidgetProps> = ({ instance, onConfigure, data = [], onConfigChange, globalTimeConfig, onCite }) => {
    const { title, dataSourceKey, timeConfig: localTimeConfig, isTimeLocked } = instance.config;

    const activeTimeConfig = isTimeLocked 
        ? (localTimeConfig || { type: 'preset', preset: '1y', granularity: 'monthly', offset: 0 })
        : (globalTimeConfig || { type: 'preset', preset: '1y', granularity: 'monthly', offset: 0 });


    const handleLocalNavigate = (direction: 'back' | 'forward') => {
        if (activeTimeConfig.type !== 'preset' || activeTimeConfig.preset === 'all') return;
        const currentOffset = activeTimeConfig.offset || 0;
        const newOffset = direction === 'back' ? currentOffset + 1 : Math.max(0, currentOffset - 1);
        
        onConfigChange({ 
            timeConfig: { ...activeTimeConfig, offset: newOffset } 
        });
    };

    const { dateRange, processedData } = useMemo(() => {
        if (!data || data.length === 0) return { dateRange: 'No data available', processedData: [] };
        
        const now = new Date();
        const { type, preset, custom, granularity, offset = 0 } = activeTimeConfig;

        let startDate: Date | null = null;
        let endDate: Date | null = null;
        let rangeString = 'All Time';

        if (type === 'preset' && preset !== 'all') {
            let monthsDuration = 12;
            if (preset === '3m') monthsDuration = 3;
            if (preset === '6m') monthsDuration = 6;
            
            const effectiveEndDate = new Date(now);
            effectiveEndDate.setMonth(effectiveEndDate.getMonth() - (offset * monthsDuration));
            
            const effectiveStartDate = new Date(effectiveEndDate);
            effectiveStartDate.setMonth(effectiveStartDate.getMonth() - monthsDuration);
            
            startDate = effectiveStartDate;
            endDate = effectiveEndDate;
            
            const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            rangeString = `${formatter.format(startDate)} - ${formatter.format(endDate)}`;

        } else if (type === 'custom' && custom?.from && custom?.to) {
            startDate = new Date(custom.from);
            startDate.setMinutes(startDate.getMinutes() + startDate.getTimezoneOffset());
            
            endDate = new Date(custom.to);
            endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());
            endDate.setHours(23, 59, 59, 999);
            
            const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            rangeString = `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
        }
        
        let filtered = data;
        if (startDate && endDate) {
            filtered = data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate! && itemDate <= endDate!;
            });
        } else if (preset === 'all' && data.length > 0) {
            const firstDate = new Date(data[0].date);
            const lastDate = new Date(data[data.length - 1].date);
            const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            rangeString = `${formatter.format(firstDate)} - ${formatter.format(lastDate)}`;
        }
        
        // Aggregate by granularity
        const aggregated = new Map<string, { Sales: number, firstDate: Date }>();
        const getGroupKey = (date: Date): string => {
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            switch (granularity) {
                case 'daily':
                    return date.toISOString().split('T')[0];
                case 'weekly':
                    const startOfWeek = new Date(date);
                    startOfWeek.setUTCDate(date.getUTCDate() - date.getUTCDay());
                    return startOfWeek.toISOString().split('T')[0];
                case 'monthly': return `${year}-${String(month + 1).padStart(2, '0')}`;
                case 'yearly': return `${year}`;
                default: return date.toISOString().split('T')[0];
            }
        };

        for (const item of filtered) {
            const date = new Date(item.date);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            
            const key = getGroupKey(date);
            if (!aggregated.has(key)) {
                aggregated.set(key, { Sales: 0, firstDate: date });
            }
            const current = aggregated.get(key)!;
            current.Sales += item.Sales;
            aggregated.set(key, current);
        }

        const result = Array.from(aggregated.entries()).map(([, value]) => ({
            date: value.firstDate.toISOString().split('T')[0],
            Sales: value.Sales,
        }));
        
        const sortedResult = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return { dateRange: rangeString, processedData: sortedResult };

    }, [data, activeTimeConfig]);
    
    const showLocalTimeInfo = isTimeLocked;
    const showLocalNavButtons = showLocalTimeInfo && activeTimeConfig.type === 'preset' && activeTimeConfig.preset !== 'all';


    if (!dataSourceKey) {
        return (
             <Card>
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
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} />
                         {showLocalTimeInfo && (
                            <span className="text-xs text-zinc-400 -mt-2 ml-1">{dateRange}</span>
                        )}
                    </div>
                    {showLocalNavButtons && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLocalNavigate('back')} aria-label="Previous period">
                                <ChevronLeftIcon className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLocalNavigate('forward')} disabled={(activeTimeConfig.offset || 0) === 0} aria-label="Next period">
                                <ChevronRightIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={processedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                         <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={PALETTE.super.base} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={PALETTE.super.base} stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={(val) => formatDate(val, activeTimeConfig.granularity)} />
                        <YAxis tickFormatter={(val) => fmtEuro(val)} stroke="#71717a" fontSize={12} />
                        <Tooltip
                          cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }}
                          content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                  return (
                                      <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-lg p-3 shadow-2xl text-zinc-200">
                                          <p className="text-xs font-bold mb-1">{formatDate(String(label), activeTimeConfig.granularity)}</p>
                                          <p className="text-sm font-medium text-white">{`Value: ${fmtEuro(payload[0].value as number)}`}</p>
                                      </div>
                                  );
                              }
                              return null;
                          }}
                        />
                        <Area type="monotone" dataKey="Sales" name={title} stroke={PALETTE.super.stroke} fill="url(#trendGradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
