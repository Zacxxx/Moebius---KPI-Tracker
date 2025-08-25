import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { initialKpiMetrics } from './data';
import { PREMADE_WIDGETS } from './data-widgets';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page } from './types';
import { TrendingUpIcon, UsersIcon } from './components/Icons';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': TrendingUpIcon,
    'Active Users': UsersIcon,
};

const createInitialWidgets = (premadeIds: string[], sectionId: string): WidgetInstance[] => {
    return premadeIds.map(id => {
        const premade = PREMADE_WIDGETS.find(p => p.id === id);
        if (!premade) return null;
        return {
            id: premade.id,
            widgetType: premade.instance.widgetType,
            config: premade.instance.config,
            sectionId: sectionId,
        };
    }).filter((w): w is WidgetInstance => w !== null);
};

interface HomeDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onCiteWidget: (instance: WidgetInstance, data: any) => void;
}

export default function HomeDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onCiteWidget }: HomeDashboardProps) {
    const [sections, setSections] = useState<DashboardSection[]>([
        { id: 'kpis', title: 'Key Metrics' },
        { id: 'main', title: 'Dashboard Widgets' },
    ]);
    
    const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
        const kpiWidgets = initialKpiMetrics.map(kpi => ({
            id: `kpi-home-${kpi.id}`,
            widgetType: 'KPI_VIEW' as const,
            sectionId: 'kpis',
            config: {
                title: kpi.metric,
                selectedKpiId: kpi.id,
                selectedKpiSource: 'Home',
                gridWidth: 1,
                gridHeight: 1,
            }
        }));
        const otherWidgets = createInitialWidgets(['premade_sales_trend', 'premade_activity_feed', 'premade_top_products'], 'main');
        return [...kpiWidgets, ...otherWidgets];
    });

    const allKpisForModal = useMemo<SelectableKpi[]>(() => 
        initialKpiMetrics.map(k => ({ ...k, source: 'Home' }))
    , []);

    return (
        <Dashboard
            title="Home Dashboard"
            description=""
            allKpisForModal={allKpisForModal}
            iconMap={iconMap}
            widgets={widgets}
            setWidgets={setWidgets}
            sections={sections}
            setSections={setSections}
            globalTimeConfig={globalTimeConfig}
            setGlobalTimeConfig={setGlobalTimeConfig}
            page={page}
            setPage={setPage}
            isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
            onCiteWidget={onCiteWidget}
        />
    );
}
