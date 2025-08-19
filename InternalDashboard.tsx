import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UsersIcon, SmileIcon, PieChartIcon } from './components/Icons';
import { initialCapTableMetrics } from './data';
import type { SelectableKpi, ShowcaseKpi, WidgetType } from './types';
import { ALL_WIDGETS } from './data-widgets';

// Let's create some static KPIs for the internal dashboard.
const internalKpis = [
    { id: 201, metric: 'Headcount', value: '42', change: '+2 this month' },
    { id: 202, metric: 'eNPS', value: '75', change: 'Last surveyed in Q2' },
];

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Headcount': UsersIcon,
    'eNPS': SmileIcon,
    'Total Shares Outstanding': PieChartIcon,
    'Founder Ownership %': UsersIcon,
};

export default function InternalDashboard() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['HIRING_PIPELINE']);
  
  const initialShowcaseKpis = useMemo<ShowcaseKpi[]>(() => {
    const headcount = internalKpis.find(k => k.metric === 'Headcount');
    const enps = internalKpis.find(k => k.metric === 'eNPS');
    const shares = initialCapTableMetrics.find(k => k.metric === 'Total Shares Outstanding');
    const founderOwn = initialCapTableMetrics.find(k => k.metric === 'Founder Ownership %');
    return [headcount, enps, shares, founderOwn].filter((k): k is ShowcaseKpi => !!k);
  }, []);

  const allKpisForModal = useMemo<SelectableKpi[]>(() => [
    ...internalKpis.map(k => ({...k, source: 'People'})),
    ...initialCapTableMetrics.map(k => ({...k, source: 'Cap Table'})),
  ], []);
  
  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => w.id === 'HIRING_PIPELINE'), []);

  return (
    <Dashboard
        title="Internal Dashboard"
        description="Monitor team growth, hiring, ownership, and key HR metrics."
        initialShowcaseKpis={initialShowcaseKpis}
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
