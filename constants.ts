
export const PALETTE = {
  ink: "#0f172a", // slate-900
  grid: "#e5e7eb", // zinc-200
  current: {
    stroke: "#34d399", // emerald-400
    base: "#10b981",   // emerald-500
    light: "#6ee7b7",  // emerald-300
  },
  super: {
    stroke: "#a78bfa", // violet-400
    base: "#8b5cf6",   // violet-500
    light: "#c4b5fd",  // violet-300
  },
};

export const DEFAULTS = {
  usersMin: 10_000,
  usersMax: 100_000,
  step: 5_000,
  focusUsers: 11_600,
  arpuCurrent: 52.24137931, // €/user/year
  arpuSuper: 465.51724138,  // €/user/year
  lowBand: { min: 8, max: 12 },
  highBand: { min: 12, max: 18 },
};