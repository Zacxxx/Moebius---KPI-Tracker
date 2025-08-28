import React from 'react';
import type { WidgetInstance } from '../types';
import { WIDGET_COMPONENT_MAP, ALL_DATA_SOURCES } from '../data-widgets';
import { Card, CardContent } from './ui/Card';

interface GeneratedWidgetPreviewProps {
    widgetInstance: WidgetInstance;
}

export const GeneratedWidgetPreview: React.FC<GeneratedWidgetPreviewProps> = ({ widgetInstance }) => {
    const WidgetComponent = WIDGET_COMPONENT_MAP[widgetInstance.widgetType];
    
    if (!WidgetComponent) {
        return (
            <Card>
                <CardContent className="p-4 text-red-400">
                    Error: Widget type "{widgetInstance.widgetType}" not found.
                </CardContent>
            </Card>
        );
    }
    
    const dataSourceKey = widgetInstance.config.dataSourceKey;
    const data = dataSourceKey ? ALL_DATA_SOURCES[dataSourceKey as keyof typeof ALL_DATA_SOURCES]?.data : undefined;
    
    const componentProps: any = {
        instance: widgetInstance,
        data: data,
        onConfigure: () => {}, // No-op for preview
        onConfigChange: () => {}, // No-op for preview
        isConfigurable: false // Disable header controls in preview
    };

    return <WidgetComponent {...componentProps} />;
};
