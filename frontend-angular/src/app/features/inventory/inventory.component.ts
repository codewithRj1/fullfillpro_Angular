import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../core/services/api.service';
import { InventoryItem, Warehouse } from '../../core/models';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LucideAngularModule
    ],
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
    inventory = signal<InventoryItem[]>([]);
    warehouses = signal<Warehouse[]>([]);

    searchQuery = signal('');
    warehouseFilter = signal('all');
    statusFilter = signal('all');
    loading = signal(true);

    // Computed Stats
    totalAvailable = computed(() => this.filteredInventory().reduce((sum, item) => sum + item.available, 0));
    totalReserved = computed(() => this.filteredInventory().reduce((sum, item) => sum + item.reserved, 0));
    lowStockCount = computed(() => this.filteredInventory().filter(i => i.available <= i.reorderLevel && i.available > 0).length);
    outOfStockCount = computed(() => this.filteredInventory().filter(i => i.available === 0).length);

    filteredInventory = computed(() => {
        return this.inventory().filter(item => {
            const query = this.searchQuery().toLowerCase();
            const matchesSearch =
                item.product.name.toLowerCase().includes(query) ||
                item.product.sku.toLowerCase().includes(query);

            const matchesWarehouse = this.warehouseFilter() === 'all' || item.warehouseId === this.warehouseFilter();

            // Determine status based on available vs reorderLevel
            const itemStatus = item.available === 0 ? 'out_of_stock' : item.available <= item.reorderLevel ? 'low_stock' : 'in_stock';
            const matchesStatus = this.statusFilter() === 'all' || itemStatus === this.statusFilter();

            return matchesSearch && matchesWarehouse && matchesStatus;
        });
    });

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loading.set(true);
        // ForkJoin would be ideal here but let's do sequential for simplicity or simple independent requests
        this.api.getInventory().subscribe({
            next: (data) => {
                this.inventory.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });

        this.api.getWarehouses().subscribe({
            next: (data) => this.warehouses.set(data)
        });
    }

    handleAdjustStock(item: InventoryItem) {
        // Open Dialog logic
    }
}
