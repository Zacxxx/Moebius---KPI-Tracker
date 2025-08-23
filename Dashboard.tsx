
import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TrendingUpIcon, UsersIcon, ClockIcon, TrendingDownIcon } from './components/Icons';
import { initialKpiMetrics } from './data';
import type { KpiMetric, SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page } from './types';
import { PREMADE_WIDGETS } from './data-widgets';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': TrendingUpIcon,
    'Active Users': UsersIcon,
    'Cash Runway': ClockIcon,
    'Monthly Burn Rate': TrendingDownIcon,
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
}

export default function HomeDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage }: HomeDashboardProps) {
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
            }
        }));
        const otherWidgets = createInitialWidgets(['premade_sales_trend', 'premade_activity_feed', 'premade_hiring_pipeline'], 'main');
        return [...kpiWidgets, ...otherWidgets];
    });

    const allKpisForModal = useMemo<SelectableKpi[]>(() => 
        initialKpiMetrics.map(k => ({ ...k, source: 'Home' }))
    , []);

    return (
        <Dashboard
            title="Home Dashboard"
            description="A comprehensive overview of your business's key metrics and activities."
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
        />
    );
}
