import React from 'react';
import { Label } from './ui/Label';
import { Slider } from './ui/Slider';
import { ALL_DATA_SOURCES } from '../data';
import { DataSourceKey } from '../types';
import { CheckIcon, ChevronDownIcon } from './Icons';

// A simple Select dropdown
const Select: React.FC<{ label: string; value: string; onChange: (value: string) => void; children: React.ReactNode; }> = ({ label, value, onChange, children }) => (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
            {children}
        </select>
    </div>
);

// A simple MultiSelect for data sources
const MultiSelect: React.FC<{
    label: string;
    options: { key: string; name: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const handleSelect = (key: string) => {
        if (selected.includes(key)) {
            onChange(selected.filter(item => item !== key));
        } else {
            onChange([...selected, key]);
        }
    };

    return (
        <div className="space-y-1.5" ref={dropdownRef}>
            <Label>{label}</Label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 text-left flex items-center justify-between"
                >
                    <span className="truncate">{selected.length > 0 ? `${selected.length} source(s) selected` : 'All Sources'}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 p-2 max-h-60 overflow-y-auto">
                        {options.map(option => (
                            <button
                                key={option.key}
                                onClick={() => handleSelect(option.key)}
                                className="w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md text-zinc-200 hover:bg-zinc-700"
                            >
                                <span>{option.name}</span>
                                {selected.includes(option.key) && <CheckIcon className="h-4 w-4 text-violet-400" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export interface GenerationSettings {
    mode: 'automatic' | 'guided' | 'calculation-only';
    complexity: 'simple' | 'standard' | 'complex';
    dataSourcePreference: DataSourceKey[];
    maxMetrics: number;
    metricFormat: 'any' | 'currency' | 'percent' | 'number';
    dataStrategy: 'available_only' | 'prompt_for_missing';
}

interface GenerationSettingsPanelProps {
    settings: GenerationSettings;
    onSettingsChange: (newSettings: Partial<GenerationSettings>) => void;
}

export const GenerationSettingsPanel: React.FC<GenerationSettingsPanelProps> = ({ settings, onSettingsChange }) => {
    const dataSourceOptions = Object.entries(ALL_DATA_SOURCES).map(([key, value]) => ({ key, name: value.name }));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Select
                label="Generation Mode"
                value={settings.mode}
                onChange={value => onSettingsChange({ mode: value as GenerationSettings['mode'] })}
            >
                <option value="guided">Guided</option>
                <option value="automatic">Automatic</option>
                <option value="calculation-only">Calculation Only</option>
            </Select>
            <Select
                label="Complexity Level"
                value={settings.complexity}
                onChange={value => onSettingsChange({ complexity: value as GenerationSettings['complexity'] })}
            >
                <option value="simple">Simple</option>
                <option value="standard">Standard</option>
                <option value="complex">Complex</option>
            </Select>
            <Select
                label="Data Strategy"
                value={settings.dataStrategy}
                onChange={value => onSettingsChange({ dataStrategy: value as GenerationSettings['dataStrategy'] })}
            >
                <option value="prompt_for_missing">Prompt for Missing Data</option>
                <option value="available_only">Use Available Data Only</option>
            </Select>
            <Select
                label="Metric Format Preference"
                value={settings.metricFormat}
                onChange={value => onSettingsChange({ metricFormat: value as GenerationSettings['metricFormat'] })}
            >
                <option value="any">Any</option>
                <option value="currency">Currency</option>
                <option value="percent">Percent</option>
                <option value="number">Number</option>
            </Select>
            <div className="sm:col-span-2">
                 <MultiSelect
                    label="Data Source Preference"
                    options={dataSourceOptions}
                    selected={settings.dataSourcePreference}
                    onChange={value => onSettingsChange({ dataSourcePreference: value as GenerationSettings['dataSourcePreference'] })}
                />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
                <div className="flex justify-between items-center">
                    <Label>Max Number of Metrics</Label>
                    <span className="text-sm font-medium text-zinc-100">{settings.maxMetrics}</span>
                </div>
                <Slider
                    value={[settings.maxMetrics]}
                    onValueChange={([v]) => onSettingsChange({ maxMetrics: v })}
                    min={1}
                    max={8}
                    step={1}
                />
            </div>
        </div>
    );
};