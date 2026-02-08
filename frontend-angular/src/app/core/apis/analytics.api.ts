import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardStats,
  MarketplaceSales,
  OrdersByStatus,
  ProductSales,
  SalesDataPoint
} from '../models';
import { API_BASE_URL } from './api.constants';

export interface DashboardStatsResponse {
  dashboardStats: DashboardStats;
  topMarketplacesBySales: MarketplaceSales[];
  topProductsBySales: ProductSales[];
  ordersOverTime: SalesDataPoint[];
  ordersByStatus: OrdersByStatus[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsApi {
  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${API_BASE_URL}/analytics/dashboard`);
  }

  getRevenueReport(startDate: Date, endDate: Date): Observable<SalesDataPoint[]> {
    return this.http.get<SalesDataPoint[]>(`${API_BASE_URL}/analytics/revenue`, {
      params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    });
  }

  getSalesTrends(period: 'daily' | 'weekly' | 'monthly'): Observable<SalesDataPoint[]> {
    return this.http.get<SalesDataPoint[]>(`${API_BASE_URL}/analytics/sales-trends`, {
      params: { period }
    });
  }
}
