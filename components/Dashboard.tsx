
import React, { useState, useMemo } from 'react';
import { EditIcon } from './Icons';
import type { SelectableKpi, WidgetInstance, DashboardSection, ShowcaseKpi, TimeConfig, Page } from '../types';
import { Button } from './ui/Button';
import { WidgetSelectionPanel } from './WidgetSelectionPanel';
import { WIDGET_COMPONENT_MAP, ALL_DATA_SOURCES } from '../data-widgets';
import { WidgetConfigModal } from './WidgetConfigModal';
import { KpiWidgetConfigForm } from './forms/KpiWidgetConfigForm';
import { BaseWidgetConfigForm } from './forms/BaseWidgetConfigForm';
import { VersionSelector } from './ui/VersionSelector';
import { TimeRangeControl } from './ui/TimeRangeControl';
import { DashboardBreadcrumb } from './ui/DashboardBreadcrumb';
import { platformNavItems } from '../navigation';
import { KpiChartModal } from './KpiChartModal';

interface DashboardProps {
    title: string;
    description: string;
    allKpisForModal: SelectableKpi[];
    iconMap: { [key: string]: React.FC<{ className?: string }> };
    iconColorMap?: { [key: string]: string };
    widgets: WidgetInstance[];
    setWidgets: React.Dispatch<React.SetStateAction<WidgetInstance[]>>;
    sections: DashboardSection[];
    setSections: React.Dispatch<React.SetStateAction<DashboardSection[]>>;
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
}

const versions = [
    { id: 'live', label: 'Live Version' },
    { id: 'staging', label: 'Staging Environment' },
    { id: 'q2-forecast', label: 'Q2 Forecast Scenario' },
];

export const Dashboard: React.FC<DashboardProps> = ({
    title,
    description,
    allKpisForModal,
    iconMap,
    iconColorMap = {},
    widgets,
    setWidgets,
    sections,
    setSections,
    globalTimeConfig,
    setGlobalTimeConfig,
    page,
    setPage,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [configuringWidget, setConfiguringWidget] = useState<WidgetInstance | null>(null);
    const [activeVersion, setActiveVersion] = useState('live');
    const [viewingChartKpi, setViewingChartKpi] = useState<SelectableKpi | null>(null);

    const breadcrumbItems = useMemo(() => {
        if (page === 'dashboard') { // Home Dashboard
            return platformNavItems
                .filter(item => item.page.endsWith('-dashboard') && item.page !== 'dashboard')
                .map(item => ({ label: item.label, page: item.page }));
        } else { // Individual Dashboard
            const navItem = platformNavItems.find(item => item.page === page || (item.subItems || []).some(sub => sub.page === page));
            if (navItem?.page === page) { // It's a top-level dashboard page
                 return navItem?.subItems || [];
            }
            // It's a sub-page, find the parent
            const parentItem = platformNavItems.find(item => (item.subItems || []).some(sub => sub.page === page));
            return parentItem?.subItems || [];
        }
    }, [page]);
    
    const activeDashboardTitle = useMemo(() => {
       if (page === 'dashboard') return title;

       const parentItem = platformNavItems.find(item => item.page === page || (item.subItems || []).some(sub => sub.page === page));
       return parentItem?.label || title;
    }, [page, title]);


    const handleUpdateWidget = (updatedWidget: WidgetInstance) => {
        setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w));
        setConfiguringWidget(null);
    };

    const handleDeleteWidget = (widgetId: string) => {
        setWidgets(prev => prev.filter(w => w.id !== widgetId));
        setConfiguringWidget(null);
    };
    
    const handleWidgetConfigChange = (widgetId: string, newConfig: Partial<WidgetInstance['config']>) => {
      setWidgets(prev => 
        prev.map(w => 
          w.id === widgetId ? { ...w, config: { ...w.config, ...newConfig } } : w
        )
      );
    };

    const renderConfigForm = (props: { config: WidgetInstance['config'], onConfigChange: (newConfig: Partial<WidgetInstance['config']>) => void }) => {
        if (!configuringWidget) return null;

        switch (configuringWidget.widgetType) {
            case 'KPI_VIEW':
                return <KpiWidgetConfigForm {...props} allKpis={allKpisForModal} />;
            case 'PROJECTION_GRAPHIC':
            case 'STATIC_QUICK_ACTIONS':
            case 'ACTIVITY_FEED':
            default:
                return <BaseWidgetConfigForm {...props} widgetType={configuringWidget.widgetType} />;
        }
    };

    return (
        <>
            <div className="space-y-8">
                <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <DashboardBreadcrumb 
                            title={activeDashboardTitle}
                            items={breadcrumbItems}
                            activePage={page}
                            onSelect={setPage}
                        />
                        <p className="text-zinc-400 mt-1">{description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <TimeRangeControl timeConfig={globalTimeConfig} setTimeConfig={setGlobalTimeConfig} />
                        <VersionSelector 
                            versions={versions}
                            activeVersion={activeVersion}
                            onVersionChange={setActiveVersion}
                        />
                        <Button variant="secondary" onClick={() => setIsEditing(true)}>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit Dashboard
                        </Button>
                    </div>
                </header>
                
                {sections.map(section => {
                    const sectionWidgets = widgets.filter(w => w.sectionId === section.id);
                    if (sectionWidgets.length === 0 && !isEditing) return null;

                    const gridCols = 'lg:grid-cols-4';

                    return (
                        <section key={section.id}>
                            <h2 className="text-xl font-semibold text-zinc-200 mb-4">{section.title}</h2>
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${gridCols} auto-rows-[minmax(104px,auto)]`}>
                                {sectionWidgets.map(widgetInstance => {
                                    const WidgetComponent = WIDGET_COMPONENT_MAP[widgetInstance.widgetType];
                                    if (!WidgetComponent) {
                                        console.warn(`Widget component for type ${widgetInstance.widgetType} not found.`);
                                        return null;
                                    }
                                    
                                    const colSpanClass = `lg:col-span-${widgetInstance.config.gridWidth || 1}`;
                                    const rowSpanClass = `row-span-${widgetInstance.config.gridHeight || 1}`;
                                    const gridSpan = `${colSpanClass} ${rowSpanClass}`.trim();
                                    
                                    const dataSourceKey = widgetInstance.config.dataSourceKey;
                                    const data = dataSourceKey ? ALL_DATA_SOURCES[dataSourceKey]?.data : undefined;
                                    
                                    const componentProps: any = {
                                        instance: widgetInstance,
                                        data: data,
                                        onConfigure: () => setConfiguringWidget(widgetInstance),
                                        onConfigChange: (newConfig: Partial<WidgetInstance['config']>) => handleWidgetConfigChange(widgetInstance.id, newConfig),
                                        allKpis: allKpisForModal,
                                        iconMap: iconMap,
                                        iconColorMap: iconColorMap,
                                        globalTimeConfig: globalTimeConfig,
                                        onOpenChart: setViewingChartKpi,
                                    };

                                    return (
                                        <div key={widgetInstance.id} className={gridSpan}>
                                            <WidgetComponent {...componentProps} />
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}
            </div>

            {configuringWidget && (
                 <WidgetConfigModal
                    isOpen={!!configuringWidget}
                    onClose={() => setConfiguringWidget(null)}
                    onSave={handleUpdateWidget}
                    onDelete={handleDeleteWidget}
                    widgetInstance={configuringWidget}
                >
                    {(props) => renderConfigForm(props)}
                </WidgetConfigModal>
            )}
            
            {viewingChartKpi && (
                <KpiChartModal
                    kpi={viewingChartKpi}
                    onClose={() => setViewingChartKpi(null)}
                    globalTimeConfig={globalTimeConfig}
                />
            )}

            <WidgetSelectionPanel
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                widgets={widgets}
                setWidgets={setWidgets}
                sections={sections}
                setSections={setSections}
                onConfigureWidget={(widget) => setConfiguringWidget(widget)}
                allKpis={allKpisForModal}
            />
        </>
    );
};
