import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryApi } from '../../core/apis/inventory.api';
import { PurchaseOrder } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-purchase-orders',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './purchase-orders.component.html',
    styleUrls: ['./purchase-orders.component.css']
})
export class PurchaseOrdersComponent implements OnInit {
    purchaseOrders = signal<PurchaseOrder[]>([]);
    loading = signal(true);
    searchQuery = signal('');
    vendorFilter = signal('all');
    statusFilter = signal('all');

    filteredPOs = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const vendor = this.vendorFilter();
        const status = this.statusFilter();

        return this.purchaseOrders().filter(po => {
            const matchesSearch = po.poNo.toLowerCase().includes(query) ||
                po.vendor.name.toLowerCase().includes(query);
            const matchesVendor = vendor === 'all' || po.vendorId === vendor;
            const matchesStatus = status === 'all' || po.status === status;
            return matchesSearch && matchesVendor && matchesStatus;
        });
    });

    constructor(private inventoryApi: InventoryApi) { }

    ngOnInit() {
        this.inventoryApi.getPurchaseOrders().subscribe({
            next: (data) => {
                this.purchaseOrders.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'draft': 'bg-muted text-muted-foreground',
            'sent': 'bg-info/10 text-info',
            'partially_received': 'bg-warning/10 text-warning',
            'completed': 'bg-success/10 text-success',
            'cancelled': 'bg-destructive/10 text-destructive'
        };
        return statusMap[status] || 'bg-secondary text-secondary-foreground';
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            'draft': 'Draft',
            'sent': 'Sent',
            'partially_received': 'Partial',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return labels[status] || status;
    }
}
