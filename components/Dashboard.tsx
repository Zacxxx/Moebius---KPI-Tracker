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
import { allNavItems, navigationData, type NavItemData } from '../navigation';
import { KpiChartModal } from './KpiChartModal';

interface BreadcrumbSection {
    title?: string;
    items: { label: string; page: Page }[];
}

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
    onCiteWidget?: (instance: WidgetInstance, data: any) => void;
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
    onCiteWidget,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [configuringWidget, setConfiguringWidget] = useState<WidgetInstance | null>(null);
    const [activeVersion, setActiveVersion] = useState('live');
    const [viewingChartKpi, setViewingChartKpi] = useState<SelectableKpi | null>(null);

    const breadcrumbItems = useMemo<BreadcrumbSection[]>(() => {
        const allDashboardsRoot = navigationData.platform[0].items.find(i => i.label === "Dashboards");
        if (!allDashboardsRoot || !allDashboardsRoot.subItems) return [];
    
        const breadcrumbSections: BreadcrumbSection[] = [];
        const otherItems: { label: string; page: Page }[] = [];
    
        allDashboardsRoot.subItems.forEach(item => {
            if (item.subItems) { // This is a category with sub-items, e.g., "Platform"
                breadcrumbSections.push({
                    title: item.label,
                    items: item.subItems.map(sub => ({ label: sub.label, page: sub.page }))
                });
            } else { // This is a direct dashboard link
                otherItems.push({ label: item.label, page: item.page });
            }
        });
    
        if (otherItems.length > 0) {
            const untitledSection = breadcrumbSections.find(s => !s.title);
            if (untitledSection) {
                untitledSection.items.push(...otherItems);
            } else {
                breadcrumbSections.push({ items: otherItems });
            }
        }
        
        return breadcrumbSections;
    }, []);

    const activeDashboardTitle = useMemo(() => {
        // This function will find the NavItemData for the given page.
        const findItem = (pageToFind: Page, items: NavItemData[]): NavItemData | null => {
            for (const item of items) {
                if (item.page === pageToFind) return item;
                if (item.subItems) {
                    const found = findItem(pageToFind, item.subItems);
                    if (found) return found;
                }
            }
            return null;
        };
        
        // This function will find the direct parent of a given item.
        const findParent = (itemToFind: NavItemData, items: NavItemData[]): NavItemData | null => {
            for (const item of items) {
                if (item.subItems?.some(sub => sub.page === itemToFind.page)) {
                    return item;
                }
                if (item.subItems) {
                    const found = findParent(itemToFind, item.subItems);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const currentItem = findItem(page, allNavItems);
        if (!currentItem) return title;
    
        // A dashboard page is one that ends with '-dashboard' or is 'dashboard'
        const isDashboardPage = currentItem.page.endsWith('-dashboard') || currentItem.page === 'dashboard';
        if (isDashboardPage) {
            return currentItem.label;
        }
    
        // It's a sub-page, so find its dashboard parent.
        const parent = findParent(currentItem, allNavItems);
        return parent ? parent.label : currentItem.label;
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
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 h-12">
                    <div>
                         <DashboardBreadcrumb 
                            title={activeDashboardTitle}
                            items={breadcrumbItems}
                            activePage={page}
                            onSelect={setPage}
                        />
                    </div>
                     <div className="flex items-center gap-2 flex-wrap">
                        <TimeRangeControl timeConfig={globalTimeConfig} setTimeConfig={setGlobalTimeConfig} />
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
                                        onCite: onCiteWidget ? () => onCiteWidget(widgetInstance, data) : undefined,
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