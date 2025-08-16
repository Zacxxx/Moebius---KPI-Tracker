
import { useMemo } from "react";
import { arr, valuations } from '../utils';

export function useDataset(
  usersMin: number,
  usersMax: number,
  step: number,
  arpuCurrent: number,
  arpuSuper: number,
  lowBand: { min: number; max: number },
  highBand: { min: number; max: number }
) {
  return useMemo(() => {
    const points: any[] = [];
    for (let u = usersMin; u <= usersMax; u += step) {
      const arrC = arr(u, arpuCurrent);
      const arrS = arr(u, arpuSuper);
      const vC_low = valuations(arrC, lowBand.min, lowBand.max);
      const vC_high = valuations(arrC, highBand.min, highBand.max);
      const vS_low = valuations(arrS, lowBand.min, lowBand.max);
      const vS_high = valuations(arrS, highBand.min, highBand.max);
      points.push({
        users: u,
        arrCurrent: arrC,
        arrSuper: arrS,
        vC_low: vC_low.low,
        vC_lowSpan: vC_low.span,
        vC_high: vC_high.low,
        vC_highSpan: vC_high.span,
        vS_low: vS_low.low,
        vS_lowSpan: vS_low.span,
        vS_high: vS_high.low,
        vS_highSpan: vS_high.span,
      });
    }
    // ensure the max value is always in the dataset
    if ((usersMax - usersMin) % step !== 0) {
       const u = usersMax;
       const arrC = arr(u, arpuCurrent);
       const arrS = arr(u, arpuSuper);
       const vC_low = valuations(arrC, lowBand.min, lowBand.max);
       const vC_high = valuations(arrC, highBand.min, highBand.max);
       const vS_low = valuations(arrS, lowBand.min, lowBand.max);
       const vS_high = valuations(arrS, highBand.min, highBand.max);
       points.push({
         users: u,
         arrCurrent: arrC,
         arrSuper: arrS,
         vC_low: vC_low.low,
         vC_lowSpan: vC_low.span,
         vC_high: vC_high.low,
         vC_highSpan: vC_high.span,
         vS_low: vS_low.low,
         vS_lowSpan: vS_low.span,
         vS_high: vS_high.low,
         vS_highSpan: vS_high.span,
       });
    }
    return points;
  }, [usersMin, usersMax, step, arpuCurrent, arpuSuper, lowBand, highBand]);
}