import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UsersIcon, SmileIcon, PieChartIcon } from './components/Icons';
import { initialCapTableMetrics } from './data';
import type { SelectableKpi, ShowcaseKpi, WidgetInstance, DashboardSection, TimeConfig, Page, WidgetContext } from './types';
import { PREMADE_WIDGETS } from './data-widgets';

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

interface InternalDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext?: (context: WidgetContext) => void;
}

export default function InternalDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onAttachContext }: InternalDashboardProps) {
  const [sections, setSections] = useState<DashboardSection[]>([
      { id: 'kpis', title: 'Key Metrics' },
      { id: 'main', title: 'Dashboard Widgets' },
  ]);

  const allKpisForModal = useMemo<SelectableKpi[]>(() => [
    ...internalKpis.map(k => ({...k, source: 'People'})),
    ...initialCapTableMetrics.map(k => ({...k, source: 'Cap Table'})),
  ], []);

  const showcaseKpis = useMemo<ShowcaseKpi[]>(() => {
    const headcount = internalKpis.find(k => k.metric === 'Headcount');
    const enps = internalKpis.find(k => k.metric === 'eNPS');
    const shares = initialCapTableMetrics.find(k => k.metric === 'Total Shares Outstanding');
    const founderOwn = initialCapTableMetrics.find(k => k.metric === 'Founder Ownership %');
    return [headcount, enps, shares, founderOwn].filter((k): k is ShowcaseKpi => !!k);
  }, []);

  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
      const kpiWidgets = showcaseKpis.map(kpi => {
          const sourceKpi = allKpisForModal.find(ak => ak.id === kpi.id && ak.metric === kpi.metric);
          return {
              id: `kpi-internal-dash-${kpi.id}`,
              widgetType: 'KPI_VIEW' as const,
              sectionId: 'kpis',
              config: {
                  title: kpi.metric,
                  selectedKpiId: kpi.id,
                  selectedKpiSource: sourceKpi?.source || '',
                  gridWidth: 1,
              }
          };
      });
      const otherWidgets = createInitialWidgets(['premade_hiring_pipeline'], 'main');
      return [...kpiWidgets, ...otherWidgets];
  });
  

  return (
    <Dashboard
        title="Internal Dashboard"
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
