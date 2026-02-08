import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, DecodedToken, CurrentUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7118/api';
  private readonly roleClaimKeys = [
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  ];
  private readonly emailClaimKeys = ['email', 'unique_name'];
  private readonly companyIdClaimKeys = ['companyId', 'company_id'];
  private readonly userCodeClaimKeys = ['userCode', 'user_code'];
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSessionFromStorage();
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  private getFirstStringClaim(decoded: DecodedToken, keys: string[]): string {
    for (const key of keys) {
      const value = decoded[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
      if (Array.isArray(value)) {
        const first = value.find((item) => typeof item === 'string' && item.trim().length > 0);
        if (first) {
          return first;
        }
      }
    }
    return '';
  }

  private getRoles(decoded: DecodedToken): string[] {
    const roles = this.roleClaimKeys
      .map((key) => decoded[key])
      .flatMap((value) => {
        if (typeof value === 'string') {
          return value.split(',').map((role) => role.trim()).filter(Boolean);
        }

        if (Array.isArray(value)) {
          return value.filter((role): role is string => typeof role === 'string').map((role) => role.trim()).filter(Boolean);
        }

        return [];
      });

    return [...new Set(roles)];
  }

  /**
   * Convert decoded token to CurrentUser
   */
  private tokenToUser(decoded: DecodedToken): CurrentUser {
    const primaryRole = this.getRoles(decoded)[0] ?? 'user';

    return {
      id: decoded.sub ?? '',
      email: this.getFirstStringClaim(decoded, this.emailClaimKeys),
      role: primaryRole,
      companyId: this.getFirstStringClaim(decoded, this.companyIdClaimKeys),
      userCode: this.getFirstStringClaim(decoded, this.userCodeClaimKeys)
    };
  }

  private loadSessionFromStorage(): void {
    const token = this.getToken();
    if (token) {
      const applied = this.setSessionFromToken(token);
      if (!applied) {
        this.logout();
      }
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      return;
    }

    try {
      this.currentUserSubject.next(JSON.parse(storedUser) as CurrentUser);
    } catch {
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Login endpoint
   * POST /api/auth/login
   * @param credentials identifier, password, ipAddress, device
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setSessionFromToken(response.token);
        })
      );
  }

  /**
   * Signup endpoint
   * POST /api/auth/signup
   * @param data User registration data
   */
  signup(data: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, data);
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get current user
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role ?? '';
  }

  /**
   * Store token and sync current user from JWT claims.
   */
  setSessionFromToken(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return false;
    }

    const user = this.tokenToUser(decoded);
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return true;
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded || typeof decoded.exp !== 'number') {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  /**
   * Check if authenticated user has any required role.
   */
  hasAnyRole(requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) {
      return true;
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    const decoded = this.decodeToken(token);
    if (!decoded) {
      return false;
    }

    const normalizedRoles = this.getRoles(decoded).map((role) => role.toLowerCase());
    const normalizedRequiredRoles = requiredRoles.map((role) => role.toLowerCase());
    return normalizedRequiredRoles.some((role) => normalizedRoles.includes(role));
  }
}
