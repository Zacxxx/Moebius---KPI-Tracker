
import React, { useMemo, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { Label } from "./components/ui/Label";
import { Input } from "./components/ui/Input";
import { Switch } from "./components/ui/Switch";
import { Slider } from "./components/ui/Slider";
import { InfoIcon, LineChartIcon, BarChartIcon, TrendingUpIcon, PaletteIcon, GaugeIcon } from "./components/Icons";
import { DEFAULTS, PALETTE } from './constants';
import { useDataset } from './hooks/useDataset';
import { fmtEuro, EURO_1D, arr, valuations, pctDelta } from './utils';

const KPIStat: React.FC<{
  label: string;
  value: string;
  caption: string;
  tone: "emerald" | "violet";
  icon: React.FC<{ className?: string }>;
  chip: string;
}> = ({ label, value, caption, tone, icon: Icon, chip }) => {
  const colors = {
    emerald: {
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      chipBg: "bg-emerald-500/10",
      chipText: "text-emerald-400",
    },
    violet: {
      text: "text-violet-400",
      border: "border-violet-500/30",
      chipBg: "bg-violet-500/10",
      chipText: "text-violet-400",
    },
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
      <div className={`text-xs font-medium px-2 py-1 rounded-full self-start mt-3 ${selectedTone.chipBg} ${selectedTone.chipText}`}>
        {chip}
      </div>
    </div>
  );
};

const SnapshotCard: React.FC<{
  title: string;
  users: number;
  arpuCurrent: number;
  arpuSuper: number;
  lowBand: { min: number; max: number };
  highBand: { min: number; max: number };
}> = ({ title, users, arpuCurrent, arpuSuper, lowBand, highBand }) => {
  const arrC = arr(users, arpuCurrent);
  const arrS = arr(users, arpuSuper);
  const vC1 = valuations(arrC, lowBand.min, lowBand.max);
  const vC2 = valuations(arrC, highBand.min, highBand.max);
  const vS1 = valuations(arrS, lowBand.min, lowBand.max);
  const vS2 = valuations(arrS, highBand.min, highBand.max);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
          <TrendingUpIcon className="h-4 w-4 text-emerald-400" /> {title}
        </CardTitle>
      </CardHeader>
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

const CustomTooltip: React.FC<{ title: string; lines: Array<[string, string]> }> = ({ title, lines }) => {
  return (
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
};


const ControlNumber: React.FC<{ id: string; label: string; value: number; step?: number; onChange: (v: number) => void }> = ({ id, label, value, step = 0.01, onChange }) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
};


const SwitchRow: React.FC<{ label: string; checked: boolean; onCheckedChange: (c: boolean) => void }> = ({ label, checked, onCheckedChange }) => {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-zinc-300">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};


export default function MoebiusRevenueValuationExplorer() {
  const [arpuCurrent, setArpuCurrent] = useState(DEFAULTS.arpuCurrent);
  const [arpuSuper, setArpuSuper] = useState(DEFAULTS.arpuSuper);
  const [usersMin, setUsersMin] = useState(DEFAULTS.usersMin);
  const [usersMax, setUsersMax] = useState(DEFAULTS.usersMax);
  const [step, setStep] = useState(DEFAULTS.step);
  const [focusUsers, setFocusUsers] = useState(DEFAULTS.focusUsers);
  const [lowBand, setLowBand] = useState(DEFAULTS.lowBand);
  const [highBand, setHighBand] = useState(DEFAULTS.highBand);
  const [logArr, setLogArr] = useState(false);
  const [logValo, setLogValo] = useState(false);

  const data = useDataset(usersMin, usersMax, step, arpuCurrent, arpuSuper, lowBand, highBand);

  const baseUsers = 10_000;
  const arrBaseCurrent = arr(baseUsers, arpuCurrent);
  const arrBaseSuper = arr(baseUsers, arpuSuper);

  const arrFocusCurrent = arr(focusUsers, arpuCurrent);
  const arrFocusSuper = arr(focusUsers, arpuSuper);
  const vFocusC_low = valuations(arrFocusCurrent, lowBand.min, lowBand.max);
  const vFocusS_high = valuations(arrFocusSuper, highBand.min, highBand.max);

  const deltaCurrent = pctDelta(arrFocusCurrent, arrBaseCurrent);
  const deltaSuper = pctDelta(arrFocusSuper, arrBaseSuper);

  const tickFormatter = (value: any) => typeof value === 'number' ? value.toLocaleString("fr-FR") : value;

  return (
    <div className="relative min-h-screen w-full bg-zinc-900 text-zinc-50 overflow-x-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_400px_at_10%_20%,_rgba(124,58,237,0.2),_transparent)]" />
        <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_500px_at_90%_80%,_rgba(16,185,129,0.15),_transparent)]" />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Moebius Revenue & Valuation Explorer</h1>
          <p className="text-base text-zinc-400 mt-2 max-w-3xl mx-auto">Visualize the impact of pricing (<span className="font-medium text-emerald-400">Current</span> vs <span className="font-medium text-violet-400">Supernova</span>) on ARR and valuation across multiple bands.</p>
        </header>

        <section className="mb-8">
           <div className="flex items-center justify-between gap-4 mb-3 px-2">
            <label htmlFor="focus-slider" className="text-sm text-zinc-400">KPIs at <span className="font-semibold text-white">{focusUsers.toLocaleString("fr-FR")}</span> users</label>
           </div>
           <Slider
              id="focus-slider"
              value={[focusUsers]}
              min={usersMin}
              max={usersMax}
              step={100}
              onValueChange={([v]) => setFocusUsers(v)}
            />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPIStat label="ARR Current" value={fmtEuro(arrFocusCurrent)} caption={`Δ vs 10k: ${deltaCurrent >= 0 ? "+" : ""}${deltaCurrent.toFixed(1)}% | MRR ${fmtEuro(arrFocusCurrent / 12)}`} tone="emerald" icon={GaugeIcon} chip="Pricing: Current" />
            <KPIStat label="ARR Supernova" value={fmtEuro(arrFocusSuper)} caption={`Δ vs 10k: ${deltaSuper >= 0 ? "+" : ""}${deltaSuper.toFixed(1)}% | MRR ${fmtEuro(arrFocusSuper / 12)}`} tone="violet" icon={GaugeIcon} chip="Pricing: Supernova" />
            <KPIStat label="Valuation Current (mid)" value={fmtEuro(vFocusC_low.mid)} caption={`${fmtEuro(vFocusC_low.low)} → ${fmtEuro(vFocusC_low.high)}`} tone="emerald" icon={TrendingUpIcon} chip={`Multiple: ${lowBand.min}–${lowBand.max}×`} />
            <KPIStat label="Valuation Supernova (mid)" value={fmtEuro(vFocusS_high.mid)} caption={`${fmtEuro(vFocusS_high.low)} → ${fmtEuro(vFocusS_high.high)}`} tone="violet" icon={TrendingUpIcon} chip={`Multiple: ${highBand.min}–${highBand.max}×`} />
          </div>
        </section>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <ControlNumber id="usersMin" label="Users (min)" value={usersMin} step={1000} onChange={(v) => setUsersMin(Math.max(0, Math.min(v, usersMax - 1)))} />
                <ControlNumber id="usersMax" label="Users (max)" value={usersMax} step={1000} onChange={(v) => setUsersMax(Math.max(v, usersMin + 1))} />
              </div>
              <ControlNumber id="step" label="Step (users)" value={step} step={1000} onChange={setStep} />
              <div className="grid grid-cols-2 gap-4">
                <ControlNumber id="arpuC" label="ARPU Current (€/yr)" value={arpuCurrent} onChange={setArpuCurrent} />
                <ControlNumber id="arpuS" label="ARPU Supernova (€/yr)" value={arpuSuper} onChange={setArpuSuper} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ControlNumber id="lowMin" label="Band 1 (min ×)" value={lowBand.min} step={0.5} onChange={(v) => setLowBand({ ...lowBand, min: v })} />
                <ControlNumber id="lowMax" label="Band 1 (max ×)" value={lowBand.max} step={0.5} onChange={(v) => setLowBand({ ...lowBand, max: v })} />
              </div>
               <div className="grid grid-cols-2 gap-4">
                <ControlNumber id="highMin" label="Band 2 (min ×)" value={highBand.min} step={0.5} onChange={(v) => setHighBand({ ...highBand, min: v })} />
                <ControlNumber id="highMax" label="Band 2 (max ×)" value={highBand.max} step={0.5} onChange={(v) => setHighBand({ ...highBand, max: v })} />
              </div>
              <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-2 gap-4 items-center">
                 <div className="rounded-2xl border border-zinc-700/50 p-4 bg-black/10">
                    <SwitchRow label="Log Scale (ARR)" checked={logArr} onCheckedChange={setLogArr} />
                 </div>
                 <div className="rounded-2xl border border-zinc-700/50 p-4 bg-black/10">
                    <SwitchRow label="Log Scale (Valuation)" checked={logValo} onCheckedChange={setLogValo} />
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SnapshotCard title="Snapshot — 10,000 users" users={10_000} arpuCurrent={arpuCurrent} arpuSuper={arpuSuper} lowBand={lowBand} highBand={highBand} />
          <SnapshotCard title="Snapshot — 100,000 users" users={100_000} arpuCurrent={arpuCurrent} arpuSuper={arpuSuper} lowBand={lowBand} highBand={highBand} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LineChartIcon className="h-4 w-4 text-emerald-400" /> ARR vs Users</CardTitle>
            </CardHeader>
            <CardContent className="h-[360px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                  <XAxis dataKey="users" tickFormatter={tickFormatter} stroke="#71717a" fontSize={12} />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUpIcon className="h-4 w-4 text-violet-400" /> Valuation vs Users</CardTitle>
            </CardHeader>
            <CardContent className="h-[440px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradCurLow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.current.base} stopOpacity={0.4} /><stop offset="100%" stopColor={PALETTE.current.base} stopOpacity={0.05} /></linearGradient>
                    <linearGradient id="gradCurHigh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.current.light} stopOpacity={0.3} /><stop offset="100%" stopColor={PALETTE.current.light} stopOpacity={0.05} /></linearGradient>
                    <linearGradient id="gradSupLow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.super.base} stopOpacity={0.4} /><stop offset="100%" stopColor={PALETTE.super.base} stopOpacity={0.05} /></linearGradient>
                    <linearGradient id="gradSupHigh" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.super.light} stopOpacity={0.3} /><stop offset="100%" stopColor={PALETTE.super.light} stopOpacity={0.05} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.grid} opacity={0.1} />
                  <XAxis dataKey="users" tickFormatter={tickFormatter} stroke="#71717a" fontSize={12} />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChartIcon className="h-4 w-4 text-emerald-400" /> Annual ARPU Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] pt-4">
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
        </div>

        <footer className="mt-12 text-center text-xs text-zinc-500">
          <p>Default Assumptions: ARPU Current = {EURO_1D.format(DEFAULTS.arpuCurrent)}/yr; ARPU Supernova = {EURO_1D.format(DEFAULTS.arpuSuper)}/yr.
          </p>
          <p>Valuation Bands: [{DEFAULTS.lowBand.min}–{DEFAULTS.lowBand.max}]× and [{DEFAULTS.highBand.min}–{DEFAULTS.highBand.max}]×. Palette: Emerald × Violet.</p>
        </footer>
      </main>
    </div>
  );
}