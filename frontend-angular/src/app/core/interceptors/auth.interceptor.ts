import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    const isTokenUsable = !!token && !authService.isTokenExpired();
    const request = isTokenUsable
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(request).pipe(
        tap((event) => {
            if (!(event instanceof HttpResponse) || event.type !== HttpEventType.Response) {
                return;
            }

            const authorizationHeader = event.headers.get('Authorization');
            const xAccessTokenHeader = event.headers.get('x-access-token');
            const rawHeaderValue = authorizationHeader ?? xAccessTokenHeader;

            if (!rawHeaderValue) {
                return;
            }

            const tokenFromHeader = rawHeaderValue.startsWith('Bearer ')
                ? rawHeaderValue.slice(7).trim()
                : rawHeaderValue.trim();

            if (!tokenFromHeader) {
                return;
            }

            authService.setSessionFromToken(tokenFromHeader);
        }),
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
                authService.logout();
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
};
