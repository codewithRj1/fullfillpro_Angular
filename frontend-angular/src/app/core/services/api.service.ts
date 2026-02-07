import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
    Product, Order, InventoryItem, Vendor, PurchaseOrder,
    Warehouse, User, Carrier, Shipment, MarketplaceConnection,
    DashboardStats, MarketplaceSales, ProductSales, SalesDataPoint, OrdersByStatus
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'https://localhost:7118/api';

    constructor(private http: HttpClient) { }

    // ========== Products ==========
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products`);
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    }

    createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/products`, product);
    }

    updateProduct(id: string, updates: Partial<Product>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/products/${id}`, updates);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
    }

    // ========== Orders ==========
    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
    }

    createOrder(order: Omit<Order, 'id'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/orders`, order);
    }

    updateOrder(id: string, updates: Partial<Order>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/orders/${id}`, updates);
    }

    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/orders/${id}`);
    }

    // ========== Inventory ==========
    getInventory(): Observable<InventoryItem[]> {
        return this.http.get<InventoryItem[]>(`${this.apiUrl}/inventory`);
    }

    updateInventory(id: string, updates: Partial<InventoryItem>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/inventory/${id}`, updates);
    }

    adjustInventory(productId: string, warehouseId: string, adjustment: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/inventory/adjust`, { productId, warehouseId, adjustment });
    }

    // ========== Vendors ==========
    getVendors(): Observable<Vendor[]> {
        return this.http.get<Vendor[]>(`${this.apiUrl}/inventory/vendors`);
    }

    getVendor(id: string): Observable<Vendor> {
        return this.http.get<Vendor>(`${this.apiUrl}/inventory/vendors/${id}`);
    }

    createVendor(vendor: Omit<Vendor, 'id'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/inventory/vendors`, vendor);
    }

    updateVendor(id: string, updates: Partial<Vendor>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/inventory/vendors/${id}`, updates);
    }

    deleteVendor(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/inventory/vendors/${id}`);
    }

    // ========== Purchase Orders ==========
    getPurchaseOrders(): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/inventory/purchase-orders`);
    }

    getPurchaseOrder(id: string): Observable<PurchaseOrder> {
        return this.http.get<PurchaseOrder>(`${this.apiUrl}/inventory/purchase-orders/${id}`);
    }

    createPurchaseOrder(po: Omit<PurchaseOrder, 'id'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/inventory/purchase-orders`, po);
    }

    updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/inventory/purchase-orders/${id}`, updates);
    }

    deletePurchaseOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/inventory/purchase-orders/${id}`);
    }

    receivePurchaseOrder(id: string, items: { productId: string; receivedQty: number; rejectedQty: number }[]): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/inventory/purchase-orders/${id}/receive`, { items });
    }

    // ========== Warehouses ==========
    getWarehouses(): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(`${this.apiUrl}/inventory/warehouses`);
    }

    getWarehouse(id: string): Observable<Warehouse> {
        return this.http.get<Warehouse>(`${this.apiUrl}/inventory/warehouses/${id}`);
    }

    createWarehouse(warehouse: Omit<Warehouse, 'id'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/inventory/warehouses`, warehouse);
    }

    updateWarehouse(id: string, updates: Partial<Warehouse>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/inventory/warehouses/${id}`, updates);
    }

    deleteWarehouse(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/inventory/warehouses/${id}`);
    }

    // ========== Carriers ==========
    getCarriers(): Observable<Carrier[]> {
        // TODO: Implement when backend endpoint is ready
        return of([]);
    }

    createCarrier(carrier: Omit<Carrier, 'id'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/carriers`, carrier);
    }

    updateCarrier(id: string, updates: Partial<Carrier>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/carriers/${id}`, updates);
    }

    // ========== Shipments ==========
    getShipments(): Observable<Shipment[]> {
        // TODO: Implement when backend endpoint is ready
        return of([]);
    }

    getShipment(id: string): Observable<Shipment> {
        return this.http.get<Shipment>(`${this.apiUrl}/shipments/${id}`);
    }

    createShipment(shipment: Omit<Shipment, 'id'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/shipments`, shipment);
    }

    updateShipmentStatus(id: string, status: string): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/shipments/${id}/status`, { status });
    }

    // ========== Users ==========
    getUsers(): Observable<User[]> {
        // TODO: Implement when backend endpoint is ready
        return of([]);
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    }

    createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/users`, user);
    }

    updateUser(id: string, updates: Partial<User>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/users/${id}`, updates);
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
    }

    // ========== Marketplace Connections ==========
    getMarketplaceConnections(): Observable<MarketplaceConnection[]> {
        return this.http.get<MarketplaceConnection[]>(`${this.apiUrl}/marketplace/connections`);
    }

    updateMarketplaceConnection(id: string, updates: Partial<MarketplaceConnection>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/marketplace-connections/${id}`, updates);
    }

    connectMarketplace(payload: { marketplaceName: string; storeName: string; appKey: string; appSecret: string; locationId?: string }): Observable<{ success: boolean; connectionId?: string; message: string; tokenExpiresAt?: Date }> {
        return this.http.post<any>(`${this.apiUrl}/marketplace/connect`, payload);
    }

    syncMarketplace(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/marketplace/${id}/sync-products`, {});
    }

    searchMarketplaceOrders(connectionId: string, fromDate: Date, toDate: Date): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/marketplace/${connectionId}/orders/search`, {
            fromDate: fromDate.toISOString(),
            toDate: toDate.toISOString(),
            states: ['Approved', 'Packed', 'Ready_To_Dispatch']
        });
    }

    // ========== Order Processing ==========
    generateLabel(connectionId: string, shipmentId: string): Observable<{ label: string }> {
        return this.http.post<{ label: string }>(`${this.apiUrl}/marketplace/${connectionId}/shipments/${shipmentId}/label`, {});
    }

    dispatchShipment(connectionId: string, shipmentId: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.apiUrl}/marketplace/${connectionId}/shipments/${shipmentId}/dispatch`, {});
    }

    getInvoice(connectionId: string, shipmentId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/marketplace/${connectionId}/shipments/${shipmentId}/invoice`, { responseType: 'blob' });
    }


    // ========== Dashboard & Analytics ==========
    getDashboardStats(): Observable<{
        dashboardStats: DashboardStats;
        topMarketplacesBySales: MarketplaceSales[];
        topProductsBySales: ProductSales[];
        ordersOverTime: SalesDataPoint[];
        ordersByStatus: OrdersByStatus[];
    }> {
        return this.http.get<any>(`${this.apiUrl}/analytics/dashboard`);
    }

    getRevenueReport(startDate: Date, endDate: Date): Observable<SalesDataPoint[]> {
        return this.http.get<SalesDataPoint[]>(`${this.apiUrl}/analytics/revenue`, {
            params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
        });
    }

    getSalesTrends(period: 'daily' | 'weekly' | 'monthly'): Observable<SalesDataPoint[]> {
        return this.http.get<SalesDataPoint[]>(`${this.apiUrl}/analytics/sales-trends`, {
            params: { period }
        });
    }
}
