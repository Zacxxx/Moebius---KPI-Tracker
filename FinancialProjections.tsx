
import React, { useState } from 'react';
import FinancialSimulations from './FinancialSimulations';

export default function FinancialProjections() {
  const [activeTab, setActiveTab] = useState('simulation');

  const TabButton = ({ name, label, disabled = false }: { name: string; label: string; disabled?: boolean }) => (
    <button
      onClick={() => !disabled && setActiveTab(name)}
      disabled={disabled}
      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 disabled:cursor-not-allowed ${
        activeTab === name
          ? 'border-violet-400 text-white'
          : 'border-transparent text-zinc-400 hover:text-zinc-200 disabled:text-zinc-600 disabled:hover:border-transparent'
      }`}
    >
      {label}
    </button>
  );
  
  return (
    <div className="mx-auto w-full">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Simulations</h1>
          <p className="text-base text-zinc-400 mt-1">Run simulations to project revenue, valuation, and other key financial metrics.</p>
        </header>
        
        <nav className="border-b border-zinc-700/50">
          <div className="flex items-center gap-2">
            <TabButton name="simulation" label="Revenue & Valuation Simulation" />
            <TabButton name="pnl" label="P&L Statement" disabled />
            <TabButton name="balance_sheet" label="Balance Sheet" disabled />
          </div>
        </nav>

        <div className="mt-8">
            {activeTab === 'simulation' && <FinancialSimulations />}
        </div>
    </div>
  );
}