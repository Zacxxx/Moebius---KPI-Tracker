import React, { useState, useMemo } from 'react';
import { ClockIcon, TrendingDownIcon, WalletIcon, ScaleIcon } from './components/Icons';
import { fmtEuro } from './utils';
import { KpiWidget } from './components/KpiWidget';
import { initialRevenueStreams, initialExpenses } from './data';
import { Dashboard } from './Dashboard';
import type { SelectableKpi, WidgetInstance, KpiMetric, DashboardSection, TimeConfig, Page, WidgetContext } from './types';

const projectionGraphicWidget: WidgetInstance = {
    id: 'PROJECTION_GRAPHIC_1', // unique instance id
    widgetType: 'PROJECTION_GRAPHIC',
    sectionId: 'main',
    config: {
        title: 'Cash Runway Projection',
        gridWidth: 3,
        gridHeight: 2,
    }
};

interface FinancialPlanningProps {
    globalTimeConfig: TimeConfig;
    setGlobalTimeConfig: (config: TimeConfig) => void;
    page: Page;
    setPage: (page: Page) => void;
    isKpiSentimentColoringEnabled?: boolean;
    onAttachContext: (context: WidgetContext) => void;
}

export default function FinancialPlanning({ globalTimeConfig, setGlobalTimeConfig, page, setPage, isKpiSentimentColoringEnabled, onAttachContext }: FinancialPlanningProps) {
  const [sections, setSections] = useState<DashboardSection[]>([
      { id: 'kpis', title: 'Key Metrics' },
      { id: 'main', title: 'Dashboard Widgets' },
  ]);
  
  const { financialKpis, netIncome } = useMemo(() => {
    const monthlyRevenue = initialRevenueStreams.reduce((sum, item) => sum + (item.mrr || 0), 0);
    const monthlyExpenses = initialExpenses.reduce((sum, item) => sum + (item.cost || 0), 0);
    const initialCashBalance = 1200000;
    const monthlyBurn = monthlyExpenses - monthlyRevenue;
    const cashRunway = (monthlyBurn > 0 && initialCashBalance > 0) ? initialCashBalance / monthlyBurn : Infinity;
    const netIncomeValue = monthlyRevenue - monthlyExpenses;

    const kpis: KpiMetric[] = [
       { id: 301, metric: "Cash Runway", value: isFinite(cashRunway) ? `${cashRunway.toFixed(1)} months` : "Profitable", change: "Based on latest data" },
       { id: 302, metric: "Monthly Burn Rate", value: fmtEuro(monthlyBurn), change: "Expenses - Revenue" },
       { id: 303, metric: "Cash Balance", value: fmtEuro(initialCashBalance), change: "Manually set in calculator" },
       { id: 304, metric: "Net Income (Monthly)", value: fmtEuro(netIncomeValue), change: netIncomeValue >= 0 ? "Profitable" : "Cash flow negative" }
    ];
    return { financialKpis: kpis, netIncome: netIncomeValue };
  }, []);

  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
      const kpiWidgets = financialKpis.map(kpi => ({
        id: `kpi-financial-${kpi.id}`,
        widgetType: 'KPI_VIEW' as const,
        sectionId: 'kpis',
        config: {
          title: kpi.metric,
          selectedKpiId: kpi.id,
          selectedKpiSource: 'Financials',
          gridWidth: 1,
        }
      }));
      return [...kpiWidgets, projectionGraphicWidget];
  });
  
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
    "Net Income (Monthly)": netIncome >= 0 ? "text-emerald-400" : "text-red-400",
  };

  const allKpisForModal = useMemo<SelectableKpi[]>(() => 
    financialKpis.map(k => ({ ...k, source: 'Financials' }))
  , [financialKpis]);

  return (
    <Dashboard
        title="Financial Planning"
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