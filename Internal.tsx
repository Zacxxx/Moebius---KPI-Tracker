import React, { useMemo, useState } from 'react';
import type { SelectableKpi, WidgetType } from './types';
import { initialCapTableMetrics } from './data';
import { Dashboard } from './components/Dashboard';
import { UsersIcon, SmileIcon, PieChartIcon } from './components/Icons';
import { ALL_WIDGETS } from './data-widgets';

const internalKpis = [
    { id: 201, metric: 'Headcount', value: '42', change: '+2 this month' },
    { id: 202, metric: 'eNPS', value: '75', change: 'Last surveyed in Q2' },
    { id: 203, metric: 'Avg. Time to Hire', value: '38 days', change: '-5 days vs last quarter' },
    { id: 204, metric: 'Quarterly Turnover', value: '3.1%', change: '+0.5% vs last quarter' },
];

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Headcount': UsersIcon,
    'eNPS': SmileIcon,
    'Total Shares Outstanding': PieChartIcon,
    'Founder Ownership %': UsersIcon,
};

export default function Internal() {
    const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['HIRING_PIPELINE']);
    
    const allKpisForModal = useMemo<SelectableKpi[]>(() => [
        ...internalKpis.map(k => ({...k, source: 'People'})),
        ...initialCapTableMetrics.map(k => ({...k, source: 'Cap Table'})),
    ], []);

    const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => w.id === 'HIRING_PIPELINE'), []);

    return (
        <Dashboard
            title="People"
            description="Monitor team growth, hiring, and key HR metrics."
            initialShowcaseKpis={internalKpis}
            allKpisForModal={allKpisForModal}
            iconMap={iconMap}
            availableWidgets={availableWidgets}
            visibleWidgetIds={visibleWidgetIds}
            setVisibleWidgetIds={setVisibleWidgetIds}
        />
    );
}
