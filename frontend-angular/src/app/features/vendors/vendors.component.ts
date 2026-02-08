import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryApi } from '../../core/apis/inventory.api';
import { Vendor } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-vendors',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './vendors.component.html',
    styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
    vendors = signal<Vendor[]>([]);
    loading = signal(true);
    searchQuery = signal('');

    filteredVendors = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.vendors().filter(v =>
            v.name.toLowerCase().includes(query) ||
            v.code.toLowerCase().includes(query) ||
            v.contactPerson.toLowerCase().includes(query)
        );
    });

    constructor(private inventoryApi: InventoryApi) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);
        this.inventoryApi.getVendors().subscribe({
            next: (data) => {
                this.vendors.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    handleViewVendor(vendor: Vendor) {
        console.log('View vendor:', vendor.id);
    }

    handleAddVendor() {
        // TODO: Open add vendor dialog
        console.log('Add vendor');
    }

    handleExport() {
        console.log('Export vendors');
    }
}
