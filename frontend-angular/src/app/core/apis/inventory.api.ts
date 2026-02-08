import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem, PurchaseOrder, Vendor, Warehouse } from '../models';
import { API_BASE_URL } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class InventoryApi {
  constructor(private http: HttpClient) { }

  getInventory(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${API_BASE_URL}/inventory`);
  }

  updateInventory(id: string, updates: Partial<InventoryItem>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/inventory/${id}`, updates);
  }

  adjustInventory(productId: string, warehouseId: string, adjustment: number): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/inventory/adjust`, { productId, warehouseId, adjustment });
  }

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${API_BASE_URL}/inventory/vendors`);
  }

  getVendor(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${API_BASE_URL}/inventory/vendors/${id}`);
  }

  createVendor(vendor: Omit<Vendor, 'id'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/inventory/vendors`, vendor);
  }

  updateVendor(id: string, updates: Partial<Vendor>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/inventory/vendors/${id}`, updates);
  }

  deleteVendor(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/inventory/vendors/${id}`);
  }

  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${API_BASE_URL}/inventory/purchase-orders`);
  }

  getPurchaseOrder(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${API_BASE_URL}/inventory/purchase-orders/${id}`);
  }

  createPurchaseOrder(po: Omit<PurchaseOrder, 'id'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/inventory/purchase-orders`, po);
  }

  updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/inventory/purchase-orders/${id}`, updates);
  }

  deletePurchaseOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/inventory/purchase-orders/${id}`);
  }

  receivePurchaseOrder(id: string, items: { productId: string; receivedQty: number; rejectedQty: number }[]): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/inventory/purchase-orders/${id}/receive`, { items });
  }

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${API_BASE_URL}/inventory/warehouses`);
  }

  getWarehouse(id: string): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${API_BASE_URL}/inventory/warehouses/${id}`);
  }

  createWarehouse(warehouse: Omit<Warehouse, 'id'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/inventory/warehouses`, warehouse);
  }

  updateWarehouse(id: string, updates: Partial<Warehouse>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/inventory/warehouses/${id}`, updates);
  }

  deleteWarehouse(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/inventory/warehouses/${id}`);
  }
}
