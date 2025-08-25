import React, { useState, useRef, useEffect, useLayoutEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import type { TimeConfig } from '../../types';
import { Button } from './Button';
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, ChevronDownIcon } from '../Icons';
import { Card } from './Card';
import { Label } from './Label';
import { Input } from './Input';

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

const TimeManagerPanel = forwardRef<HTMLDivElement, {
    timeConfig: TimeConfig;
    setTimeConfig: (config: Partial<TimeConfig>) => void;
    position: { top: number, left: number };
}>(({ timeConfig, setTimeConfig, position }, ref) => {
    const [activeTab, setActiveTab] = useState<'preset' | 'custom'>(timeConfig.type);

    const handleTabChange = (tab: 'preset' | 'custom') => {
        setActiveTab(tab);
        setTimeConfig({ type: tab });
    };

    const handleNavigate = (direction: 'back' | 'forward') => {
        if (timeConfig.type !== 'preset' || timeConfig.preset === 'all') return;
        const currentOffset = timeConfig.offset || 0;
        const newOffset = direction === 'back' ? currentOffset + 1 : Math.max(0, currentOffset - 1);
        setTimeConfig({ offset: newOffset });
    };

    const panelContent = (
        <div
            ref={ref}
            style={{ position: 'fixed', top: `${position.top}px`, left: `${position.left}px` }}
            className="z-50 animate-fade-in-fast"
        >
            <Card className="w-80 shadow-2xl">
                <div className="p-4 space-y-4">
                    <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg">
                        <SegmentedControlButton active={activeTab === 'preset'} onClick={() => handleTabChange('preset')}>Preset</SegmentedControlButton>
                        <SegmentedControlButton active={activeTab === 'custom'} onClick={() => handleTabChange('custom')}>Custom</SegmentedControlButton>
                    </div>
                    {activeTab === 'preset' ? (
                        <div className="space-y-4">
                             <div className="flex gap-2">
                                {presetOptions.map(preset => (
                                    <SegmentedControlButton key={preset} active={timeConfig.preset === preset} onClick={() => setTimeConfig({ preset, offset: 0 })}>
                                        {preset.toUpperCase()}
                                    </SegmentedControlButton>
                                ))}
                            </div>
                            <div className="flex items-center justify-center">
                                <Button variant="secondary" size="icon" className="h-9 w-9 rounded-r-none" onClick={() => handleNavigate('back')} disabled={timeConfig.preset === 'all'}>
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </Button>
                                <div className="px-4 text-xs text-center text-zinc-400 border-y border-zinc-700 h-9 flex items-center">Current Period</div>
                                <Button variant="secondary" size="icon" className="h-9 w-9 rounded-l-none" onClick={() => handleNavigate('forward')} disabled={timeConfig.preset === 'all' || (timeConfig.offset || 0) === 0}>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from-date">From</Label>
                                <Input id="from-date" type="date" value={timeConfig.custom?.from || ''} onChange={e => setTimeConfig({ custom: { ...timeConfig.custom, from: e.target.value, to: timeConfig.custom?.to || '' } })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="to-date">To</Label>
                                <Input id="to-date" type="date" value={timeConfig.custom?.to || ''} onChange={e => setTimeConfig({ custom: { ...timeConfig.custom, to: e.target.value, from: timeConfig.custom?.from || '' } })} />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2 pt-2 border-t border-zinc-700/50">
                        <Label>Granularity</Label>
                        <div className="flex gap-2">
                            {granularityOptions.map(granularity => (
                                <SegmentedControlButton key={granularity} active={timeConfig.granularity === granularity} onClick={() => setTimeConfig({ granularity })}>
                                    {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
                                </SegmentedControlButton>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
    
    return createPortal(panelContent, document.body);
});
TimeManagerPanel.displayName = 'TimeManagerPanel';

interface TimeRangeControlProps {
    timeConfig: TimeConfig;
    setTimeConfig: (config: TimeConfig) => void;
}

export const TimeRangeControl: React.FC<TimeRangeControlProps> = ({ timeConfig, setTimeConfig }) => {
    const [isOpen, setIsOpen] = useState(false);
    const controlRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useLayoutEffect(() => {
        if (isOpen && controlRef.current) {
            const rect = controlRef.current.getBoundingClientRect();
            const panelWidth = 320; // Corresponds to w-80
            
            let top = rect.bottom + 8; // 8px gap below the button
            let left = rect.left;

            // Adjust if it would overflow the right edge of the viewport
            if (left + panelWidth > window.innerWidth - 8) { // 8px padding from edge
                left = rect.right - panelWidth;
            }
            
            // Adjust to prevent going off the left edge of the screen
            if (left < 8) {
                left = 8;
            }

            // If it would overflow below the viewport and there's space above, flip it
            const panelHeight = 350; // Estimated height
            if (top + panelHeight > window.innerHeight && rect.top > panelHeight + 8) { 
                top = rect.top - panelHeight - 8;
            }
            
            setPosition({ top, left });
        }
    }, [isOpen]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                controlRef.current && !controlRef.current.contains(event.target as Node) &&
                panelRef.current && !panelRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const getTimeRangeLabel = () => {
        if (timeConfig.type === 'custom') {
            if (timeConfig.custom?.from && timeConfig.custom?.to) {
                const from = new Date(timeConfig.custom.from);
                from.setMinutes(from.getMinutes() + from.getTimezoneOffset());
                const to = new Date(timeConfig.custom.to);
                to.setMinutes(to.getMinutes() + to.getTimezoneOffset());
                
                const fromStr = from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const toStr = to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return `${fromStr} - ${toStr}`;
            }
            return 'Custom Range';
        }
        const offset = timeConfig.offset || 0;
        const presetLabel = `Last ${timeConfig.preset?.replace('m', ' Mos').replace('y', ' Yr')}`;
        if(timeConfig.preset === 'all') return 'All Time';
        if (offset === 0) return presetLabel;
        return `${presetLabel} (${offset} ago)`;
    };
    
    return (
        <div ref={controlRef}>
            <Button variant="secondary" className="h-8 px-2 text-xs" onClick={() => setIsOpen(prev => !prev)}>
                <ClockIcon className="h-4 w-4 mr-2" />
                <span className="w-24 text-left">{getTimeRangeLabel()}</span>
                <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isOpen && (
                <TimeManagerPanel
                    ref={panelRef}
                    timeConfig={timeConfig}
                    setTimeConfig={(newConfig) => setTimeConfig({ ...timeConfig, ...newConfig })}
                    position={position}
                />
            )}
        </div>
    );
};