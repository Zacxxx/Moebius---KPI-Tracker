import React, { useState } from "react";
import { Dashboard } from './components/Dashboard';
import { SimulationContext, type SimulationParams } from './components/dashboard-widgets/SimulationWidgets';
import { useDataset } from './hooks/useDataset';
import { DEFAULTS } from './constants';
import type { DashboardSection, WidgetInstance } from "./types";

export default function FinancialSimulations() {
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

  const simulationContextValue: SimulationParams = {
    arpuCurrent, setArpuCurrent,
    arpuSuper, setArpuSuper,
    usersMin, setUsersMin,
    usersMax, setUsersMax,
    step, setStep,
    focusUsers, setFocusUsers,
    lowBand, setLowBand,
    highBand, setHighBand,
    logArr, setLogArr,
    logValo, setLogValo,
    dataset: data,
  };

  const [sections, setSections] = useState<DashboardSection[]>([
    { id: 'kpis', title: 'Key Metrics' },
    { id: 'charts', title: 'Charts' },
    { id: 'snapshots', title: 'Snapshots' },
  ]);

  const [widgets, setWidgets] = useState<WidgetInstance[]>([
    { id: 'sim_controls', widgetType: 'SIMULATION_CONTROLS', sectionId: 'kpis', config: { title: 'Parameters', gridWidth: 2, gridHeight: 4 }},
    { id: 'sim_kpis', widgetType: 'SIMULATION_KPI_GRID', sectionId: 'kpis', config: { title: 'Simulation KPIs', gridWidth: 2, gridHeight: 4 }},
    { id: 'sim_arr_chart', widgetType: 'SIMULATION_ARR_CHART', sectionId: 'charts', config: { title: 'ARR vs Users', gridWidth: 4, gridHeight: 4 }},
    { id: 'sim_valo_chart', widgetType: 'SIMULATION_VALUATION_CHART', sectionId: 'charts', config: { title: 'Valuation vs Users', gridWidth: 4, gridHeight: 4 }},
    { id: 'sim_arpu_chart', widgetType: 'SIMULATION_ARPU_CHART', sectionId: 'charts', config: { title: 'Annual ARPU Comparison', gridWidth: 4, gridHeight: 3 }},
    { id: 'sim_snapshot_10k', widgetType: 'SIMULATION_SNAPSHOT', sectionId: 'snapshots', config: { title: 'Snapshot — 10,000 users', snapshotUsers: 10000, gridWidth: 2 }},
    { id: 'sim_snapshot_100k', widgetType: 'SIMULATION_SNAPSHOT', sectionId: 'snapshots', config: { title: 'Snapshot — 100,000 users', snapshotUsers: 100000, gridWidth: 2 }},
  ]);

  return (
    <SimulationContext.Provider value={simulationContextValue}>
        <Dashboard
            title="Revenue & Valuation Simulation"
            page="simulation-revenue"
            setPage={() => {}}
            allKpisForModal={[]}
            iconMap={{}}
            widgets={widgets}
            setWidgets={setWidgets}
            sections={sections}
            setSections={setSections}
            globalTimeConfig={{ type: 'preset', preset: '1y', granularity: 'monthly' }}
            setGlobalTimeConfig={() => {}}
        />
    </SimulationContext.Provider>
  );
}
