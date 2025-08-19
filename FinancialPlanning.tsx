
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { ClockIcon, TrendingDownIcon, WalletIcon, ScaleIcon } from './components/Icons';
import { Label } from './components/ui/Label';
import { Input } from './components/ui/Input';
import { fmtEuro, EURO } from './utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { PALETTE } from './constants';
import { KpiWidget } from './components/KpiWidget';
import { initialRevenueStreams, initialExpenses } from './data';

// Interactive Runway Calculator Component
const RunwayCalculator: React.FC<{ monthlyRevenue: number, monthlyExpenses: number }> = ({ monthlyRevenue, monthlyExpenses }) => {
    const [cashBalance, setCashBalance] = useState(1200000);

    const monthlyBurn = monthlyExpenses - monthlyRevenue;
    const cashRunway = (monthlyBurn > 0 && cashBalance > 0) ? cashBalance / monthlyBurn : Infinity;

    const projectionData = useMemo(() => {
        const data = [];
        let currentBalance = cashBalance;
        const today = new Date();

        for (let i = 0; i <= 24; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthLabel = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            data.push({
                month: monthLabel,
                balance: currentBalance,
            });
            if (currentBalance > 0 || i === 0) {
                 currentBalance -= monthlyBurn;
            }
             if(currentBalance < 0){
                currentBalance = 0;
            }
        }
        return data;
    }, [cashBalance, monthlyBurn]);

    const formatCurrency = (value: number) => EURO.format(value);

    return (
        <Card>
            <CardHeader><CardTitle>Cash Runway Projection</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="cash-balance">Current Cash Balance (€)</Label>
                            <Input id="cash-balance" type="number" value={cashBalance} onChange={e => setCashBalance(Number(e.target.value))} />
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                            <div>
                                <p className="text-sm text-zinc-400">Monthly Recurring Revenue</p>
                                <p className="text-lg font-semibold text-emerald-400">{fmtEuro(monthlyRevenue)}</p>
                            </div>
                             <div>
                                <p className="text-sm text-zinc-400">Monthly Operating Expenses</p>
                                <p className="text-lg font-semibold text-red-400">{fmtEuro(monthlyExpenses)}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 space-y-3">
                            <div>
                                <p className="text-sm text-zinc-400">Net Monthly Burn</p>
                                <p className={`text-xl font-bold ${monthlyBurn >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>{fmtEuro(Math.abs(monthlyBurn))}</p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Cash Runway</p>
                                <p className="text-xl font-bold text-white">
                                    {isFinite(cashRunway) ? `${cashRunway.toFixed(1)} months` : 'Infinite / Profitable'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Chart */}
                    <div className="lg:col-span-2 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PALETTE.super.base} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={PALETTE.super.base} stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                                <XAxis dataKey="month" stroke="#71717a" fontSize={12} interval={2} />
                                <YAxis tickFormatter={fmtEuro} stroke="#71717a" fontSize={12} domain={[0, 'dataMax']} />
                                <Tooltip
                                  cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }}
                                  content={({ active, payload, label }) => {
                                      if (active && payload && payload.length) {
                                          return (
                                              <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-lg p-3 shadow-2xl text-zinc-200">
                                                  <p className="text-xs font-bold mb-1">{label}</p>
                                                  <p className="text-sm font-medium text-white">{`Balance: ${formatCurrency(payload[0].value as number)}`}</p>
                                              </div>
                                          );
                                      }
                                      return null;
                                  }}
                                />
                                <ReferenceLine y={0} stroke="#f87171" strokeWidth={1.5} strokeDasharray="3 3" />
                                <Area type="monotone" dataKey="balance" stroke={PALETTE.super.stroke} fill="url(#balanceGradient)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function FinancialPlanning() {
  const [revenueStreams] = useState(initialRevenueStreams);
  const [expenses] = useState(initialExpenses);

  const monthlyRevenue = useMemo(() => revenueStreams.reduce((sum, item) => sum + (item.mrr || 0), 0), [revenueStreams]);
  const monthlyExpenses = useMemo(() => expenses.reduce((sum, item) => sum + (item.cost || 0), 0), [expenses]);
  
  const initialCashBalance = 1200000;
  
  const monthlyBurn = monthlyExpenses - monthlyRevenue;
  const cashRunway = (monthlyBurn > 0 && initialCashBalance > 0) ? initialCashBalance / monthlyBurn : Infinity;
  const netIncome = monthlyRevenue - monthlyExpenses;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Financial Dashboard</h1>
        <p className="text-zinc-400 mt-1">Monitor your burn rate, cash runway, and overall financial health.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-zinc-200 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiWidget title="Cash Runway" value={isFinite(cashRunway) ? `${cashRunway.toFixed(1)} months` : "Profitable"} change="Based on latest data" icon={ClockIcon} iconColor={isFinite(cashRunway) && cashRunway < 12 ? "text-red-400" : "text-emerald-400" } />
            <KpiWidget title="Monthly Burn Rate" value={fmtEuro(monthlyBurn)} change="Expenses - Revenue" icon={TrendingDownIcon} iconColor="text-red-400" />
            <KpiWidget title="Cash Balance" value={fmtEuro(initialCashBalance)} change="Manually set in calculator" icon={WalletIcon} iconColor="text-violet-400" />
            <KpiWidget title="Net Income (Monthly)" value={fmtEuro(netIncome)} change={netIncome >= 0 ? "Profitable" : "Cash flow negative"} icon={ScaleIcon} iconColor={netIncome >= 0 ? "text-emerald-400" : "text-red-400"} />
        </div>
      </section>

      <section>
        <RunwayCalculator monthlyRevenue={monthlyRevenue} monthlyExpenses={monthlyExpenses} />
      </section>
    </div>
  );
}