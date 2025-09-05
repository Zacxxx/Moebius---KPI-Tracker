import type { WidgetInstance, SelectableMetric, Page, NavItemData, DataSourceKey, MetricFormat } from './types';
import { ALL_DATA_SOURCES } from './data';

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
        case 'METRIC_VIEW': {
            const metric = widgetData as SelectableMetric;
            return metric ? `Metric titled "${title}" shows: Metric: ${metric.metric}, Current Value: ${metric.value}, Change: ${metric.change}.` : `Data for Metric "${title}" is not available.`;
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

export const evaluateMathExpression = (expression: string): number => {
    // 1. Resolve data source aggregations (e.g., SUM(revenue_streams.mrr))
    const resolvedExpression = expression.replace(/(SUM|AVG|COUNT)\(([\w_]+)\.([\w_]+)\)/g, (match, agg, table, column) => {
        const dataSourceKey = table as DataSourceKey;
        const dataSource = ALL_DATA_SOURCES[dataSourceKey];

        if (!dataSource || !Array.isArray(dataSource.data)) {
            throw new Error(`Data source "${table}" not found or is invalid.`);
        }
        
        const data = dataSource.data;
        const values = data.map(row => row[column]).filter(v => typeof v === 'number') as number[];

        if (values.length === 0) return '0';

        switch (agg.toUpperCase()) {
            case 'SUM':
                return String(values.reduce((a, b) => a + b, 0));
            case 'AVG':
                return String(values.reduce((a, b) => a + b, 0) / values.length);
            case 'COUNT':
                return String(data.length); // Count all rows in the dataset
            default:
                throw new Error(`Unsupported aggregation function "${agg}".`);
        }
    });

    // 2. Safely evaluate the resulting arithmetic expression
    // Sanitize to allow only numbers, operators, parentheses, and whitespace.
    const sanitizedExpression = resolvedExpression.replace(/\s+/g, '');
    if (!/^[0-9+\-*/().]+$/.test(sanitizedExpression)) {
        throw new Error(`Invalid characters in expression: "${resolvedExpression}"`);
    }

    try {
        // Using Function constructor is safer than eval() as it doesn't access local scope.
        return new Function(`return ${sanitizedExpression}`)();
    } catch (error) {
        throw new Error(`Failed to evaluate expression: "${resolvedExpression}"`);
    }
};

export const formatValue = (value: number, format?: MetricFormat) => {
    if (isNaN(value)) return 'N/A';
    switch (format) {
        case 'currency': return fmtEuro(value);
        case 'percent': return `${value.toFixed(1)}%`;
        case 'number': return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
        case 'ratio': return value.toFixed(2);
        default: return value.toLocaleString();
    }
}