import React, { useMemo, useState } from 'react';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page, WidgetContext } from './types';
import { initialCapTableMetrics } from './data';
import { Dashboard } from './Dashboard';
import { UsersIcon, SmileIcon, PieChartIcon } from './components/Icons';
import { PREMADE_WIDGETS } from './data-widgets';

const internalKpis = [
    { id: 201, metric: 'Headcount', value: '42', change: '+2 this month' },
    { id: 202, metric: 'eNPS', value: '75', change: 'Last surveyed in Q2' },
    { id: 203, metric: 'Avg. Time to Hire', value: '38 days', change: '-5 days vs last quarter', inverse: true },
    { id: 204, metric: 'Quarterly Turnover', value: '3.1%', change: '+0.5% vs last quarter', inverse: true },
];

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Headcount': UsersIcon,
    'eNPS': SmileIcon,
    'Total Shares Outstanding': PieChartIcon,
    'Founder Ownership %': UsersIcon,
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

interface InternalProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext?: (context: WidgetContext) => void;
}

export default function Internal({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onAttachContext }: InternalProps) {
    const [sections, setSections] = useState<DashboardSection[]>([
        { id: 'kpis', title: 'Key Metrics' },
        { id: 'main', title: 'Dashboard Widgets' },
    ]);

    const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
        const kpiWidgets: WidgetInstance[] = internalKpis.map(kpi => ({
            id: `kpi-internal-${kpi.id}`,
            widgetType: 'KPI_VIEW',
            sectionId: 'kpis',
            config: {
                title: kpi.metric,
                selectedKpiId: kpi.id,
                selectedKpiSource: 'People',
                gridWidth: 1,
            }
        }));
        const otherWidgets = createInitialWidgets(['premade_hiring_pipeline'], 'main');
        return [...kpiWidgets, ...otherWidgets];
    });
    
    const allKpisForModal = useMemo<SelectableKpi[]>(() => [
        ...internalKpis.map(k => ({...k, source: 'People'})),
        ...initialCapTableMetrics.map(k => ({...k, source: 'Cap Table'})),
    ], []);

    return (
        <Dashboard
            title="People"
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
            onAttachContext={onAttachContext}
        />
    );
}