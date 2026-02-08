import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models';
import { API_BASE_URL } from './api.constants';

@Injectable({
  providedIn: 'root'
})
export class UsersApi {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return of([]);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${API_BASE_URL}/users/${id}`);
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Observable<string> {
    return this.http.post<string>(`${API_BASE_URL}/users`, user);
  }

  updateUser(id: string, updates: Partial<User>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/users/${id}`, updates);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/users/${id}`);
  }
}
