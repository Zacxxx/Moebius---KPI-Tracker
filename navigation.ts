
import type { Page } from './types';
import { HomeIcon, LineChartIcon, MegaphoneIcon, SlidersIcon, UsersIcon, BriefcaseIcon, ShapesIcon, RocketIcon, ShoppingCartIcon } from './components/Icons';

export type NavItemData = {
  icon: React.FC<{className?: string}>;
  label: string;
  page: Page;
  subItems?: Omit<NavItemData, 'icon' | 'subItems'>[];
}

export const platformNavItems: NavItemData[] = [
  { icon: HomeIcon, label: "Dashboard", page: "dashboard" },
  { 
    icon: RocketIcon, 
    label: "Financial", 
    page: "financial-dashboard",
    subItems: [
        { label: "Dashboard", page: "financial-dashboard"},
        { label: "Revenue", page: "financial-revenue"},
        { label: "Expenses", page: "financial-expenses"},
    ]
  },
  { 
    icon: LineChartIcon, 
    label: "Simulation", 
    page: "simulation-revenue",
    subItems: [
        { label: "Revenue & Valuation", page: "simulation-revenue"},
        { label: "P&L Statement", page: "simulation-pnl"},
        { label: "Balance Sheet", page: "simulation-balance-sheet"},
    ]
  },
   { 
    icon: ShoppingCartIcon, 
    label: "Sales",
    page: "sales-dashboard",
    subItems: [
        { label: "Dashboard", page: "sales-dashboard"},
        { label: "Orders", page: "sales-orders"},
        { label: "Inventory", page: "sales-inventory"},
        { label: "Promotions", page: "sales-promotions"},
    ]
  },
  { 
    icon: UsersIcon, 
    label: "Customer", 
    page: "customer-dashboard",
    subItems: [
        { label: "Dashboard", page: "customer-dashboard"},
        { label: "CRM", page: "customer-crm"},
        { label: "Requests", page: "customer-requests"},
        { label: "Feedback", page: "customer-feedback"},
    ]
  },
  { 
    icon: MegaphoneIcon, 
    label: "External", 
    page: "external-dashboard",
    subItems: [
        { label: "Dashboard", page: "external-dashboard"},
        { label: "Product Analytics", page: "product-analytics"},
        { label: "Marketing", page: "marketing"},
        { label: "Content", page: "external-content"},
        { label: "SEO", page: "external-seo"},
        { label: "Partners", page: "external-partners"},
        { label: "PR", page: "external-pr"},
        { label: "Branding", page: "external-branding"},
        { label: "Competition", page: "external-competition"},
    ]
  },
  {
    icon: ShapesIcon,
    label: "Coordination",
    page: "coordination-contractors",
    subItems: [
        { label: "Contractors", page: "coordination-contractors"},
        { label: "Agents", page: "coordination-agents"},
        { label: "Services", page: "coordination-services"},
    ]
  },
   { 
    icon: SlidersIcon, 
    label: "Operational", 
    page: "operational-efficiency",
    subItems: [
        { label: "Efficiency", page: "operational-efficiency"},
        { label: "System Status", page: "operational-status"},
        { label: "Cost Analysis", page: "operational-costs"},
    ]
  },
  { 
    icon: BriefcaseIcon, 
    label: "Internal", 
    page: "internal-people",
    subItems: [
        { label: "People", page: "internal-people"},
        { label: "Culture", page: "internal-culture"},
        { label: "Cap Table", page: "internal-cap-table"},
    ]
  },
];
