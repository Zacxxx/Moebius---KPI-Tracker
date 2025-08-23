
import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UsersIcon, ClockIcon, TrendingUpIcon, PackageIcon } from './components/Icons';
import { initialCoordinationMetrics } from './data';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page } from './types';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Active Contractors': UsersIcon,
    'Avg. Project Completion Time': ClockIcon,
    'Services Uptime': TrendingUpIcon,
    'Open Service Tickets': PackageIcon,
};

interface CoordinationDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
}

export default function CoordinationDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage }: CoordinationDashboardProps) {
  const [sections, setSections] = useState<DashboardSection[]>([
    { id: 'kpis', title: 'Key Metrics' }
  ]);
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
      return initialCoordinationMetrics.map(kpi => ({
          id: `kpi-coordination-${kpi.id}`,
          widgetType: 'KPI_VIEW',
          sectionId: 'kpis',
          config: {
              title: kpi.metric,
              selectedKpiId: kpi.id,
              selectedKpiSource: 'Coordination',
              gridWidth: 1,
          }
      }));
  });

  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialCoordinationMetrics.map(k => ({ ...k, source: 'Coordination' }))
  , []);

  return (
    <Dashboard
        title="Coordination Dashboard"
        description="Manage and coordinate with your organization's contractors, agents, and services."
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
