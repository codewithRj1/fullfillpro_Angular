import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Carrier, Shipment } from '../models';
import { API_BASE_URL } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class ShippingApi {
  constructor(private http: HttpClient) { }

  getCarriers(): Observable<Carrier[]> {
    return of([]);
  }

  createCarrier(carrier: Omit<Carrier, 'id'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/carriers`, carrier);
  }

  updateCarrier(id: string, updates: Partial<Carrier>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/carriers/${id}`, updates);
  }

  getShipments(): Observable<Shipment[]> {
    return of([]);
  }

  getShipment(id: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${API_BASE_URL}/shipments/${id}`);
  }

  createShipment(shipment: Omit<Shipment, 'id'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/shipments`, shipment);
  }

  updateShipmentStatus(id: string, status: string): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/shipments/${id}/status`, { status });
  }
}
