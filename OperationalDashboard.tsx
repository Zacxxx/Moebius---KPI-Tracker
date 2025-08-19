import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TrendingUpIcon, ClockIcon, TrendingDownIcon } from './components/Icons';
import { initialOperationalMetrics } from './data';
import type { SelectableKpi, WidgetType } from './types';
import { ALL_WIDGETS } from './data-widgets';

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

export default function OperationalDashboard() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>([]);

  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialOperationalMetrics.map(k => ({ ...k, source: 'Operational' }))
  , []);
  
  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => w.id === 'ACTIVITY_FEED'), []);

  return (
    <Dashboard
        title="Operational Dashboard"
        description="Track costs, uptime, and system performance."
        initialShowcaseKpis={initialOperationalMetrics}
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        iconColorMap={iconColorMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
