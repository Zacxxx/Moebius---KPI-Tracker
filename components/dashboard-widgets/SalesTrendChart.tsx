import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PALETTE } from '../../constants';
import { fmtEuro } from '../../utils';

const salesTrendData = [
  { name: 'Jan', Sales: 4000, Orders: 2400 },
  { name: 'Feb', Sales: 3000, Orders: 1398 },
  { name: 'Mar', Sales: 5000, Orders: 9800 },
  { name: 'Apr', Sales: 4780, Orders: 3908 },
  { name: 'May', Sales: 5890, Orders: 4800 },
  { name: 'Jun', Sales: 4390, Orders: 3800 },
  { name: 'Jul', Sales: 5490, Orders: 4300 },
];

export const SalesTrendChart: React.FC = () => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Sales Trend (YTD)</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                         <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={PALETTE.super.base} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={PALETTE.super.base} stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                        <YAxis tickFormatter={fmtEuro} stroke="#71717a" fontSize={12} />
                        <Tooltip
                          cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }}
                          content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                  return (
                                      <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-lg p-3 shadow-2xl text-zinc-200">
                                          <p className="text-xs font-bold mb-1">{label}</p>
                                          <p className="text-sm font-medium text-white">{`Sales: ${fmtEuro(payload[0].value as number)}`}</p>
                                      </div>
                                  );
                              }
                              return null;
                          }}
                        />
                        <Area type="monotone" dataKey="Sales" stroke={PALETTE.super.stroke} fill="url(#salesGradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
