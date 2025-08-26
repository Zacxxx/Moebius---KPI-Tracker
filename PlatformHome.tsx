import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TrendingUpIcon, UsersIcon, ShoppingCartIcon } from './components/Icons';
import { initialKpiMetrics, initialEcommerceMetrics } from './data';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page } from './types';
import { PREMADE_WIDGETS } from './data-widgets';

const internalKpis = [
    { id: 201, metric: 'Headcount', value: '42', change: '+2 this month' },
];

const platformHomeKpis: SelectableKpi[] = [
    initialKpiMetrics.find(k => k.metric === 'Annual Recurring Revenue')!,
    internalKpis[0],
    initialEcommerceMetrics.find(k => k.metric === 'Gross Merchandise Volume')!,
    initialKpiMetrics.find(k => k.metric === 'Active Users')!,
].filter(Boolean).map(k => ({ ...k, source: 'Platform' }));


const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': TrendingUpIcon,
    'Headcount': UsersIcon,
    'Gross Merchandise Volume': ShoppingCartIcon,
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

interface PlatformHomeProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onCiteWidget?: (instance: WidgetInstance, data: any) => void;
}

export default function PlatformHome({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onCiteWidget }: PlatformHomeProps) {
    const [sections, setSections] = useState<DashboardSection[]>([
        { id: 'kpis', title: 'Platform KPIs' },
        { id: 'main', title: 'Overview' },
    ]);
    const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
        const kpiWidgets = platformHomeKpis.map(kpi => ({
            id: `kpi-platform-${kpi.id}`,
            widgetType: 'KPI_VIEW' as const,
            sectionId: 'kpis',
            config: {
                title: kpi.metric,
                selectedKpiId: kpi.id,
                selectedKpiSource: 'Platform',
                gridWidth: 1,
            }
        }));
        const otherWidgets = createInitialWidgets(['premade_sales_trend', 'premade_activity_feed', 'premade_hiring_pipeline'], 'main');
        return [...kpiWidgets, ...otherWidgets];
    });
    
    const allKpisForModal = useMemo<SelectableKpi[]>(() => 
      platformHomeKpis
    , []);

    return (
        <Dashboard
            title="Platform Home"
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
