import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarketplaceConnection } from '../models';
import { API_BASE_URL, MARKETPLACE_DEBUG_API_BASE_URL } from './api.constants';

export interface ConnectMarketplaceRequest {
  marketplaceName: string;
  storeName: string;
  appKey: string;
  appSecret: string;
  locationId?: string;
  refreshToken?: string;
  sellerId?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
}

export interface ConnectMarketplaceResponse {
  success: boolean;
  connectionId?: string;
  message: string;
  tokenExpiresAt?: Date;
}

export interface FlipkartConnectUrlResponse {
  loginUrl?: string;
  url?: string;
}

export interface FlipkartCallbackRequest {
  code: string;
  state: string;
}

export interface FlipkartCallbackResponse {
  success: boolean;
  message: string;
}

export interface SearchMarketplaceOrdersResponse {
  success?: boolean;
  message?: string;
  shipments?: unknown[];
}

export interface ImportMarketplaceProductsResponse {
  success?: boolean;
  message?: string;
  importedCount?: number;
}

export interface SyncMarketplaceOrdersResponse {
  success?: boolean;
  message?: string;
  orders?: unknown[];
}

@Injectable({
  providedIn: 'root'
})
export class MarketplaceApi {
  constructor(private http: HttpClient) { }

  getMarketplaceConnections(): Observable<MarketplaceConnection[]> {
    return this.http.get<MarketplaceConnection[]>(`${API_BASE_URL}/marketplace/connections`);
  }

  updateMarketplaceConnection(id: string, updates: Partial<MarketplaceConnection>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/marketplace-connections/${id}`, updates);
  }

  connectMarketplace(payload: ConnectMarketplaceRequest): Observable<ConnectMarketplaceResponse> {
    return this.http.post<ConnectMarketplaceResponse>(`${API_BASE_URL}/marketplace/connect`, payload);
  }

  getFlipkartConnectUrl(): Observable<FlipkartConnectUrlResponse | string> {
    return this.http.get<FlipkartConnectUrlResponse | string>(`${API_BASE_URL}/storesetup/flipkart/connect`);
  }

  completeFlipkartCallback(payload: FlipkartCallbackRequest): Observable<FlipkartCallbackResponse> {
    return this.http.post<FlipkartCallbackResponse>(`${API_BASE_URL}/storesetup/flipkart/callback`, payload);
  }

  syncMarketplace(id: string): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/marketplace/${id}/sync-products`, {});
  }

  searchMarketplaceOrders(connectionId: string, fromDate: Date, toDate: Date): Observable<SearchMarketplaceOrdersResponse> {
    return this.http.post<SearchMarketplaceOrdersResponse>(`${API_BASE_URL}/marketplace/${connectionId}/orders/search`, {
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      states: ['Approved', 'Packed', 'Ready_To_Dispatch']
    });
  }

  getMarketplaceOrders(marketplaceId: number): Observable<SyncMarketplaceOrdersResponse> {
    return this.http.get<SyncMarketplaceOrdersResponse>(`${API_BASE_URL}/Marketplace/${marketplaceId}/orders`);
  }

  generateLabel(connectionId: string, shipmentId: string): Observable<{ label: string }> {
    return this.http.post<{ label: string }>(`${API_BASE_URL}/marketplace/${connectionId}/shipments/${shipmentId}/label`, {});
  }

  dispatchShipment(connectionId: string, shipmentId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${API_BASE_URL}/marketplace/${connectionId}/shipments/${shipmentId}/dispatch`, {});
  }

  getInvoice(connectionId: string, shipmentId: string): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}/marketplace/${connectionId}/shipments/${shipmentId}/invoice`, { responseType: 'blob' });
  }

  importProductsDebug(connectionId: string): Observable<ImportMarketplaceProductsResponse> {
    return this.http.post<ImportMarketplaceProductsResponse>(`${API_BASE_URL}/Marketplace/${connectionId}/import-flipkart-products`, {});
  }
}
