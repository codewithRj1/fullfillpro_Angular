import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            // Modules will be lazy loaded here
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
            },
            {
                path: 'inventory',
                loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent)
            },
            {
                path: 'warehouses',
                loadComponent: () => import('./features/warehouses/warehouses.component').then(m => m.WarehousesComponent)
            },
            {
                path: 'vendors',
                loadComponent: () => import('./features/vendors/vendors.component').then(m => m.VendorsComponent)
            },
            {
                path: 'purchase-orders',
                loadComponent: () => import('./features/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent)
            },
            {
                path: 'shipments',
                loadComponent: () => import('./features/shipments/shipments.component').then(m => m.ShipmentsComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'store-setup',
                loadComponent: () => import('./features/store-setup/store-setup.component').then(m => m.StoreSetupComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
            },
        ]
    },
    { path: '**', redirectTo: '' }
];
