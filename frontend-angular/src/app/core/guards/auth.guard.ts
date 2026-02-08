import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!authService.hasAnyRole(requiredRoles)) {
    return router.createUrlTree(['/']);
  }

  return true;
};
