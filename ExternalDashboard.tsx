import React, { useState, useMemo } from 'react';
import { MegaphoneIcon, TrendingUpIcon, SearchIcon, UsersIcon } from './components/Icons';
import type { ShowcaseKpi, SelectableKpi, WidgetType } from './types';
import {
    initialProductMetrics,
    initialMarketingMetrics,
    initialContentMetrics,
    initialSeoMetrics,
    initialPartnerMetrics,
    initialPrMetrics,
    initialBrandingMetrics,
    initialExternalActivityFeed
} from './data';
import { Dashboard } from './components/Dashboard';
import { ALL_WIDGETS } from './data-widgets';

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
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['TRAFFIC_SOURCES', 'CAMPAIGN_PERFORMANCE']);

  const [productMetrics] = useState(initialProductMetrics);
  const [marketingMetrics] = useState(initialMarketingMetrics);
  const [contentMetrics] = useState(initialContentMetrics);
  const [seoMetrics] = useState(initialSeoMetrics);
  const [partnerMetrics] = useState(initialPartnerMetrics);
  const [prMetrics] = useState(initialPrMetrics);
  const [brandingMetrics] = useState(initialBrandingMetrics);

  const showcaseKpis = useMemo<ShowcaseKpi[]>(() => {
    const organicTraffic = initialSeoMetrics.find(k => k.metric === 'Organic Traffic');
    const leads = initialMarketingMetrics.find(k => k.metric === 'Leads');
    const socialReach = initialBrandingMetrics.find(k => k.metric === 'Social Media Reach');
    const mediaMentions = initialPrMetrics.find(k => k.metric === 'Media Mentions');
    const kpis: (ShowcaseKpi | undefined)[] = [organicTraffic, leads, socialReach, mediaMentions];
    return kpis.filter((kpi): kpi is ShowcaseKpi => !!kpi);
  }, [seoMetrics, marketingMetrics, brandingMetrics, prMetrics]);

  const allKpis = useMemo<SelectableKpi[]>(() => [
    ...productMetrics.map(k => ({ ...k, source: 'Product Analytics' })),
    ...marketingMetrics.map(k => ({ ...k, source: 'Marketing' })),
    ...contentMetrics.map(k => ({ ...k, source: 'Content' })),
    ...seoMetrics.map(k => ({ ...k, source: 'SEO' })),
    ...partnerMetrics.map(k => ({ ...k, source: 'Partners' })),
    ...prMetrics.map(k => ({ ...k, source: 'PR' })),
    ...brandingMetrics.map(k => ({ ...k, source: 'Branding' })),
  ], [productMetrics, marketingMetrics, contentMetrics, seoMetrics, partnerMetrics, prMetrics, brandingMetrics]);

  const availableWidgets = useMemo(() => {
    const activityFeedWidget = { ...ALL_WIDGETS.find(w => w.id === 'ACTIVITY_FEED')!, defaultProps: { activities: initialExternalActivityFeed }};
    return [
      ...ALL_WIDGETS.filter(w => 
        w.id === 'TRAFFIC_SOURCES' || 
        w.id === 'CAMPAIGN_PERFORMANCE' ||
        w.id === 'SALES_FUNNEL'
      ),
      activityFeedWidget,
    ]
  }, []);

  return (
    <Dashboard
        title="External Dashboard"
        description="An overview of your marketing, content, SEO, and branding efforts."
        initialShowcaseKpis={showcaseKpis}
        allKpisForModal={allKpis}
        iconMap={iconMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
