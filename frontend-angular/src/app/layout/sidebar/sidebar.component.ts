import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IconModule } from '../../shared/modules/icon.module';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, IconModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    collapsed = signal(false);

    navItems = [
        { label: 'Dashboard', icon: 'layout-dashboard', path: '/', exact: true },
        { label: 'Products', icon: 'package', path: '/products', exact: false },
        { label: 'Orders', icon: 'shopping-cart', path: '/orders', exact: false },
        { label: 'Inventory', icon: 'boxes', path: '/inventory', exact: false },
        { label: 'Warehouses', icon: 'warehouse', path: '/warehouses', exact: false },
        { label: 'Purchase Orders', icon: 'file-text', path: '/purchase-orders', exact: false },
        { label: 'Vendors', icon: 'users', path: '/vendors', exact: false },
        { label: 'Shipments', icon: 'truck', path: '/shipments', exact: false },
        { label: 'Reports', icon: 'bar-chart-3', path: '/reports', exact: false },
        { label: 'Store Setup', icon: 'settings', path: '/store-setup', exact: false },
        { label: 'Users & Roles', icon: 'user-cog', path: '/users', exact: false },
        { label: 'Super Admin', icon: 'user-cog', path: '/super-admin', exact: false },
    ];

    toggleCollapse() {
        this.collapsed.update(v => !v);
    }
}
