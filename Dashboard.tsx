import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { TrendingUpIcon, UsersIcon, TrendingDownIcon, SmileIcon } from './components/Icons';
import { 
    initialActivityFeed,
    initialKpiMetrics,
    initialCustomerMetrics,
    initialOperationalMetrics,
    initialProductMetrics,
    initialMarketingMetrics,
    initialCapTableMetrics,
} from './data';
import type { SelectableKpi, ShowcaseKpi, WidgetType } from './types';
import { ALL_WIDGETS } from './data-widgets';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': TrendingUpIcon,
    'Customer Lifetime Value (LTV)': TrendingUpIcon,
    'Burn Rate': TrendingDownIcon,
    'Net Promoter Score (NPS)': SmileIcon,
    'Active Users': UsersIcon,
};
const iconColorMap: { [key: string]: string } = {
    'Annual Recurring Revenue': 'text-emerald-400',
    'Customer Lifetime Value (LTV)': 'text-emerald-400',
    'Burn Rate': 'text-red-400',
    'Net Promoter Score (NPS)': 'text-emerald-400',
    'Active Users': 'text-violet-400',
};

export default function HomeDashboard() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['ACTIVITY_FEED']);

  const initialShowcaseKpis = useMemo<ShowcaseKpi[]>(() => {
    const arr = initialKpiMetrics.find(k => k.metric === 'Annual Recurring Revenue');
    const ltv = initialCustomerMetrics.find(k => k.metric === 'Customer Lifetime Value (LTV)');
    const burn = initialOperationalMetrics.find(k => k.metric === 'Burn Rate');
    const nps = initialProductMetrics.find(k => k.metric === 'Net Promoter Score (NPS)');
    const kpis: (ShowcaseKpi | undefined)[] = [arr, ltv, burn, nps];
    return kpis.filter((kpi): kpi is ShowcaseKpi => !!kpi);
  }, []);

  const allKpis = useMemo<SelectableKpi[]>(() => [
    ...initialKpiMetrics.map(k => ({...k, source: 'Home'})),
    ...initialMarketingMetrics.map(k => ({...k, source: 'Marketing'})),
    ...initialOperationalMetrics.map(k => ({...k, source: 'Operational'})),
    ...initialCustomerMetrics.map(k => ({...k, source: 'Customer'})),
    ...initialProductMetrics.map(k => ({...k, source: 'Product Analytics'})),
    ...initialCapTableMetrics.map(k => ({...k, source: 'Cap Table'})),
  ], []);
  
  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => 
    w.id === 'ACTIVITY_FEED' || 
    w.id === 'PROJECTION_GRAPHIC' ||
    w.id === 'SALES_TREND' ||
    w.id === 'CAMPAIGN_PERFORMANCE'
  ), []);

  return (
    <Dashboard
        title="Home Dashboard"
        description="An overview of your business's key metrics from all sources."
        initialShowcaseKpis={initialShowcaseKpis}
        allKpisForModal={allKpis}
        iconMap={iconMap}
        iconColorMap={iconColorMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
