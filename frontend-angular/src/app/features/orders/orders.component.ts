import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { MarketplaceApi } from '../../core/apis/marketplace.api';
import { OrdersApi } from '../../core/apis/orders.api';
import { Order } from '../../core/models';
import { MarketplaceBadgeComponent } from '../../shared/components/marketplace-badge/marketplace-badge.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule,
        MarketplaceBadgeComponent,
        StatusBadgeComponent,
        DatePipe
    ],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    orders = signal<Order[]>([]);
    activeTab = signal<'all' | string>('all');
    searchQuery = signal('');
    marketplaceFilter = signal('all');
    loading = signal(true);

    marketplaces = ['amazon', 'flipkart', 'meesho', 'ajio', 'myntra', 'tatacliq', 'jiomart'];
    private readonly marketplaceIdMap: Record<string, number> = {
        flipkart: 1,
        amazon: 2,
        meesho: 3,
        ajio: 4,
        myntra: 5,
        tatacliq: 6,
        jiomart: 7
    };

    statusTabs = computed(() => {
        const all = this.orders();
        return [
            { value: 'all', label: 'All Orders', count: all.length },
            { value: 'pending', label: 'Pending', count: all.filter(o => o.status === 'pending').length },
            { value: 'packed', label: 'Packed', count: all.filter(o => o.status === 'packed').length },
            { value: 'shipped', label: 'Shipped', count: all.filter(o => o.status === 'shipped').length },
            { value: 'delivered', label: 'Delivered', count: all.filter(o => o.status === 'delivered').length },
            { value: 'cancelled', label: 'Cancelled', count: all.filter(o => o.status === 'cancelled').length },
            { value: 'returned', label: 'Returned', count: all.filter(o => o.status === 'returned').length },
        ];
    });

    filteredOrders = computed(() => {
        return this.orders().filter(order => {
            const matchesStatus = this.activeTab() === 'all' || order.status.toLowerCase() === this.activeTab().toLowerCase();

            const query = this.searchQuery().toLowerCase();
            const matchesSearch =
                order.orderNo.toLowerCase().includes(query) ||
                order.customer.name.toLowerCase().includes(query) ||
                (order.trackingNo && order.trackingNo.toLowerCase().includes(query));

            const matchesMarketplace = this.marketplaceFilter() === 'all' || order.marketplace.toLowerCase() === this.marketplaceFilter().toLowerCase();

            return matchesStatus && matchesSearch && matchesMarketplace;
        });
    });

    // Connections
    connections: any[] = [];

    constructor(private ordersApi: OrdersApi, private marketplaceApi: MarketplaceApi, private toast: ToastService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        // Load Orders
        this.ordersApi.getOrders().subscribe({
            next: (data) => {
                this.orders.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });

        // Load Connections to map marketplace -> connectionId
        this.marketplaceApi.getMarketplaceConnections().subscribe({
            next: (data) => this.connections = data,
            error: (err) => console.error('Failed to load connections', err)
        });
    }

    setTab(tab: string) {
        this.activeTab.set(tab);
    }

    handleCreateOrder() {
        // Open Dialog
    }

    // ========== Actions ==========

    private getConnectionId(marketplace: string): string | undefined {
        const conn = this.connections.find(c => c.marketplace.toLowerCase() === marketplace.toLowerCase() && c.isActive);
        return conn?.id;
    }

    generateLabel(order: Order) {
        const connectionId = this.getConnectionId(order.marketplace);
        if (!connectionId) {
            this.toast.error(`No active connection found for ${order.marketplace}`);
            return;
        }

        // Use marketplaceOrderId as shipmentId for Flipkart
        this.marketplaceApi.generateLabel(connectionId, order.marketplaceOrderId).subscribe({
            next: () => {
                // refresh or update order status locally
            }
        });
    }

    dispatchOrder(order: Order) {
        const connectionId = this.getConnectionId(order.marketplace);
        if (!connectionId) {
            this.toast.error(`No active connection found for ${order.marketplace}`);
            return;
        }

        this.marketplaceApi.dispatchShipment(connectionId, order.marketplaceOrderId).subscribe({
            next: () => {
                this.loadData();
            }
        });
    }

    downloadInvoice(order: Order) {
        const connectionId = this.getConnectionId(order.marketplace);
        if (!connectionId) {
            this.toast.error(`No active connection found for ${order.marketplace}`);
            return;
        }

        this.marketplaceApi.getInvoice(connectionId, order.marketplaceOrderId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `invoice_${order.orderNo}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            }
        });
    }

    syncOrders() {
        const selectedMarketplace = this.marketplaceFilter().toLowerCase();
        const marketplaceId = selectedMarketplace === 'all'
            ? 0
            : (this.marketplaceIdMap[selectedMarketplace] ?? -1);

        if (marketplaceId < 0) {
            this.toast.error('Invalid marketplace selected');
            return;
        }

        this.loading.set(true);
        this.marketplaceApi.getMarketplaceOrders(marketplaceId).subscribe({
            next: (res) => {
                const orderCount = res.orders?.length ?? 0;
                this.loadData();
                this.toast.success(`Sync complete. Found ${orderCount} orders.`);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }
}
