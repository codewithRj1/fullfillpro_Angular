import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, Package, ShoppingCart, Warehouse, Users, Settings, LogOut, Menu, Search, Bell, ChevronDown, Check, X, Filter, Plus, Trash2, Edit } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { apiFeedbackInterceptor } from './core/interceptors/api-feedback.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiFeedbackInterceptor, authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({
      LayoutDashboard, Package, ShoppingCart, Warehouse, Users, Settings, LogOut, Menu, Search, Bell, ChevronDown, Check, X, Filter, Plus, Trash2, Edit
    }))
  ]
};
