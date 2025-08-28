import React, { createContext, useContext } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Switch } from "../ui/Switch";
import { Slider } from "../ui/Slider";
import { LineChartIcon, BarChartIcon, TrendingUpIcon, GaugeIcon } from "../Icons";
import { DEFAULTS, PALETTE } from '../../constants';
import { fmtEuro, EURO_1D, arr, valuations, pctDelta } from '../../utils';
import type { GenericWidgetProps } from '../../types';
import { WidgetHeader } from './ProductStockWidget';


// --- CONTEXT for Simulation Parameters ---

export interface SimulationParams {
    arpuCurrent: number;
    setArpuCurrent: (n: number) => void;
    arpuSuper: number;
    setArpuSuper: (n: number) => void;
    usersMin: number;
    setUsersMin: (n: number) => void;
    usersMax: number;
    setUsersMax: (n: number) => void;
    step: number;
    setStep: (n: number) => void;
    focusUsers: number;
    setFocusUsers: (n: number) => void;
    lowBand: { min: number; max: number };
    setLowBand: (b: { min: number; max: number }) => void;
    highBand: { min: number; max: number };
    setHighBand: (b: { min: number; max: number }) => void;
    logArr: boolean;
    setLogArr: (b: boolean) => void;
    logValo: boolean;
    setLogValo: (b: boolean) => void;
    dataset: any[];
}

export const SimulationContext = createContext<SimulationParams | null>(null);

export const useSimulation = () => {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }
    return context;
};


// --- HELPER COMPONENTS (local to this file) ---

const KPIStat: React.FC<{
  label: string;
  value: string;
  caption: string;
  tone: "emerald" | "violet";
  icon: React.FC<{ className?: string }>;
  chip: string;
}> = ({ label, value, caption, tone, icon: Icon, chip }) => {
  const colors = {
    emerald: { text: "text-emerald-400", border: "border-emerald-500/30", chipBg: "bg-emerald-500/10", chipText: "text-emerald-400" },
    violet: { text: "text-violet-400", border: "border-violet-500/30", chipBg: "bg-violet-500/10", chipText: "text-violet-400" },
  };
  const selectedTone = colors[tone];

  return (
    <div className={`p-4 rounded-3xl bg-black/10 backdrop-blur-xl border ${selectedTone.border} flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between text-zinc-400 text-sm mb-2">
          <span>{label}</span>
          <Icon className={`h-5 w-5 ${selectedTone.text}`} />
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-zinc-500 mt-1">{caption}</div>
      </div>
      <div className={`text-xs font-medium px-2 py-1 rounded-full self-start mt-3 ${selectedTone.chipBg} ${selectedTone.chipText}`}>{chip}</div>
    </div>
  );
};

const CustomTooltip: React.FC<{ title: string; lines: Array<[string, string]> }> = ({ title, lines }) => (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-lg p-3 shadow-2xl text-zinc-200">
      <div className="text-xs font-bold mb-2">{title}</div>
      <div className="space-y-1">
      {lines.map(([key, value], i) => (
        <div key={i} className="text-xs flex items-center justify-between gap-4">
          <span className="text-zinc-400 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-violet-400'}`}></span>
            {key}
          </span>
          <span className="font-medium text-white">{value}</span>
        </div>
      ))}
      </div>
    </div>
);

const ControlNumber: React.FC<{ id: string; label: string; value: number; step?: number; onChange: (v: number) => void }> = ({ id, label, value, step = 0.01, onChange }) => (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
);

const SwitchRow: React.FC<{ label: string; checked: boolean; onCheckedChange: (c: boolean) => void }> = ({ label, checked, onCheckedChange }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-zinc-300">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
);

// --- WIDGET COMPONENTS ---

export const SimulationControlsWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, onCite }) => {
    const { title } = instance.config;
    const sim = useSimulation();

    return (
        <Card className="h-full">
            <CardHeader><WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} /></CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <ControlNumber id="usersMin" label="Users (min)" value={sim.usersMin} step={1000} onChange={(v) => sim.setUsersMin(Math.max(0, Math.min(v, sim.usersMax - 1)))} />
                        <ControlNumber id="usersMax" label="Users (max)" value={sim.usersMax} step={1000} onChange={(v) => sim.setUsersMax(Math.max(v, sim.usersMin + 1))} />
                    </div>
                    <ControlNumber id="step" label="Step (users)" value={sim.step} step={1000} onChange={sim.setStep} />
                    <div className="grid grid-cols-2 gap-4">
                        <ControlNumber id="arpuC" label="ARPU Current (€/yr)" value={sim.arpuCurrent} onChange={sim.setArpuCurrent} />
                        <ControlNumber id="arpuS" label="ARPU Supernova (€/yr)" value={sim.arpuSuper} onChange={sim.setArpuSuper} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ControlNumber id="lowMin" label="Band 1 (min ×)" value={sim.lowBand.min} step={0.5} onChange={(v) => sim.setLowBand({ ...sim.lowBand, min: v })} />
                        <ControlNumber id="lowMax" label="Band 1 (max ×)" value={sim.lowBand.max} step={0.5} onChange={(v) => sim.setLowBand({ ...sim.lowBand, max: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ControlNumber id="highMin" label="Band 2 (min ×)" value={sim.highBand.min} step={0.5} onChange={(v) => sim.setHighBand({ ...sim.highBand, min: v })} />
                        <ControlNumber id="highMax" label="Band 2 (max ×)" value={sim.highBand.max} step={0.5} onChange={(v) => sim.setHighBand({ ...sim.highBand, max: v })} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-zinc-700/50 p-4 bg-black/10"><SwitchRow label="Log Scale (ARR)" checked={sim.logArr} onCheckedChange={sim.setLogArr} /></div>
                    <div className="rounded-2xl border border-zinc-700/50 p-4 bg-black/10"><SwitchRow label="Log Scale (Valuation)" checked={sim.logValo} onCheckedChange={sim.setLogValo} /></div>
                </div>
            </CardContent>
        </Card>
    );
};

export const SimulationKpiGridWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, onCite }) => {
    const { title } = instance.config;
    const sim = useSimulation();
    
    const baseUsers = 10_000;
    const arrBaseCurrent = arr(baseUsers, sim.arpuCurrent);
    const arrBaseSuper = arr(baseUsers, sim.arpuSuper);

    const arrFocusCurrent = arr(sim.focusUsers, sim.arpuCurrent);
    const arrFocusSuper = arr(sim.focusUsers, sim.arpuSuper);
    const vFocusC_low = valuations(arrFocusCurrent, sim.lowBand.min, sim.lowBand.max);
    const vFocusS_high = valuations(arrFocusSuper, sim.highBand.min, sim.highBand.max);

    const deltaCurrent = pctDelta(arrFocusCurrent, arrBaseCurrent);
    const deltaSuper = pctDelta(arrFocusSuper, arrBaseSuper);

    return (
        <Card className="h-full">
            <CardHeader><WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} /></CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-4 mb-3 px-2">
                    <label htmlFor="focus-slider" className="text-sm text-zinc-400">KPIs at <span className="font-semibold text-white">{sim.focusUsers.toLocaleString("fr-FR")}</span> users</label>
                </div>
                <Slider id="focus-slider" value={[sim.focusUsers]} min={sim.usersMin} max={sim.usersMax} step={100} onValueChange={([v]) => sim.setFocusUsers(v)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <KPIStat label="ARR Current" value={fmtEuro(arrFocusCurrent)} caption={`Δ vs 10k: ${deltaCurrent >= 0 ? "+" : ""}${deltaCurrent.toFixed(1)}%`} tone="emerald" icon={GaugeIcon} chip="Pricing: Current" />
                    <KPIStat label="ARR Supernova" value={fmtEuro(arrFocusSuper)} caption={`Δ vs 10k: ${deltaSuper >= 0 ? "+" : ""}${deltaSuper.toFixed(1)}%`} tone="violet" icon={GaugeIcon} chip="Pricing: Supernova" />
                    <KPIStat label="Valuation Current (mid)" value={fmtEuro(vFocusC_low.mid)} caption={`${fmtEuro(vFocusC_low.low)} → ${fmtEuro(vFocusC_low.high)}`} tone="emerald" icon={TrendingUpIcon} chip={`Multiple: ${sim.lowBand.min}–${sim.lowBand.max}×`} />
                    <KPIStat label="Valuation Supernova (mid)" value={fmtEuro(vFocusS_high.mid)} caption={`${fmtEuro(vFocusS_high.low)} → ${fmtEuro(vFocusS_high.high)}`} tone="violet" icon={TrendingUpIcon} chip={`Multiple: ${sim.highBand.min}–${sim.highBand.max}×`} />
                </div>
            </CardContent>
        </Card>
    );
};

export const SimulationArrChartWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, onCite }) => {
    const { title } = instance.config;
    const { dataset, logArr } = useSimulation();
    return (
        <Card className="h-full flex flex-col">
            <CardHeader><WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} /></CardHeader>
            <CardContent className="flex-1 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dataset} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                        <XAxis dataKey="users" tickFormatter={(v) => v.toLocaleString("fr-FR")} stroke="#71717a" fontSize={12} />
                        <YAxis tickFormatter={fmtEuro} stroke="#71717a" fontSize={12} scale={logArr ? "log" : undefined} domain={["auto", "auto"]} />
                        <Tooltip cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }} content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            const p = payload.reduce((acc: any, d: any) => ({ ...acc, [d.dataKey]: d.value }), {});
                            return <CustomTooltip title={`${label.toLocaleString("fr-FR")} users`} lines={[["ARR Current", fmtEuro(p.arrCurrent)], ["ARR Supernova", fmtEuro(p.arrSuper)]]} />;
                        }} />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}/>
                        <Line type="monotone" dataKey="arrCurrent" name="Current" stroke={PALETTE.current.stroke} strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="arrSuper" name="Supernova" stroke={PALETTE.super.stroke} strokeWidth={2.5} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const SimulationValuationChartWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, onCite }) => {
    const { title } = instance.config;
    const { dataset, logValo, lowBand, highBand } = useSimulation();
    return (
        <Card className="h-full flex flex-col">
            <CardHeader><WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} /></CardHeader>
            <CardContent className="flex-1 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataset} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="gradCurLow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.current.base} stopOpacity={0.4} /><stop offset="100%" stopColor={PALETTE.current.base} stopOpacity={0.05} /></linearGradient>
                            <linearGradient id="gradSupLow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.super.base} stopOpacity={0.4} /><stop offset="100%" stopColor={PALETTE.super.base} stopOpacity={0.05} /></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                        <XAxis dataKey="users" tickFormatter={(v) => v.toLocaleString("fr-FR")} stroke="#71717a" fontSize={12} />
                        <YAxis tickFormatter={fmtEuro} stroke="#71717a" fontSize={12} scale={logValo ? "log" : undefined} domain={["auto", "auto"]} />
                        <Tooltip cursor={{ stroke: PALETTE.grid, strokeOpacity: 0.2 }} content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            const p = payload[0].payload;
                            return <CustomTooltip title={`Valuation — ${label.toLocaleString("fr-FR")} users`} lines={[
                                [`Current ${lowBand.min}–${lowBand.max}×`, `${fmtEuro(p.vC_low)} → ${fmtEuro(p.vC_low + p.vC_lowSpan)}`],
                                [`Supernova ${lowBand.min}–${lowBand.max}×`, `${fmtEuro(p.vS_low)} → ${fmtEuro(p.vS_low + p.vS_lowSpan)}`],
                                [`Current ${highBand.min}–${highBand.max}×`, `${fmtEuro(p.vC_high)} → ${fmtEuro(p.vC_high + p.vC_highSpan)}`],
                                [`Supernova ${highBand.min}–${highBand.max}×`, `${fmtEuro(p.vS_high)} → ${fmtEuro(p.vS_high + p.vS_highSpan)}`],
                            ]} />;
                        }} />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}/>
                        <Area type="monotone" dataKey="vC_low" stackId="1" name={`Current ${lowBand.min}-${lowBand.max}x`} stroke={PALETTE.current.base} fill="url(#gradCurLow)" />
                        <Area type="monotone" dataKey="vC_lowSpan" stackId="1" name="" stroke={PALETTE.current.base} fill="url(#gradCurLow)" />
                        <Area type="monotone" dataKey="vS_low" stackId="2" name={`Supernova ${lowBand.min}-${lowBand.max}x`} stroke={PALETTE.super.base} fill="url(#gradSupLow)" />
                        <Area type="monotone" dataKey="vS_lowSpan" stackId="2" name="" stroke={PALETTE.super.base} fill="url(#gradSupLow)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const SimulationArpuChartWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, onCite }) => {
    const { title } = instance.config;
    const { arpuCurrent, arpuSuper } = useSimulation();
    return (
        <Card className="h-full flex flex-col">
            <CardHeader><WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} /></CardHeader>
            <CardContent className="flex-1 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: "ARPU", current: arpuCurrent, super: arpuSuper }]} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                        <YAxis tickFormatter={(v) => EURO_1D.format(v)} stroke="#71717a" fontSize={12} />
                        <Tooltip cursor={{ fill: 'rgba(113, 113, 122, 0.1)' }} content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;
                            const p = payload.reduce((acc: any, d: any) => ({ ...acc, [d.dataKey]: d.value }), {});
                            return <CustomTooltip title="ARPU (€/year)" lines={[["Current", EURO_1D.format(p.current)], ["Supernova", EURO_1D.format(p.super)]]} />;
                        }} />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}/>
                        <Bar dataKey="current" name="Current" radius={[8, 8, 0, 0]} fill={PALETTE.current.base} />
                        <Bar dataKey="super" name="Supernova" radius={[8, 8, 0, 0]} fill={PALETTE.super.base} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const SimulationSnapshotWidget: React.FC<GenericWidgetProps> = ({ instance, onConfigure, onCite }) => {
    const { title, snapshotUsers = 10000 } = instance.config;
    const { arpuCurrent, arpuSuper, lowBand, highBand } = useSimulation();

    const arrC = arr(snapshotUsers, arpuCurrent);
    const arrS = arr(snapshotUsers, arpuSuper);
    const vC1 = valuations(arrC, lowBand.min, lowBand.max);
    const vC2 = valuations(arrC, highBand.min, highBand.max);
    const vS1 = valuations(arrS, lowBand.min, lowBand.max);
    const vS2 = valuations(arrS, highBand.min, highBand.max);

    return (
        <Card className="h-full">
            <CardHeader className="pb-2"><WidgetHeader title={title} onConfigure={onConfigure} onCite={onCite} /></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                    <div className="text-xs text-zinc-400 mb-1">ARR Current</div>
                    <div className="text-base font-semibold text-white">{fmtEuro(arrC)}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">Valo: {fmtEuro(vC1.low)}–{fmtEuro(vC1.high)} ({lowBand.min}–{lowBand.max}×)</div>
                    <div className="text-[11px] text-zinc-500">Valo: {fmtEuro(vC2.low)}–{fmtEuro(vC2.high)} ({highBand.min}–{highBand.max}×)</div>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20">
                    <div className="text-xs text-zinc-400 mb-1">ARR Supernova</div>
                    <div className="text-base font-semibold text-white">{fmtEuro(arrS)}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">Valo: {fmtEuro(vS1.low)}–{fmtEuro(vS1.high)} ({lowBand.min}–{lowBand.max}×)</div>
                    <div className="text-[11px] text-zinc-500">Valo: {fmtEuro(vS2.low)}–{fmtEuro(vS2.high)} ({highBand.min}–{highBand.max}×)</div>
                </div>
            </CardContent>
        </Card>
    );
};
