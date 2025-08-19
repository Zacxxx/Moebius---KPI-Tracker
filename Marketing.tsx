import React, { useMemo, useState } from 'react';
import { MegaphoneIcon, TrendingUpIcon, WalletIcon, UsersIcon, BarChartIcon } from './components/Icons';
import type { MarketingMetric, SelectableKpi, WidgetType } from './types';
import { initialMarketingMetrics } from './data';
import { Dashboard } from './components/Dashboard';
import { ALL_WIDGETS } from './data-widgets';


const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Leads': MegaphoneIcon,
    'Conversion Rate': TrendingUpIcon,
    'Customer Acquisition Cost (CAC)': WalletIcon,
    'Website Traffic': UsersIcon,
    'Return on Ad Spend (ROAS)': TrendingUpIcon,
    'Click-Through Rate (CTR)': BarChartIcon,
    'Cost Per Click (CPC)': WalletIcon,
};

export default function Marketing() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['SALES_FUNNEL', 'TRAFFIC_SOURCES', 'CAMPAIGN_PERFORMANCE']);
  
  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialMarketingMetrics.map(k => ({ ...k, source: 'Marketing' }))
  , []);
  
  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => 
      w.id === 'SALES_FUNNEL' || w.id === 'TRAFFIC_SOURCES' || w.id === 'CAMPAIGN_PERFORMANCE'
  ), []);

  return (
    <Dashboard
        title="Marketing Dashboard"
        description="Analyze campaign performance, track funnel conversions, and understand your traffic sources."
        initialShowcaseKpis={initialMarketingMetrics}
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
