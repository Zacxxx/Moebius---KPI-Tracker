
import React, { useState, useMemo } from 'react';
import { PlusCircleIcon, MegaphoneIcon, TrendingUpIcon, SearchIcon, UsersIcon } from './components/Icons';
import type { ActivityItem, ShowcaseKpi, SelectableKpi } from './types';
import { KpiWidget } from './components/KpiWidget';
import ActivityFeed from './components/ActivityFeed';
import AddKpiModal from './components/AddKpiModal';
import {
    initialExternalActivityFeed,
    initialProductMetrics,
    initialMarketingMetrics,
    initialContentMetrics,
    initialSeoMetrics,
    initialPartnerMetrics,
    initialPrMetrics,
    initialBrandingMetrics
} from './data';

// A specific icon map for external metrics
const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Organic Traffic': SearchIcon,
    'Leads': UsersIcon,
    'Social Media Reach': UsersIcon,
    'Media Mentions': MegaphoneIcon,
    'Key Feature Adoption Rate': TrendingUpIcon,
    'Avg. Engagement Rate': TrendingUpIcon,
    'Partner-Sourced Leads': UsersIcon,
    'Sentiment Score': UsersIcon,
};

export default function ExternalDashboard() {
  const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false);
  const [activityFeed] = useState<ActivityItem[]>(initialExternalActivityFeed);

  const [productMetrics] = useState(initialProductMetrics);
  const [marketingMetrics] = useState(initialMarketingMetrics);
  const [contentMetrics] = useState(initialContentMetrics);
  const [seoMetrics] = useState(initialSeoMetrics);
  const [partnerMetrics] = useState(initialPartnerMetrics);
  const [prMetrics] = useState(initialPrMetrics);
  const [brandingMetrics] = useState(initialBrandingMetrics);

  const [showcaseKpis, setShowcaseKpis] = useState<ShowcaseKpi[]>(() => {
    const organicTraffic = initialSeoMetrics.find(k => k.metric === 'Organic Traffic');
    const leads = initialMarketingMetrics.find(k => k.metric === 'Leads');
    const socialReach = initialBrandingMetrics.find(k => k.metric === 'Social Media Reach');
    const mediaMentions = initialPrMetrics.find(k => k.metric === 'Media Mentions');
    const kpis: (ShowcaseKpi | undefined)[] = [organicTraffic, leads, socialReach, mediaMentions];
    return kpis.filter((kpi): kpi is ShowcaseKpi => !!kpi);
  });

  const allKpis = useMemo<SelectableKpi[]>(() => [
    ...productMetrics.map(k => ({ ...k, source: 'Product Analytics' })),
    ...marketingMetrics.map(k => ({ ...k, source: 'Marketing' })),
    ...contentMetrics.map(k => ({ ...k, source: 'Content' })),
    ...seoMetrics.map(k => ({ ...k, source: 'SEO' })),
    ...partnerMetrics.map(k => ({ ...k, source: 'Partners' })),
    ...prMetrics.map(k => ({ ...k, source: 'PR' })),
    ...brandingMetrics.map(k => ({ ...k, source: 'Branding' })),
  ], [productMetrics, marketingMetrics, contentMetrics, seoMetrics, partnerMetrics, prMetrics, brandingMetrics]);

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
          <h1 className="text-2xl font-bold tracking-tight text-white">External Dashboard</h1>
          <p className="text-zinc-400 mt-1">An overview of your marketing, content, SEO, and branding efforts.</p>
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
