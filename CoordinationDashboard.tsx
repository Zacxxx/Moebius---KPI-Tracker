import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UsersIcon, ClockIcon, TrendingUpIcon, PackageIcon } from './components/Icons';
import { initialCoordinationMetrics } from './data';
import type { SelectableKpi, WidgetType } from './types';
import { ALL_WIDGETS } from './data-widgets';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Active Contractors': UsersIcon,
    'Avg. Project Completion Time': ClockIcon,
    'Services Uptime': TrendingUpIcon,
    'Open Service Tickets': PackageIcon,
};

export default function CoordinationDashboard() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>([]);

  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialCoordinationMetrics.map(k => ({ ...k, source: 'Coordination' }))
  , []);
  
  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => w.id === 'ACTIVITY_FEED'), []);

  return (
    <Dashboard
        title="Coordination Dashboard"
        description="Manage and coordinate with your organization's contractors, agents, and services."
        initialShowcaseKpis={initialCoordinationMetrics}
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
