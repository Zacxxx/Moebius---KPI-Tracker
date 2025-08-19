
import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { TrendingDownIcon } from './components/Icons';
import { fmtEuro, EURO } from './utils';
import type { ExpenseItem } from './types';
import { initialExpenses } from './data';

export default function Expenses() {
  const [expenses] = useState<ExpenseItem[]>(initialExpenses);
  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + (item.cost || 0), 0), [expenses]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Operating Expenses</h1>
        <p className="text-zinc-400 mt-1">Track and categorize your monthly spending.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Expense Category</th>
                                    <th scope="col" className="px-6 py-3 text-right">Monthly Cost (€)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((item) => (
                                    <tr key={item.id} className="border-b border-zinc-800">
                                        <td className="px-6 py-4 text-zinc-200">{item.category}</td>
                                        <td className="px-6 py-4 text-zinc-300 text-right">{EURO.format(item.cost)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="text-zinc-200 font-semibold">
                                <tr>
                                    <td className="px-6 py-4 text-right">Total Monthly Expenses</td>
                                    <td className="px-6 py-4 text-right text-lg">{EURO.format(totalExpenses)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </main>
         <aside className="lg:col-span-1">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Expenses</CardTitle>
                    <TrendingDownIcon className="h-5 w-5 text-red-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-white">{fmtEuro(totalExpenses)}</div>
                     <p className="text-xs text-zinc-500 mt-1">Calculated from Data Sources</p>
                </CardContent>
            </Card>
        </aside>
      </div>

    </div>
  );
}