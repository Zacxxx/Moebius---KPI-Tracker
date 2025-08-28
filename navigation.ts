
import type { Page, ContentSection, NavItemData } from './types';
import { HomeIcon, LineChartIcon, MegaphoneIcon, SlidersIcon, UsersIcon, BriefcaseIcon, ShapesIcon, RocketIcon, ShoppingCartIcon, SparklesIcon, TagIcon, BarChartIcon, FolderIcon, FileTextIcon, CubeIcon, WifiIcon, LibraryIcon, LightningBoltIcon, TrendingUpIcon, CheckSquareIcon, TargetIcon, PieChartIcon, GaugeIcon, PackageIcon, GitBranchIcon } from './components/Icons';

export type NavSection = {
  label?: string; // Optional header for the section
  items: NavItemData[];
  collapsible?: boolean;
  icon?: React.FC<{className?: string}>;
};

const platformNav: NavSection[] = [
    {
        items: [
            {
                icon: LibraryIcon,
                label: "Dashboards",
                page: "dashboard",
                isMenuOnly: true,
                subItems: [
                    {
                        icon: BriefcaseIcon,
                        label: "Platform",
                        page: "dashboard",
                        subItems: [
                            {
                                icon: RocketIcon,
                                label: "Simulation",
                                page: "simulation-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "simulation-dashboard" },
                                    { label: "Revenue & Valuation", page: "simulation-revenue" },
                                    { label: "P&L Statement", page: "simulation-pnl" },
                                    { label: "Balance Sheet", page: "simulation-balance-sheet" },
                                ]
                            },
                            {
                                icon: LineChartIcon,
                                label: "Financial",
                                page: "financial-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "financial-dashboard" },
                                    { label: "Revenue", page: "financial-revenue" },
                                    { label: "Expenses", page: "financial-expenses" },
                                ]
                            },
                            {
                                icon: ShoppingCartIcon,
                                label: "Sales",
                                page: "sales-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "sales-dashboard" },
                                    { label: "Orders", page: "sales-orders" },
                                    { label: "Inventory", page: "sales-inventory" },
                                    { label: "Promotions", page: "sales-promotions" },
                                ]
                            },
                            {
                                icon: UsersIcon,
                                label: "Customer",
                                page: "customer-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "customer-dashboard" },
                                    { label: "CRM", page: "customer-crm" },
                                    { label: "Requests", page: "customer-requests" },
                                    { label: "Feedback", page: "customer-feedback" },
                                ]
                            },
                            {
                                icon: CubeIcon,
                                label: "Product",
                                page: "product-analytics",
                                subItems: [
                                    { label: "Analytics", page: "product-analytics" },
                                ]
                            },
                            {
                                icon: MegaphoneIcon,
                                label: "External",
                                page: "external-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "external-dashboard" },
                                    { label: "Marketing", page: "marketing" },
                                    { label: "Content", page: "external-content" },
                                    { label: "SEO", page: "external-seo" },
                                    { label: "Partners", page: "external-partners" },
                                    { label: "Public Relations", page: "external-pr" },
                                    { label: "Branding", page: "external-branding" },
                                    { label: "Competition", page: "external-competition" },
                                ]
                            },
                            {
                                icon: SlidersIcon,
                                label: "Operational",
                                page: "operational-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "operational-dashboard" },
                                    { label: "Efficiency", page: "operational-efficiency" },
                                    { label: "System Status", page: "operational-status" },
                                    { label: "Cost Analysis", page: "operational-costs" },
                                ]
                            },
                            {
                                icon: BriefcaseIcon,
                                label: "Internal",
                                page: "internal-dashboard",
                                subItems: [
                                    { label: "Dashboard", page: "internal-dashboard" },
                                    { label: "People", page: "internal-people" },
                                    { label: "Cap Table", page: "internal-cap-table" },
                                    { label: "Culture", page: "internal-culture" },
                                ]
                            },
                        ]
                    },
                    { icon: ShapesIcon, label: "Coordination", page: "coordination-dashboard" },
                    { icon: SparklesIcon, label: "Studio", page: "studio-dashboard" },
                    { icon: TagIcon, label: "Marketplace", page: "marketplace-dashboard" },
                ]
            },
            {
                icon: BarChartIcon,
                label: "Monitoring",
                page: "monitoring-dashboard",
                subItems: [
                    { icon: PieChartIcon, label: "Overview", page: "monitoring-dashboard" },
                    { icon: UsersIcon, label: "Agents", page: "monitoring-agents" },
                    { icon: LightningBoltIcon, label: "Actions", page: "monitoring-actions" },
                    { icon: FileTextIcon, label: "Reports", page: "monitoring-reports" },
                    { icon: TrendingUpIcon, label: "Progress", page: "monitoring-progress" },
                    { icon: BriefcaseIcon, label: "Teams", page: "monitoring-teams" },
                    { icon: SlidersIcon, label: "Systems", page: "monitoring-systems" },
                    { icon: CheckSquareIcon, label: "Surveys", page: "monitoring-surveys" },
                    { icon: CubeIcon, label: "Entities", page: "monitoring-entities" },
                ]
            },
            {
                icon: TargetIcon,
                label: "Action Center",
                page: "monitoring-action-center",
                subItems: [
                    {
                        icon: SparklesIcon,
                        label: "Generation",
                        page: "monitoring-generation",
                        subItems: [
                            { icon: GaugeIcon, label: "Metric", page: "monitoring-generation-metric" },
                            { icon: PackageIcon, label: "Deliverables", page: "monitoring-generation-deliverables" },
                            { icon: GitBranchIcon, label: "Workflows", page: "monitoring-generation-workflows" },
                            { icon: CheckSquareIcon, label: "Surveys", page: "monitoring-generation-surveys" },
                        ]
                    },
                    {
                        icon: CubeIcon,
                        label: "Entities",
                        page: "monitoring-entities-overview",
                        subItems: [
                            { icon: PieChartIcon, label: "Overview", page: "monitoring-entities-overview" },
                            { icon: FolderIcon, label: "Manager", page: "monitoring-entities-manager" },
                            { icon: LightningBoltIcon, label: "Actions", page: "monitoring-entities-actions" },
                        ]
                    }
                ]
            }
        ]
    }
];

const coordinationNav: NavSection[] = [
    {
        label: 'Coordination',
        items: []
    }
];

const studioNav: NavSection[] = [
    {
        label: 'Studio',
        items: []
    }
];

const marketplaceNav: NavSection[] = [
    {
        label: 'Marketplace',
        items: []
    }
];


export const navigationData: Record<ContentSection, NavSection[]> = {
  platform: platformNav,
  coordination: coordinationNav,
  studio: studioNav,
  marketplace: marketplaceNav,
};

export const allNavItems: NavItemData[] = (Object.values(navigationData) as NavSection[][])
    .flat()
    .flatMap(section => section.items);
