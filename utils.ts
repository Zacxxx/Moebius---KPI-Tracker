
import type { WidgetInstance, SelectableKpi, Page, NavItemData } from './types';

export const EURO = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const EURO_1D = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 1,
});

export function fmtEuro(n: number): string {
  if (n >= 1_000_000_000) return EURO_1D.format(n / 1_000_000_000).replace(/\s?€/, "Md€");
  if (n >= 1_000_000) return EURO_1D.format(n / 1_000_000).replace(/\s?€/, "M€");
  if (n >= 1_000) return EURO_1D.format(n / 1_000).replace(/\s?€/, "k€");
  return EURO.format(n);
}

export function arr(users: number, arpu: number): number {
  return users * arpu;
}

export function valuations(ARR: number, multMin: number, multMax: number) {
  const low = ARR * multMin;
  const high = ARR * multMax;
  return { low, high, span: high - low, mid: (low + high) / 2 };
}

export function pctDelta(now: number, base: number): number {
  if (!base) return 0;
  return ((now - base) / base) * 100;
}

export function formatWidgetDataForAI(widgetInstance: WidgetInstance, widgetData: any): string {
    const title = widgetInstance.config.title;
    switch (widgetInstance.widgetType) {
        case 'KPI_VIEW': {
            const kpi = widgetData as SelectableKpi;
            return kpi ? `KPI titled "${title}" shows: Metric: ${kpi.metric}, Current Value: ${kpi.value}, Change: ${kpi.change}.` : `Data for KPI "${title}" is not available.`;
        }
        case 'TABLE_VIEW': {
            if (!widgetData || widgetData.length === 0) return `Table "${title}" is empty.`;
            const headers = Object.keys(widgetData[0]).filter(k => k !== 'id');
            let table = `Data from table "${title}":\n`;
            table += headers.join(' | ') + '\n';
            table += headers.map(() => '---').join(' | ') + '\n';
            widgetData.slice(0, 5).forEach((row: any) => { // limit to 5 rows for brevity
                table += headers.map(h => row[h]).join(' | ') + '\n';
            });
            return table;
        }
        case 'TREND_GRAPHIC': {
            if (!widgetData || widgetData.length < 2) return `Trend graphic "${title}" has insufficient data.`;
            const first = widgetData[0];
            const last = widgetData[widgetData.length - 1];
            const values = widgetData.map((d: any) => d.Sales);
            const peak = Math.max(...values);
            return `Time series data for "${title}" from ${first.date} to ${last.date}. It starts at ${fmtEuro(first.Sales)}, ends at ${fmtEuro(last.Sales)}, and peaked at ${fmtEuro(peak)}.`;
        }
        case 'LIST_VIEW': {
             if (!widgetData || widgetData.length === 0) return `List "${title}" is empty.`;
             let list = `Data from list "${title}":\n`;
             widgetData.slice(0, 5).forEach((item: any, index: number) => {
                list += `${index + 1}. ${item.name} (${item.value})\n`;
             });
             return list;
        }
        default:
            try {
                const summary = JSON.stringify(widgetData, null, 2);
                return `Widget "${title}" of type ${widgetInstance.widgetType}. The data is: ${summary.substring(0, 500)}${summary.length > 500 ? '...' : ''}`;
            } catch (error) {
                return `Widget "${title}" of type ${widgetInstance.widgetType}. Data could not be serialized.`;
            }
    }
}

// Helper function to find the hierarchical path to a page
export const findPath = (pageToFind: Page, items: NavItemData[]): NavItemData[] | null => {
    for (const item of items) {
        if (item.page === pageToFind) {
            return [item];
        }
        if (item.subItems) {
            const subPath = findPath(pageToFind, item.subItems);
            if (subPath) {
                return [item, ...subPath];
            }
        }
    }
    return null;
};
