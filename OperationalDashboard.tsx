import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TrendingUpIcon, ClockIcon, TrendingDownIcon } from './components/Icons';
import { initialOperationalMetrics } from './data';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page, WidgetContext } from './types';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'System Uptime': TrendingUpIcon,
    'Avg. Ticket Resolution Time': ClockIcon,
    'Burn Rate': TrendingDownIcon,
};

const iconColorMap: { [key: string]: string } = {
    'System Uptime': 'text-emerald-400',
    'Avg. Ticket Resolution Time': 'text-emerald-400',
    'Burn Rate': 'text-red-400',
};

interface OperationalDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext?: (context: WidgetContext) => void;
}

export default function OperationalDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onAttachContext }: OperationalDashboardProps) {
  const [sections, setSections] = useState<DashboardSection[]>([
    { id: 'kpis', title: 'Key Metrics' }
  ]);
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    return initialOperationalMetrics.map(kpi => ({
        id: `kpi-operational-${kpi.id}`,
        widgetType: 'KPI_VIEW',
        sectionId: 'kpis',
        config: {
            title: kpi.metric,
            selectedKpiId: kpi.id,
            selectedKpiSource: 'Operational',
            gridWidth: 1,
        }
    }));
  });

  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialOperationalMetrics.map(k => ({ ...k, source: 'Operational' }))
  , []);

  return (
    <Dashboard
        title="Operational Dashboard"
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        iconColorMap={iconColorMap}
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
