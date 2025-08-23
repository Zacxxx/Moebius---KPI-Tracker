
import React, { useMemo } from 'react';
import { Label } from '../ui/Label';
import type { SelectableKpi, WidgetInstance, TimeConfig } from '../../types';
import { TimeConfigForm } from './TimeConfigForm';
import { Checkbox } from '../ui/Checkbox';
import { TrendingUpIcon, GaugeIcon, LineChartIcon, BarChartIcon, ArrowUpIcon } from '../Icons';
import { FloatingLabelInput } from '../ui/FloatingLabelInput';

interface KpiWidgetConfigFormProps {
    config: WidgetInstance['config'];
    onConfigChange: (newConfig: Partial<WidgetInstance['config']>) => void;
    allKpis: SelectableKpi[];
}

const styles = [
    { id: 'default', name: 'Default' },
    { id: 'subtle', name: 'Subtle' },
    { id: 'highlighted', name: 'Highlighted' },
    { id: 'transparent', name: 'Transparent' },
];

const forms = [
    { id: 'default', name: 'Default', icon: BarChartIcon },
    { id: 'gauge', name: 'Gauge', icon: GaugeIcon },
    { id: 'sparkline', name: 'Sparkline', icon: LineChartIcon },
    { id: 'comparison', name: 'Comparison', icon: TrendingUpIcon },
];

const StylePreview: React.FC<{ styleId: string; active: boolean; onClick: () => void; }> = ({ styleId, active, onClick }) => {
    const styleClasses = {
        default: 'bg-zinc-900/50 border-zinc-700/50',
        subtle: 'bg-zinc-900 border-zinc-800',
        highlighted: 'bg-zinc-900/50 border-violet-500/50',
        transparent: 'bg-transparent border-zinc-700/50',
    };
    const activeClasses = active ? '!border-violet-500 ring-2 ring-violet-500' : 'border-transparent';

    return (
        <button onClick={onClick} className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${styleClasses[styleId as keyof typeof styleClasses]} ${activeClasses}`}>
            <div className="flex justify-between items-center mb-2">
                <div className="w-1/2 h-2 bg-zinc-600 rounded-sm"></div>
                <div className="w-4 h-4 bg-zinc-600 rounded-full"></div>
            </div>
            <div className="w-3/4 h-4 bg-zinc-400 rounded-sm"></div>
            <div className="w-1/2 h-2 bg-zinc-700 rounded-sm mt-1"></div>
        </button>
    )
}

const FormPreview: React.FC<{ formId: string; active: boolean; onClick: () => void; }> = ({ formId, active, onClick }) => {
    const activeClasses = active ? 'border-violet-500 bg-zinc-800' : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500';

    const renderPreviewContent = () => {
        switch (formId) {
            case 'default':
                return (
                    <div className="w-full h-full flex flex-col justify-between p-1">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] text-zinc-400">KPI Title</p>
                            <BarChartIcon className="h-3 w-3 text-zinc-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold text-white">1,234</p>
                            <p className="text-[10px] text-zinc-500">+10%</p>
                        </div>
                    </div>
                );
            case 'gauge':
                return (
                     <div className="w-full h-full flex flex-col items-center justify-center p-1">
                        <GaugeIcon className="h-5 w-5 text-zinc-400 mb-1" />
                        <p className="text-xs font-medium text-white">Gauge</p>
                    </div>
                );
            case 'sparkline':
                 return (
                    <div className="w-full h-full flex flex-col justify-between p-1">
                         <div>
                            <p className="text-[10px] text-zinc-400">KPI Title</p>
                            <p className="text-lg font-bold text-white">1,234</p>
                        </div>
                        <LineChartIcon className="h-5 w-3 text-zinc-500 self-start" />
                    </div>
                );
            case 'comparison':
                return (
                    <div className="w-full h-full flex flex-col justify-center p-1">
                        <div className="flex items-baseline gap-1">
                            <p className="text-lg font-bold text-white">1,234</p>
                             <div className="flex items-center text-emerald-400">
                                <ArrowUpIcon className="h-2.5 w-2.5" />
                                <span className="text-xs font-bold">10%</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">vs 1,122</p>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <button onClick={onClick} className={`p-2 rounded-lg border cursor-pointer transition-all h-24 ${activeClasses}`}>
            {renderPreviewContent()}
        </button>
    )
}

export const KpiWidgetConfigForm: React.FC<KpiWidgetConfigFormProps> = ({ config, onConfigChange, allKpis }) => {
    const selectedKpiKey = config.selectedKpiId && config.selectedKpiSource ? `${config.selectedKpiSource}::${config.selectedKpiId}` : '';
    const timeConfig = config.timeConfig || { type: 'preset', preset: '3m', granularity: 'monthly', offset: 0 };
    const isTimeLocked = config.isTimeLocked || false;
    
    const selectedKpi = allKpis.find(kpi => kpi.id === config.selectedKpiId && kpi.source === config.selectedKpiSource);
    const kpiHasTimeSeries = !!selectedKpi?.series;

    const groupedKpis = useMemo(() => {
        return allKpis.reduce<Record<string, SelectableKpi[]>>((acc, kpi) => {
            (acc[kpi.source] = acc[kpi.source] || []).push(kpi);
            return acc;
        }, {});
    }, [allKpis]);

    const handleKpiChange = (key: string) => {
        const [source, idStr] = key.split('::');
        const id = Number(idStr);
        onConfigChange({ selectedKpiId: id, selectedKpiSource: source });
    };
    
    const handleTimeConfigChange = (newTimeConfig: Partial<TimeConfig>) => {
        onConfigChange({ timeConfig: { ...timeConfig, ...newTimeConfig } });
    };

    return (
        <div className="space-y-4">
            <FloatingLabelInput
                id="widget-title"
                label="Widget Title"
                value={config.title}
                onChange={e => onConfigChange({ title: e.target.value })}
                placeholder="Leave blank for default KPI name"
            />
            <div className="space-y-2">
                <Label htmlFor="kpi-select">Select KPI Metric</Label>
                <select
                    id="kpi-select"
                    value={selectedKpiKey}
                    onChange={e => handleKpiChange(e.target.value)}
                    className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                    <option value="">-- Select a KPI --</option>
                    {Object.entries(groupedKpis).map(([source, kpis]) => (
                        <optgroup label={source} key={source}>
                            {kpis.map(kpi => (
                                <option key={`${source}::${kpi.id}`} value={`${source}::${kpi.id}`}>
                                    {kpi.metric}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label>Style</Label>
                <div className="grid grid-cols-4 gap-2">
                    {styles.map(style => (
                        <StylePreview
                            key={style.id}
                            styleId={style.id}
                            active={(config.style || 'default') === style.id}
                            onClick={() => onConfigChange({ style: style.id })}
                        />
                    ))}
                </div>
            </div>
            
            <div className="space-y-2">
                <Label>Form</Label>
                <div className="grid grid-cols-4 gap-2">
                    {forms.map(form => (
                        <FormPreview
                            key={form.id}
                            formId={form.id}
                            active={(config.form || 'default') === form.id}
                            onClick={() => onConfigChange({ form: form.id })}
                        />
                    ))}
                </div>
            </div>

             {kpiHasTimeSeries && (
                <div className="pt-4 border-t border-zinc-700/50">
                    <Checkbox
                        id="time-lock-checkbox"
                        label="Lock time range for this widget"
                        checked={isTimeLocked}
                        onChange={(checked) => onConfigChange({ isTimeLocked: checked })}
                    />
                    <p className="text-xs text-zinc-500 mt-1 pl-8">When unlocked, this widget will use the global dashboard time range.</p>
                </div>
            )}
            {isTimeLocked && kpiHasTimeSeries && (
                <TimeConfigForm
                    timeConfig={timeConfig}
                    onTimeConfigChange={handleTimeConfigChange}
                    showGranularity={false}
                />
            )}
        </div>
    );
};
