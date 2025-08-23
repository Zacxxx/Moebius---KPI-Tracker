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
                            <Label>Widget Width</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(span => (
                                    <Button
                                        key={span}
                                        variant={(currentInstance.config.gridWidth || 1) === span ? 'primary' : 'secondary'}
                                        onClick={() => handleConfigChange({ gridWidth: span })}
                                        className="flex-1"
                                    >
                                        {span}
                                    </Button>
                                ))}
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>Widget Height</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(span => (
                                    <Button
                                        key={span}
                                        variant={(currentInstance.config.gridHeight || 1) === span ? 'primary' : 'secondary'}
                                        onClick={() => handleConfigChange({ gridHeight: span })}
                                        className="flex-1"
                                    >
                                        {span}
                                    </Button>
                                ))}
                            </div>
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
