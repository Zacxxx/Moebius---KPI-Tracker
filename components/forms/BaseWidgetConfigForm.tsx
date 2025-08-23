import React from 'react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import type { BaseWidgetConfigFormProps, GenericWidgetType, TimeConfig } from '../../types';
import { ALL_DATA_SOURCES } from '../../data-widgets';
import { TimeConfigForm } from './TimeConfigForm';
import { Checkbox } from '../ui/Checkbox';

const groupedDataSources = Object.entries(ALL_DATA_SOURCES).reduce((acc, [key, value]) => {
    (acc[value.section] = acc[value.section] || []).push({ key, name: value.name });
    return acc;
}, {} as Record<string, {key: string; name: string}[]>);

const noDataSourceWidgets: GenericWidgetType[] = ['PROJECTION_GRAPHIC', 'STATIC_QUICK_ACTIONS', 'KPI_VIEW'];
const TIME_SENSITIVE_WIDGETS: GenericWidgetType[] = ['TREND_GRAPHIC'];

export const BaseWidgetConfigForm: React.FC<BaseWidgetConfigFormProps> = ({ config, onConfigChange, widgetType }) => {
    const isTimeSensitive = TIME_SENSITIVE_WIDGETS.includes(widgetType);
    const isTimeLocked = config.isTimeLocked || false;
    const timeConfig = config.timeConfig || { type: 'preset', preset: '1y', granularity: 'monthly' };

    const handleTimeConfigChange = (newTimeConfig: Partial<TimeConfig>) => {
        onConfigChange({ timeConfig: { ...timeConfig, ...newTimeConfig } });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="widget-title">Widget Title</Label>
                <Input
                    id="widget-title"
                    value={config.title}
                    onChange={e => onConfigChange({ title: e.target.value })}
                    placeholder="Enter widget title"
                />
            </div>
            { !noDataSourceWidgets.includes(widgetType) && (
                <div className="space-y-2">
                    <Label htmlFor="data-source-select">Data Source</Label>
                    <select
                        id="data-source-select"
                        value={config.dataSourceKey || ''}
                        onChange={e => onConfigChange({ dataSourceKey: e.target.value as any })}
                        className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                        <option value="">-- Select a Data Source --</option>
                        {Object.entries(groupedDataSources).map(([section, sources]) => (
                            <optgroup label={section} key={section}>
                                {sources.map(source => (
                                    <option key={source.key} value={source.key}>{source.name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            )}
             {isTimeSensitive && (
                <>
                    <div className="pt-4 border-t border-zinc-700/50">
                        <Checkbox
                            id="base-time-lock-checkbox"
                            label="Lock time range for this widget"
                            checked={isTimeLocked}
                            onChange={(checked) => onConfigChange({ isTimeLocked: checked })}
                        />
                         <p className="text-xs text-zinc-500 mt-1 pl-8">When unlocked, this widget will use the global dashboard time range.</p>
                    </div>
                    {isTimeLocked && (
                        <TimeConfigForm
                            timeConfig={timeConfig}
                            onTimeConfigChange={handleTimeConfigChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};