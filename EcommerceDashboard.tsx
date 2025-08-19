import React, { useMemo, useState } from 'react';
import type { EcommerceMetric, SelectableKpi, WidgetType } from './types';
import { BarChartIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon } from './components/Icons';
import { initialEcommerceMetrics } from './data';
import { Dashboard } from './components/Dashboard';
import { ALL_WIDGETS } from './data-widgets';

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


export default function SalesDashboard() {
    const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['SALES_TREND', 'TOP_PRODUCTS', 'TOP_SOURCES']);
    
    const allKpisForModal = useMemo<SelectableKpi[]>(() => 
      initialEcommerceMetrics.map(k => ({ ...k, source: 'E-commerce' }))
    , []);

    const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => 
        w.id === 'SALES_TREND' || w.id === 'TOP_PRODUCTS' || w.id === 'TOP_SOURCES'
    ), []);

    return (
        <Dashboard
            title="Sales Performance Dashboard"
            description="A real-time command center for your online store."
            initialShowcaseKpis={initialEcommerceMetrics}
            allKpisForModal={allKpisForModal}
            iconMap={iconMap}
            iconColorMap={iconColorMap}
            availableWidgets={availableWidgets}
            visibleWidgetIds={visibleWidgetIds}
            setVisibleWidgetIds={setVisibleWidgetIds}
        />
    );
}
