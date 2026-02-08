import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { IconModule } from '../../shared/modules/icon.module';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, IconModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
    collapsed = signal(false);

    private readonly allNavItems = [
        { label: 'Dashboard', icon: 'layout-dashboard', path: '/', exact: true as const },
        { label: 'Products', icon: 'package', path: '/products', exact: false as const },
        { label: 'Orders', icon: 'shopping-cart', path: '/orders', exact: false as const },
        { label: 'Inventory', icon: 'boxes', path: '/inventory', exact: false as const },
        { label: 'Warehouses', icon: 'warehouse', path: '/warehouses', exact: false as const },
        { label: 'Purchase Orders', icon: 'file-text', path: '/purchase-orders', exact: false as const },
        { label: 'Vendors', icon: 'users', path: '/vendors', exact: false as const },
        { label: 'Shipments', icon: 'truck', path: '/shipments', exact: false as const },
        { label: 'Reports', icon: 'bar-chart-3', path: '/reports', exact: false as const },
        { label: 'Store Setup', icon: 'settings', path: '/store-setup', exact: false as const },
        { label: 'Users & Roles', icon: 'user-cog', path: '/users', exact: false as const, roles: ['admin', 'super_admin'] },
        { label: 'Super Admin', icon: 'user-cog', path: '/super-admin', exact: false as const, roles: ['admin', 'super_admin'] },
    ];

    navItems = computed(() => {
        const role = this.authService.getUserRole().toLowerCase();

        return this.allNavItems.filter((item) => {
            if (!item.roles) {
                return true;
            }

            return item.roles.map((allowedRole) => allowedRole.toLowerCase()).includes(role);
        });
    });

    constructor(private authService: AuthService) { }

    toggleCollapse() {
        this.collapsed.update(v => !v);
    }
}
