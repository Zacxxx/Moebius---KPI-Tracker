import React from 'react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import type { TimeConfig } from '../../types';

const presetOptions: NonNullable<TimeConfig['preset']>[] = ['3m', '6m', '1y', 'all'];
const granularityOptions: NonNullable<TimeConfig['granularity']>[] = ['daily', 'weekly', 'monthly', 'yearly'];

const SegmentedControlButton: React.FC<{ children: React.ReactNode, active: boolean, onClick: () => void }> = ({ children, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex-1
      ${active ? 'bg-violet-600 text-white' : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700'}
    `}
  >
    {children}
  </button>
);

interface TimeConfigFormProps {
    timeConfig: TimeConfig;
    onTimeConfigChange: (newConfig: Partial<TimeConfig>) => void;
    showGranularity?: boolean;
}

export const TimeConfigForm: React.FC<TimeConfigFormProps> = ({ timeConfig, onTimeConfigChange, showGranularity = true }) => {
    return (
        <div className="space-y-4 pt-4 border-t border-zinc-700/50">
            <h4 className="text-sm font-semibold text-zinc-200">Time Configuration</h4>
            <div className="space-y-2">
                <Label>Range Type</Label>
                <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg">
                    <SegmentedControlButton active={timeConfig.type === 'preset'} onClick={() => onTimeConfigChange({ type: 'preset' })}>Preset</SegmentedControlButton>
                    <SegmentedControlButton active={timeConfig.type === 'custom'} onClick={() => onTimeConfigChange({ type: 'custom' })}>Custom</SegmentedControlButton>
                </div>
            </div>

            {timeConfig.type === 'preset' ? (
                <div className="space-y-2">
                    <Label>Preset Range</Label>
                    <div className="flex gap-2">
                        {presetOptions.map(preset => (
                            <SegmentedControlButton key={preset} active={timeConfig.preset === preset} onClick={() => onTimeConfigChange({ preset })}>
                                {preset.toUpperCase()}
                            </SegmentedControlButton>
                        ))}
                    </div>
                </div>
            ) : (
                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="from-date">From</Label>
                        <Input id="from-date" type="date" value={timeConfig.custom?.from || ''} onChange={e => onTimeConfigChange({ custom: { ...timeConfig.custom, from: e.target.value, to: timeConfig.custom?.to || '' } })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="to-date">To</Label>
                        <Input id="to-date" type="date" value={timeConfig.custom?.to || ''} onChange={e => onTimeConfigChange({ custom: { ...timeConfig.custom, to: e.target.value, from: timeConfig.custom?.from || '' } })} />
                    </div>
                    </div>
            )}
            
            {showGranularity && (
                <div className="space-y-2">
                    <Label>Granularity</Label>
                        <div className="flex gap-2">
                        {granularityOptions.map(granularity => (
                            <SegmentedControlButton key={granularity} active={timeConfig.granularity === granularity} onClick={() => onTimeConfigChange({ granularity })}>
                                {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
                            </SegmentedControlButton>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};