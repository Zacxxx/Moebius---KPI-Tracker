import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import type { WidgetInstance } from '../types';
import { Trash2Icon } from './Icons';

interface WidgetConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newInstance: WidgetInstance) => void;
    onDelete: (widgetId: string) => void;
    widgetInstance: WidgetInstance;
    children: (props: { config: WidgetInstance['config'], onConfigChange: (newConfig: Partial<WidgetInstance['config']>) => void }) => React.ReactNode;
}

export const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({ isOpen, onClose, onSave, onDelete, widgetInstance, children }) => {
    const [currentInstance, setCurrentInstance] = useState<WidgetInstance>(widgetInstance);

    useEffect(() => {
        setCurrentInstance(widgetInstance);
    }, [widgetInstance]);

    const handleConfigChange = (newConfig: Partial<WidgetInstance['config']>) => {
        setCurrentInstance(prev => ({ ...prev, config: { ...prev.config, ...newConfig } }));
    };

    const handleSave = () => {
        onSave(currentInstance);
    };

    const handleDelete = () => {
        onDelete(currentInstance.id);
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <Modal title={`Configure: ${widgetInstance.config.title || 'Widget'}`} onClose={onClose}>
            <div className="space-y-6">
                {children({ config: currentInstance.config, onConfigChange: handleConfigChange })}

                 <div className="space-y-4 pt-4 border-t border-zinc-700/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="widget-width">Widget Width</Label>
                            <select
                                id="widget-width"
                                value={currentInstance.config.gridWidth || 1}
                                onChange={e => handleConfigChange({ gridWidth: parseInt(e.target.value) })}
                                className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                            >
                                {[1, 2, 3, 4].map(span => (
                                    <option key={span} value={span}>{span} Column{span > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="widget-height">Widget Height</Label>
                            <select
                                id="widget-height"
                                value={currentInstance.config.gridHeight || 1}
                                onChange={e => handleConfigChange({ gridHeight: parseInt(e.target.value) })}
                                className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                            >
                                {[1, 2, 3, 4].map(span => (
                                    <option key={span} value={span}>{span} Row{span > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-zinc-700/50">
                    <Button variant="secondary" onClick={handleDelete} className="bg-red-900/50 text-red-400 hover:bg-red-900/80 focus:ring-red-500">
                        <Trash2Icon className="h-4 w-4 mr-2" />
                        Delete Widget
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};