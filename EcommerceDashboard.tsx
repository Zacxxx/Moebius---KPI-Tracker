import React, { useMemo, useState } from 'react';
import type { EcommerceMetric, SelectableKpi, WidgetInstance, DashboardSection, TimeConfig, Page, WidgetContext } from './types';
import { BarChartIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from './components/Icons';
import { initialEcommerceMetrics } from './data';
import { Dashboard } from './components/Dashboard';
import { PREMADE_WIDGETS } from './data-widgets';

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Gross Merchandise Volume': TrendingUpIcon,
    'Average Order Value': WalletIcon,
    'Conversion Rate': BarChartIcon,
    'Cart Abandonment Rate': TrendingDownIcon,
};

const iconColorMap: { [key: string]: string } = {
    'Gross Merchandise Volume': 'text-emerald-400',
    'Average Order Value': 'text-emerald-400',
    'Conversion Rate': 'text-emerald-400',
    'Cart Abandonment Rate': 'text-red-400',
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

interface SalesDashboardProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext?: (context: WidgetContext) => void;
}

export default function SalesDashboard({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onAttachContext }: SalesDashboardProps) {
    const [sections, setSections] = useState<DashboardSection[]>([
        { id: 'kpis', title: 'Key Metrics' },
        { id: 'main', title: 'Dashboard Widgets' },
    ]);
    const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
        const kpiWidgets = initialEcommerceMetrics.map(kpi => ({
            id: `kpi-ecommerce-${kpi.id}`,
            widgetType: 'KPI_VIEW' as const,
            sectionId: 'kpis',
            config: {
                title: kpi.metric,
                selectedKpiId: kpi.id,
                selectedKpiSource: 'E-commerce',
                gridWidth: 1,
            }
        }));
        const otherWidgets = createInitialWidgets(['premade_sales_trend', 'premade_top_products', 'premade_top_sources'], 'main');
        return [...kpiWidgets, ...otherWidgets];
    });
    
    const allKpisForModal = useMemo<SelectableKpi[]>(() => 
      initialEcommerceMetrics.map(k => ({ ...k, source: 'E-commerce' }))
    , []);

    return (
        <Dashboard
            title="Sales Performance Dashboard"
            allKpisForModal={allKpisForModal}
            iconMap={iconMap}
            iconColorMap={iconColorMap}
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
