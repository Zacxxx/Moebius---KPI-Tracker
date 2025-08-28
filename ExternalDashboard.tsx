import React, { useState, useMemo } from 'react';
import { MegaphoneIcon, TrendingUpIcon, SearchIcon, UsersIcon } from './components/Icons';
import type { ShowcaseKpi, SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page, WidgetContext } from './types';
import {
    initialProductMetrics,
    initialMarketingMetrics,
    initialContentMetrics,
    initialSeoMetrics,
    initialPartnerMetrics,
    initialPrMetrics,
    initialBrandingMetrics,
} from './data';
import { Dashboard } from './components/Dashboard';
import { PREMADE_WIDGETS } from './data-widgets';

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

interface ExternalDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext?: (context: WidgetContext) => void;
}

export default function ExternalDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onAttachContext }: ExternalDashboardProps) {
    const [sections, setSections] = useState<DashboardSection[]>([
        { id: 'kpis', title: 'Key Metrics' },
        { id: 'main', title: 'Dashboard Widgets' },
    ]);

    const allKpis = useMemo<SelectableKpi[]>(() => [
        ...initialProductMetrics.map(k => ({ ...k, source: 'Product Analytics' })),
        ...initialMarketingMetrics.map(k => ({ ...k, source: 'Marketing' })),
        ...initialContentMetrics.map(k => ({ ...k, source: 'Content' })),
        ...initialSeoMetrics.map(k => ({ ...k, source: 'SEO' })),
        ...initialPartnerMetrics.map(k => ({ ...k, source: 'Partners' })),
        ...initialPrMetrics.map(k => ({ ...k, source: 'PR' })),
        ...initialBrandingMetrics.map(k => ({ ...k, source: 'Branding' })),
    ], []);

    const showcaseKpis = useMemo<ShowcaseKpi[]>(() => {
        const organicTraffic = initialSeoMetrics.find(k => k.metric === 'Organic Traffic');
        const leads = initialMarketingMetrics.find(k => k.metric === 'Leads');
        const socialReach = initialBrandingMetrics.find(k => k.metric === 'Social Media Reach');
        const mediaMentions = initialPrMetrics.find(k => k.metric === 'Media Mentions');
        const kpis: (ShowcaseKpi | undefined)[] = [organicTraffic, leads, socialReach, mediaMentions];
        return kpis.filter((kpi): kpi is ShowcaseKpi => !!kpi);
    }, []);

    const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
        const kpiWidgets = showcaseKpis.map(kpi => {
            const sourceKpi = allKpis.find(ak => ak.id === kpi.id && ak.metric === kpi.metric);
            return {
                id: `kpi-external-${kpi.id}-${sourceKpi?.source || ''}`,
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
        const otherWidgets = createInitialWidgets(['premade_traffic_sources', 'premade_campaign_performance'], 'main');
        return [...kpiWidgets, ...otherWidgets];
    });

  return (
    <Dashboard
        title="External Dashboard"
        allKpisForModal={allKpis}
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
