
import React, { useMemo, useRef } from 'react';
import type { GenericWidgetProps, SelectableKpi } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { PlusCircleIcon, TrendingUpIcon, ArrowUpIcon, ArrowDownIcon, ChartBarIcon, GaugeIcon, LineChartIcon, BarChartIcon } from '../Icons';
import { Button } from '../ui/Button';
import { fmtEuro } from '../../utils';
import { Gauge } from '../ui/Gauge';
import { Sparkline } from '../ui/Sparkline';
import useResizeObserver from '../../hooks/useResizeObserver';
import { WidgetHeader } from './ProductStockWidget';

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

const createAcronym = (text: string): string => {
  if (!text) return '';
  const words = text.replace(/[.,]/g, '').split(' ');
  return words.map(word => {
    if (word === '/') return '/';
    if (!word) return '';
    return word.charAt(0);
  }).join('').toUpperCase();
};

export const ConfigurableKpiWidget: React.FC<ConfigurableKpiWidgetProps> = ({ instance, onConfigure, allKpis, iconMap, iconColorMap, onConfigChange, globalTimeConfig, onOpenChart, onCite, isKpiSentimentColoringEnabled = true }) => {
    const { title, selectedKpiId, selectedKpiSource, timeConfig: localTimeConfig, isTimeLocked, style = 'default', form = 'default' } = instance.config;
    
    const widgetRef = useRef<HTMLDivElement>(null);
    const { width } = useResizeObserver(widgetRef);

    const activeTimeConfig = isTimeLocked 
        ? (localTimeConfig || { type: 'preset', preset: '3m', granularity: 'monthly', offset: 0 }) 
        : (globalTimeConfig || { type: 'preset', preset: '3m', granularity: 'monthly', offset: 0 });

    const selectedKpi = allKpis && allKpis.find(kpi => kpi.id === selectedKpiId && kpi.source === selectedKpiSource);

    const { displayValue, changeText, currentValue, previousValue, sparklineData, changePercent, sentiment } = useMemo(() => {
        if (!selectedKpi || !selectedKpi.series) {
            const current = getNumericValue(selectedKpi?.value || '');
            const isPositive = selectedKpi?.change?.includes('+');
            const isNegative = selectedKpi?.change?.includes('-');
            let calculatedSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
            if (isPositive) calculatedSentiment = selectedKpi.inverse ? 'negative' : 'positive';
            if (isNegative) calculatedSentiment = selectedKpi.inverse ? 'positive' : 'negative';

            return { displayValue: selectedKpi?.value || 'N/A', changeText: selectedKpi?.change || '', currentValue: current, previousValue: null, sparklineData: [], changePercent: null, sentiment: calculatedSentiment };
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
            return { displayValue: selectedKpi.value, changeText: selectedKpi.change, currentValue: getNumericValue(selectedKpi.value), previousValue: null, sparklineData: allTimeData, changePercent: null, sentiment: 'neutral' };
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

        let calculatedSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
        if (percent > 0.01) { // use a small threshold
            calculatedSentiment = selectedKpi.inverse ? 'negative' : 'positive';
        } else if (percent < -0.01) {
            calculatedSentiment = selectedKpi.inverse ? 'positive' : 'negative';
        }

        const formattedValue = formatValue(currentVal, selectedKpi.format);
        let formattedChange: string;
        if (isFinite(percent)) {
            formattedChange = `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}% vs previous period`;
        } else {
            formattedChange = 'vs ∞ previous period';
        }

        return { displayValue: formattedValue, changeText: formattedChange, currentValue: currentVal, previousValue: previousVal, sparklineData: sparklinePoints, changePercent: percent, sentiment: calculatedSentiment };

    }, [selectedKpi, activeTimeConfig]);

    if (!selectedKpi) {
        return (
            <Card>
                <CardHeader>
                    <WidgetHeader title={title || 'Unconfigured KPI'} onConfigure={onConfigure} />
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
    
    const getSizeConfig = (w: number) => {
        if (w < 120) { // Micro
            return { valueTextSize: 'text-xl', showChange: false, titleSize: 'text-xs' };
        }
        if (w < 200) { // Compact
            return { valueTextSize: 'text-2xl', showChange: true, titleSize: 'text-sm' };
        }
        // Normal
        return { valueTextSize: 'text-3xl', showChange: true, titleSize: 'text-base' };
    };
    const { valueTextSize, showChange } = getSizeConfig(width);

    const isOneByOne = (instance.config.gridWidth || 1) === 1 && (instance.config.gridHeight || 1) === 1;
    const fullTitle = title || selectedKpi.metric;
    const acronym = createAcronym(fullTitle);

    const renderContent = () => {
        const valueColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400' : 'text-white';
        const changeColor = isKpiSentimentColoringEnabled && sentiment === 'positive' ? 'text-emerald-400/80' : isKpiSentimentColoringEnabled && sentiment === 'negative' ? 'text-red-400/80' : 'text-zinc-500';
        
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
                            <span className={`${valueTextSize} font-bold ${valueColor}`}>{displayValue}</span>
                        </div>
                        <div className="relative h-14 -mx-2 -mb-2">
                           <div className="absolute inset-0 bg-gradient-to-t from-violet-500/0 via-violet-500/10 to-violet-500/0"></div>
                           {sparklineData.length > 1 && <Sparkline data={sparklineData} stroke={'#a78bfa'} />}
                        </div>
                        {width > 120 && (
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>{formatValue(startValue, selectedKpi.format)}</span>
                                 <span>{formatValue(endValue, selectedKpi.format)}</span>
                            </div>
                        )}
                    </div>
                );
            case 'comparison':
                const isPositive = sentiment === 'positive';
                const comparisonChangeColor = isKpiSentimentColoringEnabled && sentiment === 'neutral' ? 'text-zinc-400' : isKpiSentimentColoringEnabled && isPositive ? 'text-emerald-400' : isKpiSentimentColoringEnabled && !isPositive ? 'text-red-400' : 'text-zinc-400';
                return (
                    <div className="flex flex-col justify-center h-full">
                        <div className="flex items-baseline gap-3">
                            <span className={`${valueTextSize} font-bold ${valueColor}`}>{displayValue}</span>
                            {changePercent !== null && width > 120 && (
                                <div className={`flex items-center gap-1 font-bold text-xl ${comparisonChangeColor}`}>
                                    {isPositive ? <ArrowUpIcon className="h-5 w-5"/> : <ArrowDownIcon className="h-5 w-5"/>}
                                    <span>{Math.abs(changePercent).toFixed(1)}%</span>
                                </div>
                            )}
                        </div>
                        {width > 150 && <p className="text-sm text-zinc-500 mt-2">vs {formatValue(previousValue || 0, selectedKpi.format)}</p>}
                    </div>
                );
            case 'default':
            default:
                return (
                    <div className="mt-auto">
                        <div className="flex items-end justify-between">
                            <span className={`${valueTextSize} font-bold tracking-tight ${valueColor}`}>{displayValue}</span>
                            {!isOneByOne && <Icon className={`h-6 w-6 ${iconColor}`} />}
                        </div>
                        {changeText && showChange && <p className={`text-xs mt-1 ${changeColor} truncate`}>{changeText}</p>}
                    </div>
                );
        }
    }
    
    const styleClasses = {
        default: '',
        subtle: 'border-zinc-800 bg-zinc-900',
        highlighted: 'border-2 border-violet-500/50 shadow-violet-500/10',
        transparent: 'bg-transparent border-none shadow-none backdrop-blur-none'
    };
    
    // The base card styles are now in the Card component. The style config will append/override.
    return (
        <Card ref={widgetRef} className={`h-full flex flex-col ${styleClasses[style as keyof typeof styleClasses]}`}>
            <CardHeader>
                <WidgetHeader
                    title={isOneByOne ? acronym : fullTitle}
                    subtitle={isOneByOne ? fullTitle : undefined}
                    onConfigure={onConfigure}
                    onCite={onCite}
                >
                    {selectedKpi.series && selectedKpi.series.length > 0 && (
                        <Button variant="secondary" size="icon" className="h-6 w-6 rounded-full" onClick={() => onOpenChart(selectedKpi)} aria-label="View chart">
                            <ChartBarIcon className="h-3 w-3" />
                        </Button>
                    )}
                </WidgetHeader>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                 {renderContent()}
            </CardContent>
        </Card>
    )
};