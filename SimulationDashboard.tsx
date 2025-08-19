import React, { useMemo, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ClockIcon, TrendingDownIcon, TrendingUpIcon, PieChartIcon } from './components/Icons';
import { initialRevenueStreams, initialExpenses } from './data';
import type { KpiMetric, SelectableKpi, WidgetType } from './types';
import { fmtEuro } from './utils';
import { ALL_WIDGETS } from './data-widgets';

// These KPIs are derived. For the dashboard, we'll create static versions based on the initial data.
const createSimulationKpis = (): KpiMetric[] => {
    const monthlyRevenue = initialRevenueStreams.reduce((sum, item) => sum + (item.mrr || 0), 0);
    const monthlyExpenses = initialExpenses.reduce((sum, item) => sum + (item.cost || 0), 0);
    const initialCashBalance = 1200000;
    const monthlyBurn = monthlyExpenses - monthlyRevenue;
    const cashRunway = (monthlyBurn > 0 && initialCashBalance > 0) ? initialCashBalance / monthlyBurn : Infinity;
    const netIncome = monthlyRevenue - monthlyExpenses;

    // From P&L
    const totalRevenue = monthlyRevenue;
    const cogs = totalRevenue * 0.20;
    const grossProfit = totalRevenue - cogs;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    return [
        { id: 101, metric: 'Cash Runway', value: isFinite(cashRunway) ? `${cashRunway.toFixed(1)} months` : "Profitable", change: "Based on latest data" },
        { id: 102, metric: 'Monthly Burn Rate', value: fmtEuro(monthlyBurn), change: "Expenses - Revenue" },
        { id: 103, metric: 'Net Income (Monthly)', value: fmtEuro(netIncome), change: netIncome >= 0 ? "Profitable" : "Cash flow negative" },
        { id: 104, metric: 'Gross Profit Margin', value: `${grossMargin.toFixed(1)}%`, change: "Revenue - COGS" },
    ];
};

const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    'Cash Runway': ClockIcon,
    'Monthly Burn Rate': TrendingDownIcon,
    'Net Income (Monthly)': TrendingUpIcon,
    'Gross Profit Margin': PieChartIcon,
};

export default function SimulationDashboard() {
  const [visibleWidgetIds, setVisibleWidgetIds] = useState<WidgetType[]>(['PROJECTION_GRAPHIC']);
  const simulationKpis = useMemo(() => createSimulationKpis(), []);
  
  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    simulationKpis.map(k => ({ ...k, source: 'Simulation' }))
  , [simulationKpis]);

  const availableWidgets = useMemo(() => ALL_WIDGETS.filter(w => w.id === 'PROJECTION_GRAPHIC'), []);

  return (
    <Dashboard
        title="Simulation Dashboard"
        description="An overview of your business's key financial simulations and projections."
        initialShowcaseKpis={simulationKpis}
        allKpisForModal={allKpisForModal}
        iconMap={iconMap}
        availableWidgets={availableWidgets}
        visibleWidgetIds={visibleWidgetIds}
        setVisibleWidgetIds={setVisibleWidgetIds}
    />
  );
}
