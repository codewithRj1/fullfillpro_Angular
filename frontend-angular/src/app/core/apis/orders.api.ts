import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models';
import { API_BASE_URL } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class OrdersApi {
  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API_BASE_URL}/orders`);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${API_BASE_URL}/orders/${id}`);
  }

  createOrder(order: Omit<Order, 'id'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/orders`, order);
  }

  updateOrder(id: string, updates: Partial<Order>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/orders/${id}`, updates);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/orders/${id}`);
  }
}
