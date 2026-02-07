import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Warehouse } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, IconModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    warehouses = signal<Warehouse[]>([]);
    selectedStore = signal<Warehouse | 'all'>('all');
    profileMenuOpen = signal(false);

    // Computed helper for template safety
    selectedStoreId = computed(() => {
        const s = this.selectedStore();
        return s === 'all' ? null : s.id;
    });

    constructor(private api: ApiService, private router: Router) { }

    ngOnInit() {
        this.api.getWarehouses().subscribe({
            next: (data) => this.warehouses.set(data),
            error: () => {
                this.warehouses.set([
                    { id: '1', name: 'Mumbai Hub', address: 'Andheri East', city: 'Mumbai', state: 'Maharashtra', pinCode: '400069', contactPerson: 'Raj', phone: '9876543210', isDefault: true, isActive: true },
                    { id: '2', name: 'Delhi Hub', address: 'Connaught Place', city: 'Delhi', state: 'Delhi', pinCode: '110001', contactPerson: 'Amit', phone: '9876543211', isDefault: false, isActive: true },
                    { id: '3', name: 'Bangalore Hub', address: 'Koramangala', city: 'Bangalore', state: 'Karnataka', pinCode: '560034', contactPerson: 'Priya', phone: '9876543212', isDefault: false, isActive: true }
                ]);
            }
        });
    }

    getDisplayName(): string {
        const store = this.selectedStore();
        if (store === 'all') return 'All Stores';
        return store.name;
    }

    getDisplayCity(): string {
        const store = this.selectedStore();
        if (store === 'all') return `${this.warehouses().length} locations`;
        return store.city || '';
    }

    selectStore(store: Warehouse | 'all') {
        this.selectedStore.set(store);
    }

    toggleProfileMenu() {
        this.profileMenuOpen.update(v => !v);
    }

    closeProfileMenu() {
        this.profileMenuOpen.set(false);
    }

    goToAccountSettings() {
        this.closeProfileMenu();
        this.router.navigate(['/account-settings']);
    }

    goToActivePlan() {
        this.closeProfileMenu();
        this.router.navigate(['/active-plan']);
    }

    logout() {
        this.closeProfileMenu();
        this.router.navigate(['/login']);
    }
}
