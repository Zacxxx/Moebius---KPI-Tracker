import React, { useState, useMemo } from 'react';
import type { SelectableKpi, TimeConfig } from '../types';
import { Modal } from './ui/Modal';
import { TimeRangeControl } from './ui/TimeRangeControl';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PALETTE } from '../constants';
import { fmtEuro } from '../utils';

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

interface KpiChartModalProps {
    kpi: SelectableKpi;
    onClose: () => void;
    globalTimeConfig: TimeConfig;
}

export const KpiChartModal: React.FC<KpiChartModalProps> = ({ kpi, onClose, globalTimeConfig }) => {
    const [modalTimeConfig, setModalTimeConfig] = useState<TimeConfig>(globalTimeConfig);

    const processedData = useMemo(() => {
        if (!kpi.series || kpi.series.length === 0) return [];
        
        const now = new Date();
        const { type, preset, custom, granularity, offset = 0 } = modalTimeConfig;

        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (type === 'preset' && preset !== 'all') {
            let monthsDuration = 12;
            if (preset === '3m') monthsDuration = 3;
            if (preset === '6m') monthsDuration = 6;
            
            endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() - (offset * monthsDuration));
            startDate = new Date(endDate);
            startDate.setMonth(startDate.getMonth() - monthsDuration);
        } else if (type === 'custom' && custom?.from && custom?.to) {
            startDate = new Date(custom.from);
            endDate = new Date(custom.to);
            endDate.setHours(23, 59, 59, 999);
        }
        
        const filtered = startDate && endDate 
            ? kpi.series.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate! && itemDate <= endDate!;
            })
            : kpi.series;
        
        const aggregated = new Map<string, { value: number, count: number, date: string }>();
        const getGroupKey = (date: Date): string => {
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            switch (granularity) {
                case 'daily': return date.toISOString().split('T')[0];
                case 'weekly':
                    const weekStart = new Date(date);
                    weekStart.setUTCDate(date.getUTCDate() - date.getUTCDay());
                    return weekStart.toISOString().split('T')[0];
                case 'monthly': return `${year}-${String(month + 1).padStart(2, '0')}`;
                case 'yearly': return `${year}`;
                default: return date.toISOString().split('T')[0];
            }
        };

        for (const item of filtered) {
            const date = new Date(item.date);
            const key = getGroupKey(date);
            if (!aggregated.has(key)) {
                aggregated.set(key, { value: 0, count: 0, date: item.date });
            }
            const current = aggregated.get(key)!;
            current.value += item.value;
            current.count++;
            aggregated.set(key, current);
        }

        const result = Array.from(aggregated.entries()).map(([, value]) => {
            let finalValue = value.value;
            if(kpi.aggregation === 'avg') finalValue = value.value / value.count;
            // For end_value, this aggregation is a simplification. A proper implementation
            // would need to ensure the last item in the period is taken. For now, sum is used.
            return { date: value.date, value: finalValue };
        });
        
        return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [kpi.series, modalTimeConfig, kpi.aggregation]);

    return (
        <Modal title={kpi.metric} onClose={onClose}>
            <div className="space-y-4">
                <TimeRangeControl timeConfig={modalTimeConfig} setTimeConfig={setModalTimeConfig} />
                <div className="h-[400px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="modalChartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PALETTE.super.base} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor={PALETTE.super.base} stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                            <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickFormatter={(val) => formatDate(val, modalTimeConfig.granularity)} />
                            <YAxis tickFormatter={(val) => formatValue(val, kpi.format)} stroke="#71717a" fontSize={12} />
                            <Tooltip
                              cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }}
                              content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                      return (
                                          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-lg p-3 shadow-2xl text-zinc-200">
                                              <p className="text-xs font-bold mb-1">{formatDate(String(label), modalTimeConfig.granularity)}</p>
                                              <p className="text-sm font-medium text-white">{`Value: ${formatValue(payload[0].value as number, kpi.format)}`}</p>
                                          </div>
                                      );
                                  }
                                  return null;
                              }}
                            />
                            <Area type="monotone" dataKey="value" stroke={PALETTE.super.stroke} fill="url(#modalChartGradient)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Modal>
    );
};
