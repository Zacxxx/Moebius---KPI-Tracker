

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { DataTable } from './components/DataTable';
import type { RevenueStream, ExpenseItem, HiringPipelineItem, CrmDataItem, RequestDataItem, KpiMetric, MarketingMetric, OperationalMetric, CustomerMetric, FeedbackItem, ProductMetric, CapTableMetric, OrderItem, ProductItem, PromotionItem, ColumnDef } from './types';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { CodeIcon, ChevronDownIcon } from './components/Icons';
import { Modal } from './components/ui/Modal';
import { CodeBlock } from './components/ui/CodeBlock';
import { Label } from './components/ui/Label';
import {
    initialCapTableMetrics,
    initialCrmData,
    initialCustomerMetrics,
    initialEcommerceMetrics,
    initialExpenses,
    initialFeedbackData,
    initialHiringPipeline,
    initialKpiMetrics,
    initialMarketingMetrics,
    initialOperationalMetrics,
    initialOrders,
    initialProductMetrics,
    initialProducts,
    initialPromotions,
    initialRequestData,
    initialRevenueStreams
} from './data';
import { VersionSelector } from './components/ui/VersionSelector';


type DataSet = 'kpis' | 'revenue' | 'expenses' | 'hiring' | 'crm' | 'requests' | 'customer_kpis' | 'feedback' | 'marketing_kpis' | 'product_kpis' | 'operational_kpis' | 'cap_table' | 'orders' | 'products' | 'promotions';

const dataSetGroups: Record<string, { id: DataSet; label: string }[]> = {
  'Financials': [
    { id: 'revenue', label: 'Revenue Streams' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'cap_table', label: 'Cap Table' },
  ],
  'E-commerce': [
    { id: 'orders', label: 'Orders' },
    { id: 'products', label: 'Products' },
    { id: 'promotions', label: 'Promotions' },
  ],
  'Customer': [
    { id: 'crm', label: 'CRM' },
    { id: 'requests', label: 'Feature Requests' },
    { id: 'feedback', label: 'Feedback' },
  ],
  'Internal': [
    { id: 'hiring', label: 'Hiring Pipeline' },
  ],
  'KPIs': [
    { id: 'kpis', label: 'Home' },
    { id: 'customer_kpis', label: 'Customer' },
    { id: 'marketing_kpis', label: 'Marketing' },
    { id: 'product_kpis', label: 'Product' },
    { id: 'operational_kpis', label: 'Operational' },
  ]
};

const kpiColumns: ColumnDef<KpiMetric>[] = [
    { accessorKey: 'metric', header: 'Metric', cellType: 'text' },
    { accessorKey: 'value', header: 'Value', cellType: 'text' },
    { accessorKey: 'change', header: 'Change', cellType: 'text' },
];
const revenueColumns: ColumnDef<RevenueStream>[] = [
    { accessorKey: 'stream', header: 'Revenue Stream', cellType: 'text' },
    { accessorKey: 'mrr', header: 'Monthly Revenue (€)', cellType: 'currency' },
];
const expensesColumns: ColumnDef<ExpenseItem>[] = [
    { accessorKey: 'category', header: 'Expense Category', cellType: 'text' },
    { accessorKey: 'cost', header: 'Monthly Cost (€)', cellType: 'currency' },
];
const hiringColumns: ColumnDef<HiringPipelineItem>[] = [
    { accessorKey: 'role', header: 'Role', cellType: 'text' },
    { accessorKey: 'department', header: 'Department', cellType: 'text' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Interviewing': 'violet', 'Sourcing': 'blue', 'Offer Extended': 'emerald' } },
    { accessorKey: 'candidates', header: 'Candidates', cellType: 'number' },
];
const crmColumns: ColumnDef<CrmDataItem>[] = [
    { accessorKey: 'name', header: 'Contact Name', cellType: 'text' },
    { accessorKey: 'company', header: 'Company', cellType: 'text' },
    { accessorKey: 'value', header: 'Deal Value (€)', cellType: 'currency' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Proposal': 'violet', 'Negotiation': 'blue', 'Contacted': 'default', 'Lead': 'default', 'Closed - Won': 'emerald', 'Closed - Lost': 'red'} },
    { accessorKey: 'contact', header: 'Email', cellType: 'text' },
];
const requestsColumns: ColumnDef<RequestDataItem>[] = [
    { accessorKey: 'title', header: 'Feature Request', cellType: 'text' },
    { accessorKey: 'user', header: 'Requested By', cellType: 'text' },
    { accessorKey: 'votes', header: 'Votes', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Shipped': 'emerald', 'In Progress': 'blue', 'Planned': 'violet', 'Under Review': 'default'} },
];
const feedbackColumns: ColumnDef<FeedbackItem>[] = [
    { accessorKey: 'user', header: 'User', cellType: 'text' },
    { accessorKey: 'score', header: 'Score', cellType: 'number' },
    { accessorKey: 'type', header: 'Type', cellType: 'badge', badgeOptions: { 'promoter': 'emerald', 'passive': 'default', 'detractor': 'red'} },
    { accessorKey: 'comment', header: 'Comment', cellType: 'text' },
];
const capTableColumns: ColumnDef<CapTableMetric>[] = [
    { accessorKey: 'metric', header: 'Metric', cellType: 'text' },
    { accessorKey: 'value', header: 'Value', cellType: 'text' },
];
const ordersColumns: ColumnDef<OrderItem>[] = [
    { accessorKey: 'customer', header: 'Customer', cellType: 'text' },
    { accessorKey: 'date', header: 'Date', cellType: 'text' },
    { accessorKey: 'total', header: 'Total (€)', cellType: 'currency' },
    { accessorKey: 'items', header: 'Items', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'New': 'blue', 'Processing': 'violet', 'Shipped': 'default', 'Delivered': 'emerald' } },
];
const productsColumns: ColumnDef<ProductItem>[] = [
    { accessorKey: 'name', header: 'Product Name', cellType: 'text' },
    { accessorKey: 'sku', header: 'SKU', cellType: 'text' },
    { accessorKey: 'price', header: 'Price (€)', cellType: 'currency' },
    { accessorKey: 'stock', header: 'Stock', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'In Stock': 'emerald', 'Low Stock': 'violet', 'Out of Stock': 'red' } },
];
const promotionsColumns: ColumnDef<PromotionItem>[] = [
    { accessorKey: 'code', header: 'Code', cellType: 'text' },
    { accessorKey: 'type', header: 'Type', cellType: 'badge', badgeOptions: { 'Percentage': 'blue', 'Fixed Amount': 'violet' } },
    { accessorKey: 'value', header: 'Value', cellType: 'number' },
    { accessorKey: 'usageCount', header: 'Usage', cellType: 'number' },
    { accessorKey: 'status', header: 'Status', cellType: 'badge', badgeOptions: { 'Active': 'emerald', 'Expired': 'default' } },
];


const allColumns: Record<DataSet, ColumnDef<any>[]> = {
    kpis: kpiColumns,
    revenue: revenueColumns,
    expenses: expensesColumns,
    hiring: hiringColumns,
    crm: crmColumns,
    requests: requestsColumns,
    customer_kpis: kpiColumns, // Reusing kpiColumns structure
    feedback: feedbackColumns,
    marketing_kpis: kpiColumns, // Reusing kpiColumns structure
    product_kpis: kpiColumns, // Reusing kpiColumns structure
    operational_kpis: kpiColumns, // Reusing kpiColumns structure
    cap_table: capTableColumns,
    orders: ordersColumns,
    products: productsColumns,
    promotions: promotionsColumns,
};

const tableNames: Record<DataSet, string> = {
    kpis: 'home_kpis',
    revenue: 'revenue_streams',
    expenses: 'expenses',
    hiring: 'hiring_pipeline',
    crm: 'crm_deals',
    requests: 'feature_requests',
    customer_kpis: 'customer_kpis',
    feedback: 'customer_feedback',
    marketing_kpis: 'marketing_kpis',
    product_kpis: 'product_kpis',
    operational_kpis: 'operational_kpis',
    cap_table: 'cap_table_metrics',
    orders: 'orders',
    products: 'products',
    promotions: 'promotions',
};

const newRowDataMap: Record<DataSet, Omit<any, 'id'>> = {
    kpis: { metric: '', value: '', change: '' },
    revenue: { stream: '', mrr: 0 },
    expenses: { category: '', cost: 0 },
    hiring: { role: '', department: '', status: 'Sourcing', candidates: 0 },
    crm: { name: '', company: '', value: 0, status: 'Lead', contact: '' },
    requests: { title: '', user: '', votes: 0, status: 'Under Review' },
    customer_kpis: { metric: '', value: '', change: '' },
    feedback: { user: '', score: 0, type: 'passive', comment: '' },
    marketing_kpis: { metric: '', value: '', change: '' },
    product_kpis: { metric: '', value: '', change: '' },
    operational_kpis: { metric: '', value: '', change: '' },
    cap_table: { metric: '', value: '', change: '' },
    orders: { customer: '', date: new Date().toISOString().split('T')[0], total: 0, items: 1, status: 'New' },
    products: { name: '', sku: '', price: 0, stock: 0, status: 'In Stock' },
    promotions: { code: '', type: 'Percentage', value: 0, usageCount: 0, status: 'Active' },
};

const versions = [
    { id: 'live', label: 'Live Data' },
    { id: 'snapshot-q2', label: 'Q2 Snapshot' },
    { id: 'sandbox', label: 'Sandbox Data' },
];

export default function DataSources() {
    const [openSection, setOpenSection] = useState('Financials');
    const [activeTab, setActiveTab] = useState<DataSet>('revenue');
    const [apiEndpoints, setApiEndpoints] = useState<Partial<Record<DataSet, string>>>({});
    const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
    const [generatedSchema, setGeneratedSchema] = useState('');
    const [syncStatus, setSyncStatus] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });
    const [syncAllStatus, setSyncAllStatus] = useState<{ loading: boolean; message: string | null; type: 'success' | 'error' | 'info' }>({ loading: false, message: null, type: 'info' });
    const [activeVersion, setActiveVersion] = useState('live');

    const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>(initialRevenueStreams);
    const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
    const [hiringPipeline, setHiringPipeline] = useState<HiringPipelineItem[]>(initialHiringPipeline);
    const [crmData, setCrmData] = useState<CrmDataItem[]>(initialCrmData);
    const [requestData, setRequestData] = useState<RequestDataItem[]>(initialRequestData);
    const [kpiMetrics, setKpiMetrics] = useState<KpiMetric[]>(initialKpiMetrics);
    const [marketingMetrics, setMarketingMetrics] = useState<MarketingMetric[]>(initialMarketingMetrics);
    const [operationalMetrics, setOperationalMetrics] = useState<OperationalMetric[]>(initialOperationalMetrics);
    const [customerMetrics, setCustomerMetrics] = useState<CustomerMetric[]>(initialCustomerMetrics);
    const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>(initialFeedbackData);
    const [productMetrics, setProductMetrics] = useState<ProductMetric[]>(initialProductMetrics);
    const [capTableMetrics, setCapTableMetrics] = useState<CapTableMetric[]>(initialCapTableMetrics);
    const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
    const [products, setProducts] = useState<ProductItem[]>(initialProducts);
    const [promotions, setPromotions] = useState<PromotionItem[]>(initialPromotions);

    const dataMap = {
        kpis: kpiMetrics, revenue: revenueStreams, expenses: expenses, hiring: hiringPipeline,
        crm: crmData, requests: requestData, customer_kpis: customerMetrics, feedback: feedbackData,
        marketing_kpis: marketingMetrics, product_kpis: productMetrics, operational_kpis: operationalMetrics,
        cap_table: capTableMetrics, orders: orders, products: products, promotions: promotions,
    };
    const setDataMap = {
        kpis: setKpiMetrics, revenue: setRevenueStreams, expenses: setExpenses, hiring: setHiringPipeline,
        crm: setCrmData, requests: setRequestData, customer_kpis: setCustomerMetrics, feedback: setFeedbackData,
        marketing_kpis: setMarketingMetrics, product_kpis: setProductMetrics, operational_kpis: setOperationalMetrics,
        cap_table: setCapTableMetrics, orders: setOrders, products: setProducts, promotions: setPromotions,
    };

    const handleSyncActiveTabData = async () => {
        const url = apiEndpoints[activeTab];
        if (!url) {
            setSyncStatus({ loading: false, error: "Please enter an API endpoint URL." });
            return;
        }
        setSyncStatus({ loading: true, error: null });
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("API response is not a valid JSON array.");
            (setDataMap as any)[activeTab](data as any);
            setSyncStatus({ loading: false, error: null });
        } catch (error) {
            setSyncStatus({ loading: false, error: error instanceof Error ? error.message : "An unknown error occurred." });
        }
    };
    
    const handleSyncAllData = async () => {
        setSyncAllStatus({ loading: true, message: 'Syncing all sources...', type: 'info' });
        const endpointsToSync = Object.entries(apiEndpoints).filter(([, url]) => url && url.trim() !== '') as [DataSet, string][];
        
        if (endpointsToSync.length === 0) {
            setSyncAllStatus({ loading: false, message: "No API endpoints configured.", type: 'info' });
            return;
        }

        const results = await Promise.allSettled(
            endpointsToSync.map(async ([dataSet, url]) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                const data = await response.json();
                if (!Array.isArray(data)) throw new Error("API response is not a valid JSON array.");
                (setDataMap as any)[dataSet](data as any);
                return dataSet;
            })
        );

        const failedSyncs = results.filter(r => r.status === 'rejected');
        const successfulSyncs = results.filter(r => r.status === 'fulfilled');

        if (failedSyncs.length > 0) {
            const failedDataSets = results.map((r, i) => r.status === 'rejected' ? endpointsToSync[i][0] : null).filter(Boolean).join(', ');
            const message = `${successfulSyncs.length} sources synced. Failed: ${failedDataSets}.`;
            setSyncAllStatus({ loading: false, message, type: 'error' });
        } else {
            const message = `Successfully synced ${successfulSyncs.length} data sources.`;
            setSyncAllStatus({ loading: false, message, type: 'success' });
        }
    };
    
    const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const mapTypeToSql = (cellType?: string) => {
        switch (cellType) {
            case 'number': return 'INT';
            case 'currency': return 'DECIMAL(12, 2)';
            case 'badge': return 'VARCHAR(50)';
            case 'text': default: return 'VARCHAR(255)';
        }
    };

    const handleExportSchema = () => {
        const columns = allColumns[activeTab];
        const tableName = tableNames[activeTab];
        const columnDefs = columns.map(col => `  \`${camelToSnakeCase(String(col.accessorKey))}\` ${mapTypeToSql(col.cellType)} NOT NULL`).join(',\n');
        const schema = `CREATE TABLE \`${tableName}\` (\n  \`id\` INT PRIMARY KEY AUTO_INCREMENT,\n${columnDefs}\n);`;
        setGeneratedSchema(schema);
        setIsSchemaModalOpen(true);
    };

    const renderActiveTable = () => {
        const isReadOnly = !!apiEndpoints[activeTab];
        return <DataTable columns={allColumns[activeTab]} data={(dataMap as any)[activeTab]} setData={(setDataMap as any)[activeTab]} newRowData={newRowDataMap[activeTab]} isReadOnly={isReadOnly} />;
    }

    const syncAllMessageColor = syncAllStatus.type === 'success' ? 'text-emerald-400' : syncAllStatus.type === 'error' ? 'text-red-400' : 'text-zinc-400';

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Data Sources</h1>
                    <p className="text-zinc-400 mt-1">Manage, edit, and automate your application's data from a central hub.</p>
                </div>
                <div className="flex items-center gap-2">
                    <VersionSelector
                        versions={versions}
                        activeVersion={activeVersion}
                        onVersionChange={setActiveVersion}
                    />
                    <Button onClick={handleSyncAllData} disabled={syncAllStatus.loading}>{syncAllStatus.loading ? 'Syncing All...' : 'Sync All Sources'}</Button>
                </div>
            </header>

            {syncAllStatus.message && <p className={`text-sm ${syncAllMessageColor}`}>{syncAllStatus.message}</p>}
            
            <Card>
                <CardContent className="!p-0 flex min-h-[600px]">
                    <aside className="w-64 border-r border-zinc-700/50 p-4 space-y-2 flex-shrink-0">
                        {Object.entries(dataSetGroups).map(([sectionName, tabs]) => (
                            <div key={sectionName}>
                                <button
                                    onClick={() => setOpenSection(openSection === sectionName ? '' : sectionName)}
                                    className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-zinc-800/60"
                                >
                                    <span className="font-semibold text-zinc-200">{sectionName}</span>
                                    <ChevronDownIcon className={`h-5 w-5 text-zinc-400 transition-transform ${openSection === sectionName ? 'rotate-180' : ''}`} />
                                </button>
                                {openSection === sectionName && (
                                    <div className="pl-2 pt-1 space-y-1">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id as DataSet);
                                                    setSyncStatus({ loading: false, error: null });
                                                }}
                                                className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                                                    activeTab === tab.id ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:text-zinc-200'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </aside>
                    <main className="flex-1 flex flex-col overflow-x-hidden">
                        <div className="p-4 border-b border-zinc-700/50 bg-zinc-900/30">
                            <h3 className="text-base font-semibold text-zinc-100">API Connection</h3>
                            <p className="text-sm text-zinc-400 mt-1 mb-4">Connect to an API endpoint to sync data automatically. When connected, manual editing is disabled.</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="api-endpoint">API Endpoint URL</Label>
                                    <Input id="api-endpoint" placeholder="https://your-api.com/data" value={apiEndpoints[activeTab] || ''} onChange={(e) => setApiEndpoints(prev => ({ ...prev, [activeTab]: e.target.value }))} />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSyncActiveTabData} className="w-full" disabled={syncStatus.loading}>{syncStatus.loading ? 'Syncing...' : 'Sync'}</Button>
                                    <Button variant="secondary" onClick={handleExportSchema}><CodeIcon className="h-5 w-5" /></Button>
                                </div>
                            </div>
                            {syncStatus.error && <p className="text-red-400 text-sm mt-2">{syncStatus.error}</p>}
                        </div>
                        {renderActiveTable()}
                    </main>
                </CardContent>
            </Card>

            {isSchemaModalOpen && (
                <Modal title="Generated SQL Schema" onClose={() => setIsSchemaModalOpen(false)}>
                    <p className="text-sm text-zinc-400 mb-4">Use this SQL statement to create a compatible table in your database.</p>
                    <CodeBlock code={generatedSchema} />
                </Modal>
            )}
        </div>
    );
}