

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { KpiWidget } from './components/KpiWidget';
import { WalletIcon, CreditCardIcon, ScaleIcon } from './components/Icons';
import { EURO } from './utils';

const mockData = {
  assets: {
    current: {
      cash: 850000,
      accountsReceivable: 250000,
      inventory: 50000,
    },
    nonCurrent: {
      propertyAndEquipment: 400000,
    },
  },
  liabilities: {
    current: {
      accountsPayable: 120000,
      shortTermDebt: 75000,
    },
    nonCurrent: {
      longTermDebt: 300000,
    },
  },
  equity: {
    commonStock: 600000,
  }
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-base font-semibold text-zinc-100 px-6 py-3 bg-zinc-900/50 border-b border-zinc-800">{title}</h3>
    <table className="w-full text-sm">
      <tbody>{children}</tbody>
    </table>
  </div>
);

const BalanceRow: React.FC<{ label: string; value: number; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
  <tr className={!isTotal ? "border-b border-zinc-800/50" : ""}>
    <td className={`px-6 py-2.5 ${isTotal ? 'font-semibold' : ''} text-zinc-300`}>{label}</td>
    <td className={`px-6 py-2.5 text-right font-mono ${isTotal ? 'font-semibold text-white' : 'text-zinc-200'}`}>{EURO.format(value)}</td>
  </tr>
);

export default function BalanceSheet({ isKpiSentimentColoringEnabled }: { isKpiSentimentColoringEnabled?: boolean }) {
  const totals = useMemo(() => {
    const totalCurrentAssets = Object.values(mockData.assets.current).reduce((a, b) => a + b, 0);
    const totalNonCurrentAssets = Object.values(mockData.assets.nonCurrent).reduce((a, b) => a + b, 0);
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

    const totalCurrentLiabilities = Object.values(mockData.liabilities.current).reduce((a, b) => a + b, 0);
    const totalNonCurrentLiabilities = Object.values(mockData.liabilities.nonCurrent).reduce((a, b) => a + b, 0);
    const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
    
    // Calculate retained earnings dynamically to ensure balance
    const totalEquityFromAssetsAndLiabilities = totalAssets - totalLiabilities;
    const commonStock = mockData.equity.commonStock;
    const retainedEarnings = totalEquityFromAssetsAndLiabilities - commonStock;
    const totalEquity = commonStock + retainedEarnings;
    
    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    // Ratios
    const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : Infinity;
    const debtToEquityRatio = totalEquity > 0 ? totalLiabilities / totalEquity : Infinity;
    
    return {
      totalCurrentAssets, totalNonCurrentAssets, totalAssets,
      totalCurrentLiabilities, totalNonCurrentLiabilities, totalLiabilities,
      retainedEarnings, totalEquity, totalLiabilitiesAndEquity,
      currentRatio, debtToEquityRatio
    };
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Balance Sheet</h1>
        <p className="text-zinc-400 mt-1">A snapshot of the company's financial health at a specific point in time.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Ratios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <KpiWidget title="Total Assets" value={EURO.format(totals.totalAssets)} change="Assets = Liabilities + Equity" icon={WalletIcon} iconColor="text-emerald-400" isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
          <KpiWidget title="Total Liabilities" value={EURO.format(totals.totalLiabilities)} change="What the company owes" icon={CreditCardIcon} iconColor="text-red-400" isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
          <KpiWidget title="Current Ratio" value={totals.currentRatio.toFixed(2)} change="Liquidity measure" icon={ScaleIcon} iconColor={totals.currentRatio > 2 ? "text-emerald-400" : "text-yellow-400"} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
          <KpiWidget title="Debt-to-Equity" value={totals.debtToEquityRatio.toFixed(2)} change="Company leverage" icon={ScaleIcon} iconColor={totals.debtToEquityRatio < 1 ? "text-emerald-400" : "text-yellow-400"} isKpiSentimentColoringEnabled={isKpiSentimentColoringEnabled} />
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Statement as of Today</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-800 overflow-hidden">
          {/* ASSETS */}
          <div className="bg-zinc-900">
            <Section title="Assets">
              <BalanceRow label="Cash" value={mockData.assets.current.cash} />
              <BalanceRow label="Accounts Receivable" value={mockData.assets.current.accountsReceivable} />
              <BalanceRow label="Inventory" value={mockData.assets.current.inventory} />
              <BalanceRow label="Total Current Assets" value={totals.totalCurrentAssets} isTotal />
              <BalanceRow label="Property & Equipment" value={mockData.assets.nonCurrent.propertyAndEquipment} />
              <BalanceRow label="Total Non-Current Assets" value={totals.totalNonCurrentAssets} isTotal />
            </Section>
             <div className="bg-zinc-800/50">
                <BalanceRow label="Total Assets" value={totals.totalAssets} isTotal />
             </div>
          </div>

          {/* LIABILITIES & EQUITY */}
          <div className="bg-zinc-900">
            <Section title="Liabilities">
              <BalanceRow label="Accounts Payable" value={mockData.liabilities.current.accountsPayable} />
              <BalanceRow label="Short-Term Debt" value={mockData.liabilities.current.shortTermDebt} />
              <BalanceRow label="Total Current Liabilities" value={totals.totalCurrentLiabilities} isTotal />
              <BalanceRow label="Long-Term Debt" value={mockData.liabilities.nonCurrent.longTermDebt} />
              <BalanceRow label="Total Non-Current Liabilities" value={totals.totalNonCurrentLiabilities} isTotal />
            </Section>
             <Section title="Shareholder's Equity">
              <BalanceRow label="Common Stock" value={mockData.equity.commonStock} />
              <BalanceRow label="Retained Earnings" value={totals.retainedEarnings} />
              <BalanceRow label="Total Equity" value={totals.totalEquity} isTotal />
            </Section>
            <div className="bg-zinc-800/50">
              <BalanceRow label="Total Liabilities & Equity" value={totals.totalLiabilitiesAndEquity} isTotal />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}