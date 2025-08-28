
import React, { useState, useMemo } from 'react';
import { EditIcon, MessageSquareIcon, LibraryIcon, DatabaseIcon, TrendingUpIcon } from './components/Icons';
import type { SelectableKpi, WidgetInstance, DashboardSection, ShowcaseKpi, TimeConfig, Page, WidgetContext, NavItemData } from './types';
import { Button } from './components/ui/Button';
import { WidgetSelectionPanel } from './components/WidgetSelectionPanel';
import { WIDGET_COMPONENT_MAP, ALL_DATA_SOURCES } from './data-widgets';
import { WidgetConfigModal } from './components/WidgetConfigModal';
import { KpiWidgetConfigForm } from './components/forms/KpiWidgetConfigForm';
import { BaseWidgetConfigForm } from './components/forms/BaseWidgetConfigForm';
import { VersionSelector } from './components/ui/VersionSelector';
import { TimeRangeControl } from './components/ui/TimeRangeControl';
import { DashboardBreadcrumb } from './components/ui/DashboardBreadcrumb';
import { allNavItems, navigationData } from './navigation';
import { KpiChartModal } from './components/KpiChartModal';
import { formatWidgetDataForAI, findPath } from './utils';


interface DashboardProps {
    title: string;
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
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext?: (context: WidgetContext) => void;
}

const versions = [
    { id: 'live', label: 'Live Version' },
    { id: 'staging', label: 'Staging Environment' },
    { id: 'q2-forecast', label: 'Q2 Forecast Scenario' },
];

export const Dashboard: React.FC<DashboardProps> = ({
    title,
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
    isKpiSentimentColoringEnabled,
    onAttachContext,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [configuringWidget, setConfiguringWidget] = useState<WidgetInstance | null>(null);
    const [activeVersion, setActiveVersion] = useState('live');
    const [viewingChartKpi, setViewingChartKpi] = useState<SelectableKpi | null>(null);

    const breadcrumbItems = useMemo<NavItemData[]>(() => {
        const allDashboardsRoot = navigationData.platform[0].items.find(i => i.label === "Dashboards");
        if (!allDashboardsRoot || !allDashboardsRoot.subItems) return [];
        // Return the hierarchical data directly
        return allDashboardsRoot.subItems;
    }, []);

    const breadcrumbPath = useMemo<string[]>(() => {
        const pathItems = findPath(page, allNavItems);
    
        if (!pathItems) return [title]; // Fallback to original title
    
        // Find the 'Dashboards' item and start the path from its child
        const dashboardsIndex = pathItems.findIndex(item => item.label === "Dashboards");
        const relevantPath = dashboardsIndex !== -1 ? pathItems.slice(dashboardsIndex + 1) : pathItems;
        
        return relevantPath.map(item => item.label);
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
    
    const getWidgetData = (widgetInstance: WidgetInstance) => {
        const dataSourceKey = widgetInstance.config.dataSourceKey;
        if (dataSourceKey) {
            return ALL_DATA_SOURCES[dataSourceKey]?.data;
        }
        if (widgetInstance.widgetType === 'KPI_VIEW') {
            const { selectedKpiId, selectedKpiSource } = widgetInstance.config;
            return allKpisForModal.find(kpi => kpi.id === selectedKpiId && kpi.source === selectedKpiSource);
        }
        return undefined;
    };

    const handleCiteWidgetClick = (widgetInstance: WidgetInstance, data: any) => {
        if (!onAttachContext) return;
        const Icon = widgetInstance.widgetType === 'KPI_VIEW'
            ? iconMap[(data as SelectableKpi)?.metric] || TrendingUpIcon
            : DatabaseIcon;
        
        const context: WidgetContext = {
            id: widgetInstance.id,
            title: widgetInstance.config.title,
            icon: Icon,
            data: formatWidgetDataForAI(widgetInstance, data),
            type: 'widget'
        };
        onAttachContext(context);
    };

    const handleCiteDashboardClick = () => {
        if (!onAttachContext) return;

        const childContexts: WidgetContext[] = widgets.map(widgetInstance => {
            const data = getWidgetData(widgetInstance);
            const Icon = widgetInstance.widgetType === 'KPI_VIEW'
                ? iconMap[(data as SelectableKpi)?.metric] || TrendingUpIcon
                : DatabaseIcon;
            return {
                id: widgetInstance.id,
                title: widgetInstance.config.title,
                icon: Icon,
                data: formatWidgetDataForAI(widgetInstance, data),
                type: 'widget',
            };
        });

        const dashboardContext: WidgetContext = {
            id: `dashboard-${page}`,
            title: `Dashboard: ${title}`,
            icon: LibraryIcon,
            type: 'dashboard',
            data: `Context from ${widgets.length} widgets on the "${title}" dashboard.`,
            children: childContexts,
        };

        onAttachContext(dashboardContext);
    };

    return (
        <>
            <div className="-mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8">
                    <div>
                         <DashboardBreadcrumb 
                            path={breadcrumbPath}
                            items={breadcrumbItems}
                            activePage={page}
                            onSelect={setPage}
                        />
                    </div>
                     <div className="flex items-center gap-2 flex-wrap">
                        <TimeRangeControl timeConfig={globalTimeConfig} setTimeConfig={setGlobalTimeConfig} />
                         {onAttachContext && (
                            <div className="relative group">
                                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleCiteDashboardClick}>
                                    <MessageSquareIcon className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-zinc-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    Use in Conversation
                                </div>
                            </div>
                        )}
                        <VersionSelector 
                            versions={versions}
                            activeVersion={activeVersion}
                            onVersionChange={setActiveVersion}
                        />
                        <div className="relative group">
                            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                                <EditIcon className="h-4 w-4" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-zinc-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Edit Dashboard
                            </div>
                        </div>
                    </div>
                </header>
                
                <hr className="border-zinc-700/50" />

                <div className="space-y-8 p-4 sm:p-6 lg:p-8">
                    {sections.map(section => {
                        const sectionWidgets = widgets.filter(w => w.sectionId === section.id);
                        if (sectionWidgets.length === 0 && !isEditing) return null;

                        return (
                            <section key={section.id}>
                                {section.id !== 'kpis' && (
                                    isEditing ? (
                                        <div className="flex items-center gap-2 mb-4">
                                            <h2 className="text-xl font-semibold text-zinc-200">{section.title}</h2>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400">Section</span>
                                        </div>
                                    ) : (
                                        <h2 className="text-xl font-semibold text-zinc-200 mb-4">{section.title}</h2>
                                    )
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[minmax(104px,auto)]">
                                    {sectionWidgets.map(widgetInstance => {
                                        const WidgetComponent = WIDGET_COMPONENT_MAP[widgetInstance.widgetType];
                                        if (!WidgetComponent) {
                                            console.warn(`Widget component for type ${widgetInstance.widgetType} not found.`);
                                            return null;
                                        }
                                        
                                        const colSpan = widgetInstance.config.gridWidth || 1;
                                        const rowSpan = widgetInstance.config.gridHeight || 1;
                                        
                                        const smColSpan = `sm:col-span-${Math.min(colSpan, 2)}`;
                                        const mdColSpan = `md:col-span-${Math.min(colSpan, 4)}`;

                                        const gridSpan = `col-span-1 ${smColSpan} ${mdColSpan} row-span-${rowSpan}`;
                                        
                                        const data = getWidgetData(widgetInstance);
                                        
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
                                            onCite: onAttachContext ? () => handleCiteWidgetClick(widgetInstance, data) : undefined,
                                            isKpiSentimentColoringEnabled: isKpiSentimentColoringEnabled,
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
