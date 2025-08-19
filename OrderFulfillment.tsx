
import React, { useMemo, useState } from 'react';
import type { OrderItem } from './types';
import { Card, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { EURO } from './utils';
import { PackageIcon } from './components/Icons';
import { initialOrders } from './data';

type OrderStatus = 'New' | 'Processing' | 'Shipped' | 'Delivered';

const statusConfig: Record<OrderStatus, { title: string, color: 'blue' | 'violet' | 'default' | 'emerald' }> = {
    'New': { title: 'New Orders', color: 'blue' },
    'Processing': { title: 'Processing', color: 'violet' },
    'Shipped': { title: 'Shipped', color: 'default' },
    'Delivered': { title: 'Delivered', color: 'emerald' },
};

const OrderCard: React.FC<{ order: OrderItem }> = ({ order }) => (
    <Card className="mb-4">
        <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-base text-white">#{order.id}</p>
                    <p className="text-sm text-zinc-300">{order.customer}</p>
                </div>
                <p className="text-lg font-semibold text-white">{EURO.format(order.total)}</p>
            </div>
            <div className="flex justify-between items-end mt-2">
                <p className="text-xs text-zinc-400">{order.date}</p>
                <p className="text-xs text-zinc-500">{order.items} item(s)</p>
            </div>
        </CardContent>
    </Card>
);

const KanbanColumn: React.FC<{ title: string; color: 'blue' | 'violet' | 'default' | 'emerald'; orders: OrderItem[] }> = ({ title, color, orders }) => (
    <div className="flex-1 min-w-[300px] bg-zinc-900/50 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
            <Badge variant={color}>{title}</Badge>
            <span className="text-sm font-semibold text-zinc-400">{orders.length}</span>
        </div>
        <div>
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
    </div>
);


export default function OrderFulfillment() {
    const [orders] = useState<OrderItem[]>(initialOrders);
    const groupedOrders = useMemo(() => {
        return orders.reduce((acc, order) => {
            (acc[order.status] = acc[order.status] || []).push(order);
            return acc;
        }, {} as Record<OrderStatus, OrderItem[]>);
    }, [orders]);

    return (
        <div className="space-y-8">
            <header>
                <div className="flex items-center gap-3">
                     <PackageIcon className="h-8 w-8 text-violet-400" />
                     <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Order Fulfillment</h1>
                        <p className="text-zinc-400 mt-1">Manage the entire order lifecycle from placement to delivery.</p>
                     </div>
                </div>
            </header>

            <div className="flex gap-6 overflow-x-auto pb-4">
                {(Object.keys(statusConfig) as OrderStatus[]).map(status => (
                    <KanbanColumn
                        key={status}
                        title={statusConfig[status].title}
                        color={statusConfig[status].color}
                        orders={groupedOrders[status] || []}
                    />
                ))}
            </div>
        </div>
    );
}