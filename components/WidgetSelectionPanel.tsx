import React from 'react';
import type { Widget, WidgetType } from '../types';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { XIcon } from './Icons';
import { Checkbox } from './ui/Checkbox';

interface WidgetSelectionPanelProps {
    isOpen: boolean;
    onClose: () => void;
    availableWidgets: Widget[];
    visibleWidgetIds: WidgetType[];
    setVisibleWidgetIds: (ids: WidgetType[]) => void;
}

export const WidgetSelectionPanel: React.FC<WidgetSelectionPanelProps> = ({ isOpen, onClose, availableWidgets, visibleWidgetIds, setVisibleWidgetIds }) => {
    
    const handleWidgetToggle = (widgetId: WidgetType) => {
        const isVisible = visibleWidgetIds.includes(widgetId);
        if (isVisible) {
            setVisibleWidgetIds(visibleWidgetIds.filter(id => id !== widgetId));
        } else {
            setVisibleWidgetIds([...visibleWidgetIds, widgetId]);
        }
    };

    if (!isOpen) return null;
    
    return (
         <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
            <div 
                className="fixed top-0 right-0 h-full w-[350px] max-w-full bg-zinc-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
                onClick={e => e.stopPropagation()}
            >
                <Card className="h-full flex flex-col rounded-none border-y-0 border-r-0 border-l border-zinc-700/50 bg-transparent backdrop-blur-none shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Edit Dashboard Widgets</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}><XIcon className="h-5 w-5"/></Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                        {availableWidgets.map(widget => (
                            <div key={widget.id} className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <Checkbox
                                    id={`widget-toggle-${widget.id}`}
                                    label={widget.title}
                                    checked={visibleWidgetIds.includes(widget.id)}
                                    onChange={() => handleWidgetToggle(widget.id)}
                                />
                                <p className="text-xs text-zinc-400 mt-2 pl-8">{widget.description}</p>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-4 border-t border-zinc-700/50">
                        <Button onClick={onClose} className="w-full">Done</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
