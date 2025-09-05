


import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { TrendingUpIcon, PieChartIcon, ScaleIcon } from './components/Icons';
import { fmtEuro, EURO } from './utils';
import type { RevenueStream, ExpenseItem } from './types';
import { initialRevenueStreams, initialExpenses } from './data';

export default function PNLStatement({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
  const [revenueStreams] = useState<RevenueStream[]>(initialRevenueStreams);
  const [expenses] = useState<ExpenseItem[]>(initialExpenses);

  const calculations = useMemo(() => {
    const totalRevenue = revenueStreams.reduce((sum, item) => sum + item.mrr, 0);
    const cogs = totalRevenue * 0.20; // Assume 20% COGS for SaaS
    const grossProfit = totalRevenue - cogs;
    const totalExpenses = expenses.reduce((sum, item) => sum + item.cost, 0);
    const operatingIncome = grossProfit - totalExpenses;
    const taxes = operatingIncome > 0 ? operatingIncome * 0.25 : 0; // Assume 25% tax rate
    const netIncome = operatingIncome - taxes;

    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const operatingMargin = totalRevenue > 0 ? (operatingIncome / totalRevenue) * 100 : 0;
    const netProfitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    return {
      totalRevenue, cogs, grossProfit, totalExpenses, operatingIncome, taxes, netIncome,
      grossMargin, operatingMargin, netProfitMargin,
    };
  }, [revenueStreams, expenses]);

  const { totalRevenue, cogs, grossProfit, totalExpenses, operatingIncome, taxes, netIncome, grossMargin, operatingMargin, netProfitMargin } = calculations;

  const PnlRow: React.FC<{ label: string; value: number; isSub?: boolean; isTotal?: boolean; isNegative?: boolean; isPositive?: boolean }> = 
    ({ label, value, isSub = false, isTotal = false, isNegative = false, isPositive = false }) => (
    <tr className={`border-b border-zinc-800 ${isTotal ? 'bg-zinc-800/50' : ''}`}>
      <td className={`px-6 py-3 ${isSub ? 'pl-10' : ''} ${isTotal ? 'font-semibold' : ''} text-zinc-300`}>{label}</td>
      <td className={`px-6 py-3 text-right font-mono ${isTotal ? 'font-semibold' : ''} ${isNegative ? 'text-red-400' : isPositive ? 'text-emerald-400' : 'text-zinc-200'}`}>
        {value < 0 ? `(${EURO.format(Math.abs(value))})` : EURO.format(value)}
      </td>
    </tr>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profit & Loss (P&L) Statement</h1>
        <p className="text-zinc-400 mt-1">A monthly financial report summarizing revenues, costs, and expenses.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Margins</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <KpiWidget title="Gross Profit Margin" value={`${grossMargin.toFixed(1)}%`} change="Revenue - COGS" icon={PieChartIcon} iconColor="text-emerald-400" isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
          <KpiWidget title="Operating Margin" value={`${operatingMargin.toFixed(1)}%`} change="Profitability from operations" icon={ScaleIcon} iconColor={operatingMargin >= 0 ? "text-emerald-400" : "text-red-400"} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
          <KpiWidget title="Net Profit Margin" value={`${netProfitMargin.toFixed(1)}%`} change="After all expenses & taxes" icon={TrendingUpIcon} iconColor={netProfitMargin >= 0 ? "text-emerald-400" : "text-red-400"} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
          <KpiWidget title="Net Income" value={fmtEuro(netIncome)} change="The bottom line" icon={TrendingUpIcon} iconColor={netIncome >= 0 ? "text-emerald-400" : "text-red-400"} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Monthly P&L Statement</CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                <PnlRow label="Total Revenue" value={totalRevenue} isPositive />
                <PnlRow label="Cost of Goods Sold (COGS)" value={cogs} isNegative />
                <PnlRow label="Gross Profit" value={grossProfit} isTotal isPositive={grossProfit >= 0} isNegative={grossProfit < 0} />
                
                <tr className="bg-zinc-900/50"><td colSpan={2} className="px-6 py-3 font-semibold text-zinc-100">Operating Expenses</td></tr>
                {expenses.map(item => <PnlRow key={item.id} label={item.category} value={item.cost} isSub />)}
                <PnlRow label="Total Operating Expenses" value={totalExpenses} isTotal isNegative />
                
                <PnlRow label="Operating Income (EBITDA)" value={operatingIncome} isTotal isPositive={operatingIncome >= 0} isNegative={operatingIncome < 0} />
                <PnlRow label="Taxes" value={taxes} isNegative />
                <PnlRow label="Net Income" value={netIncome} isTotal isPositive={netIncome >= 0} isNegative={netIncome < 0} />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}