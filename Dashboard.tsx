
import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { LineChartIcon, TrendingUpIcon, UsersIcon } from './components/Icons';
import { initialKpiMetrics } from './data';
import type { SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page } from './types';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Annual Recurring Revenue': LineChartIcon,
    'Active Users': UsersIcon,
    'Customer Lifetime Value (LTV)': TrendingUpIcon,
    'Customer Churn Rate': TrendingUpIcon,
};

interface HomeDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onCiteWidget?: (instance: WidgetInstance, data: any) => void;
}

export default function HomeDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onCiteWidget }: HomeDashboardProps) {
  const [sections, setSections] = useState<DashboardSection[]>([
      { id: 'kpis', title: 'Key Metrics' },
      { id: 'sales', title: 'Sales Overview' },
      { id: 'insights', title: 'Live Insights' },
  ]);
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    const kpiWidgets = initialKpiMetrics.map(kpi => ({
        id: `kpi-home-${kpi.id}`,
        widgetType: 'KPI_VIEW' as const,
        sectionId: 'kpis',
        config: {
            title: kpi.metric,
            selectedKpiId: kpi.id,
            selectedKpiSource: 'Home',
            gridWidth: 1,
        }
    }));

    const salesTrendWidget: WidgetInstance = {
        id: 'premade_sales_trend',
        widgetType: 'TREND_GRAPHIC',
        sectionId: 'sales',
        config: {
            title: 'Sales Trend',
            dataSourceKey: 'sales_trend_data',
            gridWidth: 4,
            gridHeight: 3,
            timeConfig: { type: 'preset', preset: '1y', granularity: 'monthly', offset: 0 }
        }
    };

    const insightsWidgets: WidgetInstance[] = [
        {
            id: 'premade_activity_feed',
            widgetType: 'ACTIVITY_FEED',
            sectionId: 'insights',
            config: {
                title: 'Activity Feed',
                dataSourceKey: 'activity_feed_home',
                gridWidth: 1,
                gridHeight: 2
            }
        },
        {
            id: 'premade_top_products',
            widgetType: 'LIST_VIEW',
            sectionId: 'insights',
            config: {
                title: 'Top Selling Products',
                dataSourceKey: 'top_products_by_sales',
                gridWidth: 1,
                gridHeight: 2
            }
        },
        {
            id: 'premade_sales_funnel',
            widgetType: 'FUNNEL_GRAPHIC',
            sectionId: 'insights',
            config: {
                title: 'Sales Funnel',
                dataSourceKey: 'sales_funnel_data',
                gridWidth: 1,
                gridHeight: 2
            }
        },
        {
            id: 'premade_top_sources',
            widgetType: 'LIST_VIEW',
            sectionId: 'insights',
            config: {
                title: 'Top Referring Sources',
                dataSourceKey: 'top_referring_sources',
                gridWidth: 1,
                gridHeight: 2
            }
        },
    ];

    return [...kpiWidgets, salesTrendWidget, ...insightsWidgets];
  });
  
  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    initialKpiMetrics.map(k => ({ ...k, source: 'Home' }))
  , []);

  return (
    <Dashboard
        title="Home Dashboard"
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