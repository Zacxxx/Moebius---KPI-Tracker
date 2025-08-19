import React, { useState, useMemo } from 'react';
import { ClockIcon, TrendingDownIcon, WalletIcon, ScaleIcon } from './components/Icons';
import { fmtEuro } from './utils';
import { KpiWidget } from './components/KpiWidget';
import { initialRevenueStreams, initialExpenses } from './data';
import { Dashboard } from './components/Dashboard';
import { ALL_WIDGETS } from './data-widgets';
import type { SelectableKpi, WidgetType, KpiMetric } from './types';

export default function FinancialPlanning() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['PROJECTION_GRAPHIC']);
  
  const financialKpis = useMemo<KpiMetric[]>(() => {
    const monthlyRevenue = initialRevenueStreams.reduce((sum, item) => sum + (item.mrr || 0), 0);
    const monthlyExpenses = initialExpenses.reduce((sum, item) => sum + (item.cost || 0), 0);
    const initialCashBalance = 1200000;
    const monthlyBurn = monthlyExpenses - monthlyRevenue;
    const cashRunway = (monthlyBurn > 0 && initialCashBalance > 0) ? initialCashBalance / monthlyBurn : Infinity;
    const netIncome = monthlyRevenue - monthlyExpenses;

    return [
       { id: 301, metric: "Cash Runway", value: isFinite(cashRunway) ? `${cashRunway.toFixed(1)} months` : "Profitable", change: "Based on latest data" },
       { id: 302, metric: "Monthly Burn Rate", value: fmtEuro(monthlyBurn), change: "Expenses - Revenue" },
       { id: 303, metric: "Cash Balance", value: fmtEuro(initialCashBalance), change: "Manually set in calculator" },
       { id: 304, metric: "Net Income (Monthly)", value: fmtEuro(netIncome), change: netIncome >= 0 ? "Profitable" : "Cash flow negative" }
    ];
  }, []);
  
  const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    "Cash Runway": ClockIcon,
    "Monthly Burn Rate": TrendingDownIcon,
    "Cash Balance": WalletIcon,
    "Net Income (Monthly)": ScaleIcon,
  };
  
  const iconColorMap: { [key: string]: string } = {
    "Cash Runway": "text-emerald-400",
    "Monthly Burn Rate": "text-red-400",
    "Cash Balance": "text-violet-400",
    "Net Income (Monthly)": financialKpis.find(k => k.metric === "Net Income (Monthly)")?.value.startsWith('€') ? "text-emerald-400" : "text-red-400",
  };
  
  const allKpisForModal = useMemo<SelectableKpi[]>(() => financialKpis.map(k => ({ ...k, source: 'Financials' })), [financialKpis]);
  
  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => w.id === 'PROJECTION_GRAPHIC'), []);

  return (
    <Dashboard
        title="Financial Dashboard"
        description="Monitor your burn rate, cash runway, and overall financial health."
        initialShowcaseKpis={financialKpis}
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        iconColorMap={iconColorMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
