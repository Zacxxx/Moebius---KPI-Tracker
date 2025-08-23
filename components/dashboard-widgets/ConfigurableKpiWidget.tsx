import React, { useMemo } from 'react';
import type { GenericWidgetProps, SelectableKpi } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { PlusCircleIcon, TrendingUpIcon, ArrowUpIcon, ArrowDownIcon, SettingsIcon, ChartBarIcon } from '../Icons';
import { Button } from '../ui/Button';
import { fmtEuro } from '../../utils';
import { Gauge } from '../ui/Gauge';
import { Sparkline } from '../ui/Sparkline';

interface ConfigurableKpiWidgetProps extends GenericWidgetProps {
    allKpis: SelectableKpi[];
    iconMap: { [key: string]: React.FC<{ className?: string }> };
    iconColorMap: { [key: string]: string };
    onOpenChart: (kpi: SelectableKpi) => void;
}

const formatValue = (value: number, format?: SelectableKpi['format']) => {
    if (isNaN(value)) return 'N/A';
    switch (format) {
        case 'currency': return fmtEuro(value);
        case 'percent': return `${value.toFixed(1)}%`;
        case 'number': return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
        case 'ratio': return value.toFixed(2);
        default: return value.toLocaleString();
    }
}

const getNumericValue = (valueString: string): number => {
    if (!valueString) return 0;
    // Remove symbols and parse. Handles "€1.2M", "11,600", "35%", etc.
    const cleaned = valueString.replace(/[€$%MK]/ig, '').replace(/,/g, '');
    let numeric = parseFloat(cleaned);
    if (valueString.toUpperCase().includes('M')) numeric *= 1000000;
    if (valueString.toUpperCase().includes('K')) numeric *= 1000;
    return isNaN(numeric) ? 0 : numeric;
};

export const ConfigurableKpiWidget: React.FC<ConfigurableKpiWidgetProps> = ({ instance, onConfigure, allKpis, iconMap, iconColorMap, onConfigChange, globalTimeConfig, onOpenChart }) => {
    const { title, selectedKpiId, selectedKpiSource, timeConfig: localTimeConfig, isTimeLocked, style = 'default', form = 'default' } = instance.config;
    
    const activeTimeConfig = isTimeLocked 
        ? (localTimeConfig || { type: 'preset', preset: '3m', granularity: 'monthly', offset: 0 }) 
        : (globalTimeConfig || { type: 'preset', preset: '3m', granularity: 'monthly', offset: 0 });

    const selectedKpi = allKpis && allKpis.find(kpi => kpi.id === selectedKpiId && kpi.source === selectedKpiSource);

    const { displayValue, changeText, currentValue, previousValue, sparklineData, changePercent } = useMemo(() => {
        if (!selectedKpi || !selectedKpi.series) {
            const current = getNumericValue(selectedKpi?.value || '');
            return { displayValue: selectedKpi?.value || 'N/A', changeText: selectedKpi?.change || '', currentValue: current, previousValue: null, sparklineData: [], changePercent: null };
        }
        
        const now = new Date();
        const { type, preset, custom, offset = 0 } = activeTimeConfig;
        
        let monthsDuration = 12;
        if (preset === '3m') monthsDuration = 3;
        if (preset === '6m') monthsDuration = 6;
        
        let currentStartDate: Date, currentEndDate: Date, prevStartDate: Date, prevEndDate: Date;

        if (type === 'preset' && preset !== 'all') {
            currentEndDate = new Date(now);
            currentEndDate.setMonth(currentEndDate.getMonth() - (offset * monthsDuration));
            currentStartDate = new Date(currentEndDate);
            currentStartDate.setMonth(currentStartDate.getMonth() - monthsDuration);
            
            prevEndDate = new Date(currentStartDate);
            prevStartDate = new Date(prevEndDate);
            prevStartDate.setMonth(prevStartDate.getMonth() - monthsDuration);
        } else if (type === 'custom' && custom?.from && custom?.to) {
            currentStartDate = new Date(custom.from);
            currentEndDate = new Date(custom.to);
            const duration = currentEndDate.getTime() - currentStartDate.getTime();
            prevEndDate = new Date(currentStartDate.getTime() - 1);
            prevStartDate = new Date(prevEndDate.getTime() - duration);
        } else { // 'all' time
             const allTimeData = selectedKpi.series.map(d => d.value);
            return { displayValue: selectedKpi.value, changeText: selectedKpi.change, currentValue: getNumericValue(selectedKpi.value), previousValue: null, sparklineData: allTimeData, changePercent: null };
        }
        
        const calculateMetric = (start: Date, end: Date, getSeries: boolean = false) => {
            const series = selectedKpi.series || [];
            const filtered = series.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= start && itemDate <= end;
            });
            
            if (getSeries) return filtered.map(d => d.value);
            if (filtered.length === 0) return 0;
            
            switch (selectedKpi.aggregation) {
                case 'sum': return filtered.reduce((acc, curr) => acc + curr.value, 0);
                case 'avg': return filtered.reduce((acc, curr) => acc + curr.value, 0) / filtered.length;
                case 'end_value': return filtered[filtered.length - 1].value;
                default: return filtered[filtered.length - 1].value;
            }
        };

        const currentVal = calculateMetric(currentStartDate, currentEndDate) as number;
        const previousVal = calculateMetric(prevStartDate, prevEndDate) as number;
        const sparklinePoints = calculateMetric(currentStartDate, currentEndDate, true) as number[];

        let percent = 0;
        if (previousVal !== 0) {
            percent = ((currentVal - previousVal) / previousVal) * 100;
        } else if (currentVal > 0) {
            percent = Infinity;
        }

        const formattedValue = formatValue(currentVal, selectedKpi.format);
        let formattedChange: string;
        if (isFinite(percent)) {
            formattedChange = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}% vs previous period`;
        } else {
            formattedChange = 'vs ∞ previous period';
        }

        return { displayValue: formattedValue, changeText: formattedChange, currentValue: currentVal, previousValue: previousVal, sparklineData: sparklinePoints, changePercent: percent };

    }, [selectedKpi, activeTimeConfig]);

    if (!selectedKpi) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{title || 'Unconfigured KPI'}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onConfigure} aria-label="Configure widget"><SettingsIcon className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <button onClick={onConfigure} className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:border-violet-500 hover:text-violet-400 transition-colors">
                        <PlusCircleIcon className="h-8 w-8" />
                        <span className="mt-2 text-sm font-medium">Configure KPI</span>
                    </button>
                </CardContent>
            </Card>
        )
    }

    const Icon = iconMap[selectedKpi.metric] || TrendingUpIcon;
    const iconColor = iconColorMap[selectedKpi.metric] || 'text-violet-400';
    const isCompact = (instance.config.gridHeight || 2) <= 1;

    const renderContent = () => {
        const valueTextSize = isCompact ? 'text-3xl' : 'text-4xl';
        const iconSize = isCompact ? 'h-6 w-6' : 'h-8 w-8';
        
        switch(form) {
            case 'gauge':
                const target = selectedKpi.target || getNumericValue(selectedKpi.value) * 1.2;
                return <Gauge value={currentValue} max={target} label={displayValue} units={selectedKpi.format === 'percent' ? '%' : ''} />;
            case 'sparkline':
                const startValue = sparklineData.length > 0 ? sparklineData[0] : 0;
                const endValue = sparklineData.length > 0 ? sparklineData[sparklineData.length-1] : 0;
                return (
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between">
                            <span className={`${valueTextSize} font-bold text-white`}>{displayValue}</span>
                        </div>
                        <div className="relative h-14 -mx-2 -mb-2">
                           <div className="absolute inset-0 bg-gradient-to-t from-violet-500/0 via-violet-500/10 to-violet-500/0"></div>
                           {sparklineData.length > 1 && <Sparkline data={sparklineData} stroke={'#a78bfa'} />}
                        </div>
                        <div className="flex justify-between text-xs text-zinc-400">
                            <span>{formatValue(startValue, selectedKpi.format)}</span>
                             <span>{formatValue(endValue, selectedKpi.format)}</span>
                        </div>
                    </div>
                );
            case 'comparison':
                const isPositive = changePercent !== null && changePercent >= 0;
                const changeColor = changePercent === null ? 'text-zinc-400' : isPositive ? 'text-emerald-400' : 'text-red-400';
                return (
                    <div className="flex flex-col justify-center h-full">
                        <div className="flex items-baseline gap-3">
                            <span className={`${valueTextSize} font-bold text-white`}>{displayValue}</span>
                            {changePercent !== null && (
                                <div className={`flex items-center gap-1 font-bold ${isCompact ? 'text-lg' : 'text-xl'} ${changeColor}`}>
                                    {isPositive ? <ArrowUpIcon className="h-5 w-5"/> : <ArrowDownIcon className="h-5 w-5"/>}
                                    <span>{Math.abs(changePercent).toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 mt-2">vs {formatValue(previousValue || 0, selectedKpi.format)}</p>
                    </div>
                );
            case 'default':
            default:
                return (
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between">
                            <span className={`${valueTextSize} font-bold text-white tracking-tight`}>{displayValue}</span>
                            <Icon className={`${iconSize} ${iconColor}`} />
                        </div>
                        {changeText && <p className="text-sm text-zinc-500 mt-2">{changeText}</p>}
                    </div>
                );
        }
    }
    
    const styleClasses = {
        default: 'rounded-3xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-black/20',
        subtle: 'rounded-3xl border border-zinc-800 bg-zinc-900',
        highlighted: 'rounded-3xl border-2 border-violet-500/50 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-violet-500/10',
        transparent: 'bg-transparent'
    };

    return (
        <div className={`flex flex-col h-full ${styleClasses[style as keyof typeof styleClasses]}`}>
            <CardHeader className={`relative ${style === 'transparent' ? 'pt-0' : ''}`}>
                 <CardTitle className="pr-16">{title || selectedKpi.metric}</CardTitle>
                 <div className="absolute top-4 right-2 flex items-center gap-1">
                    {selectedKpi.series && selectedKpi.series.length > 0 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChart(selectedKpi)} aria-label="View chart">
                            <ChartBarIcon className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onConfigure} aria-label="Configure widget">
                        <SettingsIcon className="h-4 w-4" />
                    </Button>
                 </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center">
                {renderContent()}
            </CardContent>
        </div>
    )
};
