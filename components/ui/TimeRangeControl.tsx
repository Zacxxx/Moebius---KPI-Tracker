import React from 'react';
import type { TimeConfig } from '../../types';
import { Button } from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

interface TimeRangeControlProps {
    timeConfig: TimeConfig;
    setTimeConfig: (config: TimeConfig) => void;
}

const presetOptions: NonNullable<TimeConfig['preset']>[] = ['3m', '6m', '1y', 'all'];

export const TimeRangeControl: React.FC<TimeRangeControlProps> = ({ timeConfig, setTimeConfig }) => {
    const handlePresetChange = (preset: NonNullable<TimeConfig['preset']>) => {
        setTimeConfig({ ...timeConfig, type: 'preset', preset, offset: 0 });
    };

    const handleNavigate = (direction: 'back' | 'forward') => {
        if (timeConfig.type !== 'preset' || timeConfig.preset === 'all') return;
        const currentOffset = timeConfig.offset || 0;
        const newOffset = direction === 'back' ? currentOffset + 1 : Math.max(0, currentOffset - 1);
        setTimeConfig({ ...timeConfig, offset: newOffset });
    };
    
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-800/50 rounded-lg p-1">
                {presetOptions.map(preset => (
                    <Button
                        key={preset}
                        variant={timeConfig.type === 'preset' && timeConfig.preset === preset ? 'secondary' : 'ghost'}
                        onClick={() => handlePresetChange(preset)}
                        className="h-8 px-3 text-xs"
                    >
                        {preset.toUpperCase()}
                    </Button>
                ))}
            </div>
             <div className="flex items-center">
                <Button variant="secondary" size="icon" className="h-9 w-9 rounded-r-none" onClick={() => handleNavigate('back')} disabled={timeConfig.preset === 'all'}>
                    <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                <Button variant="secondary" size="icon" className="h-9 w-9 rounded-l-none" onClick={() => handleNavigate('forward')} disabled={timeConfig.preset === 'all' || (timeConfig.offset || 0) === 0}>
                    <ChevronRightIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
