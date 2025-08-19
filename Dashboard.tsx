
import React, { useState, useMemo } from 'react';
import { PlusCircleIcon, TrendingUpIcon, UsersIcon, TrendingDownIcon, SmileIcon } from './components/Icons';
import type { ActivityItem, ShowcaseKpi, SelectableKpi } from './types';
import { KpiWidget } from './components/KpiWidget';
import ActivityFeed from './components/ActivityFeed';
import AddKpiModal from './components/AddKpiModal';
import { 
    initialActivityFeed,
    initialKpiMetrics,
    initialCustomerMetrics,
    initialOperationalMetrics,
    initialProductMetrics,
    initialMarketingMetrics,
    initialCapTableMetrics,
} from './data';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': TrendingUpIcon,
    'Customer Lifetime Value (LTV)': TrendingUpIcon,
    'Burn Rate': TrendingDownIcon,
    'Net Promoter Score (NPS)': SmileIcon,
    'Active Users': UsersIcon,
    'Leads': UsersIcon,
    'Conversion Rate': TrendingUpIcon,
    'Customer Acquisition Cost (CAC)': TrendingDownIcon,
    'System Uptime': TrendingUpIcon,
    'Avg. Ticket Resolution Time': TrendingUpIcon,
    'Customer Churn Rate': TrendingDownIcon,
    'LTV to CAC Ratio': TrendingUpIcon,
    'Active Subscribers': UsersIcon,
    'DAU / MAU Ratio': TrendingUpIcon,
    'Key Feature Adoption Rate': TrendingUpIcon,
    'Avg. Session Duration': TrendingUpIcon,
    'Total Shares Outstanding': TrendingUpIcon,
    'Founder Ownership %': UsersIcon,
    'Investor Ownership %': UsersIcon,
    'ESOP Pool %': UsersIcon,
};
const iconColorMap: { [key: string]: string } = {
    'Annual Recurring Revenue': 'text-emerald-400',
    'Customer Lifetime Value (LTV)': 'text-emerald-400',
    'Burn Rate': 'text-red-400',
    'Net Promoter Score (NPS)': 'text-emerald-400',
    'Active Users': 'text-violet-400',
    'Customer Churn Rate': 'text-red-400',
    'Customer Acquisition Cost (CAC)': 'text-red-400',
};

export default function Dashboard() {
  const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false);
  const [activityFeed] = useState<ActivityItem[]>(initialActivityFeed);
  
  const [kpiMetrics] = useState(initialKpiMetrics);
  const [marketingMetrics] = useState(initialMarketingMetrics);
  const [operationalMetrics] = useState(initialOperationalMetrics);
  const [customerMetrics] = useState(initialCustomerMetrics);
  const [productMetrics] = useState(initialProductMetrics);
  const [capTableMetrics] = useState(initialCapTableMetrics);

  const [showcaseKpis, setShowcaseKpis] = useState<ShowcaseKpi[]>(() => {
    const arr = initialKpiMetrics.find(k => k.metric === 'Annual Recurring Revenue');
    const ltv = initialCustomerMetrics.find(k => k.metric === 'Customer Lifetime Value (LTV)');
    const burn = initialOperationalMetrics.find(k => k.metric === 'Burn Rate');
    const nps = initialProductMetrics.find(k => k.metric === 'Net Promoter Score (NPS)');
    const kpis: (ShowcaseKpi | undefined)[] = [arr, ltv, burn, nps];
    return kpis.filter((kpi): kpi is ShowcaseKpi => !!kpi);
  });

  const allKpis = useMemo<SelectableKpi[]>(() => [
    ...kpiMetrics.map(k => ({...k, source: 'Home'})),
    ...marketingMetrics.map(k => ({...k, source: 'Marketing'})),
    ...operationalMetrics.map(k => ({...k, source: 'Operational'})),
    ...customerMetrics.map(k => ({...k, source: 'Customer'})),
    ...productMetrics.map(k => ({...k, source: 'Product Analytics'})),
    ...capTableMetrics.map(k => ({...k, source: 'Cap Table'})),
  ], [kpiMetrics, marketingMetrics, operationalMetrics, customerMetrics, productMetrics, capTableMetrics]);

  const handleAddKpi = (kpi: ShowcaseKpi) => {
    if (!showcaseKpis.some(existingKpi => existingKpi.metric === kpi.metric)) {
      setShowcaseKpis(prev => [...prev, kpi]);
    }
    setIsAddKpiModalOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-white">Home Dashboard</h1>
          <p className="text-zinc-400 mt-1">An overview of your business's key metrics from all sources.</p>
        </header>
        
        <section>
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseKpis.map(metric => (
                  <KpiWidget 
                      key={`${metric.id}-${metric.metric}`}
                      title={metric.metric} 
                      value={metric.value} 
                      change={'change' in metric ? metric.change : undefined}
                      icon={iconMap[metric.metric] || TrendingUpIcon} 
                      iconColor={iconColorMap[metric.metric] || 'text-emerald-400'} 
                  />
              ))}
            
            <button onClick={() => setIsAddKpiModalOpen(true)} className="flex items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 text-zinc-500 hover:bg-zinc-800/50 hover:border-zinc-600 transition-colors duration-200" aria-label="Add new widget">
              <div className="text-center">
                <PlusCircleIcon className="mx-auto h-10 w-10" />
                <p className="mt-2 text-base font-semibold">Add KPI Widget</p>
              </div>
            </button>
          </div>
        </section>

        <section>
          <ActivityFeed activities={activityFeed} />
        </section>
      </div>

      {isAddKpiModalOpen && (
        <AddKpiModal
          isOpen={isAddKpiModalOpen}
          onClose={() => setIsAddKpiModalOpen(false)}
          allKpis={allKpis}
          showcaseKpis={showcaseKpis}
          onAddKpi={handleAddKpi}
        />
      )}
    </>
  );
}