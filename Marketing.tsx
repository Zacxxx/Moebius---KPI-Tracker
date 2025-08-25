import React, { useMemo, useState } from 'react';
import { MegaphoneIcon, TrendingUpIcon, WalletIcon, UsersIcon, BarChartIcon } from './components/Icons';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page } from './types';
import { initialMarketingMetrics } from './data';
import { Dashboard } from './components/Dashboard';
import { PREMADE_WIDGETS } from './data-widgets';


const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Leads': MegaphoneIcon,
    'Conversion Rate': TrendingUpIcon,
    'Customer Acquisition Cost (CAC)': WalletIcon,
    'Website Traffic': UsersIcon,
    'Return on Ad Spend (ROAS)': TrendingUpIcon,
    'Click-Through Rate (CTR)': BarChartIcon,
    'Cost Per Click (CPC)': WalletIcon,
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

interface MarketingProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onCiteWidget: (instance: WidgetInstance, data: any) => void;
}

export default function Marketing({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onCiteWidget }: MarketingProps) {
  const [sections, setSections] = useState<DashboardSection[]>([
      { id: 'kpis', title: 'Key Metrics' },
      { id: 'main', title: 'Dashboard Widgets' },
  ]);
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const kpiWidgets = initialMarketingMetrics.map(kpi => ({
        id: `kpi-marketing-${kpi.id}`,
        widgetType: 'KPI_VIEW' as const,
        sectionId: 'kpis',
        config: {
            title: kpi.metric,
            selectedKpiId: kpi.id,
            selectedKpiSource: 'Marketing',
            gridWidth: 1,
        }
    }));
    const otherWidgets = createInitialWidgets(['premade_sales_funnel', 'premade_traffic_sources', 'premade_campaign_performance'], 'main');
    return [...kpiWidgets, ...otherWidgets];
  });
  
  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialMarketingMetrics.map(k => ({ ...k, source: 'Marketing' }))
  , []);

  return (
    <Dashboard
        title="Marketing Dashboard"
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
        isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled}
        onCiteWidget={onCiteWidget}
    />
  );
}