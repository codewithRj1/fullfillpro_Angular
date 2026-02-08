import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { MarketplaceApi } from '../../core/apis/marketplace.api';
import { AuthService } from '../../core/services/auth.service';
import { MarketplaceConnection } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, IconModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    stores = signal<MarketplaceConnection[]>([]);
    selectedStore = signal<MarketplaceConnection | 'all'>('all');
    profileMenuOpen = signal(false);
    isDashboardRoute = signal(false);

    // Computed helper for template safety
    selectedStoreId = computed(() => {
        const s = this.selectedStore();
        return s === 'all' ? null : s.id;
    });

    constructor(private marketplaceApi: MarketplaceApi, private router: Router, private authService: AuthService) { }

    ngOnInit() {
        this.isDashboardRoute.set(this.isDashboardUrl(this.router.url));
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.isDashboardRoute.set(this.isDashboardUrl(event.urlAfterRedirects));
            });

        this.marketplaceApi.getMarketplaceConnections().subscribe({
            next: (data) => {
                this.stores.set(data.filter((connection) => this.isActiveConnection(connection)));
            },
            error: () => this.stores.set([])
        });
    }

    getDisplayName(): string {
        const store = this.selectedStore();
        if (store === 'all') return 'All Stores';
        return this.getStoreName(store);
    }

    getDisplaySubtitle(): string {
        const store = this.selectedStore();
        if (store === 'all') return `${this.stores().length} connected stores`;
        return this.getStoreSecondaryText(store);
    }

    selectStore(store: MarketplaceConnection | 'all') {
        this.selectedStore.set(store);
    }

    getStoreName(store: MarketplaceConnection): string {
        if (store.storeName && store.storeName.trim()) {
            return store.storeName.trim();
        }

        if (store.sellerId && store.sellerId.trim()) {
            return store.sellerId.trim();
        }

        return `${this.marketplaceLabel(store.marketplace)} Store`;
    }

    getStoreSecondaryText(store: MarketplaceConnection): string {
        const marketplace = this.marketplaceLabel(store.marketplace);
        const sellerId = store.sellerId?.trim();
        return sellerId ? `${marketplace} | ${sellerId}` : marketplace;
    }

    private marketplaceLabel(value: unknown): string {
        if (typeof value === 'string' && value.trim()) {
            return value.trim().toUpperCase();
        }

        if (typeof value === 'number') {
            return `MARKETPLACE ${value}`;
        }

        return 'MARKETPLACE';
    }

    private isActiveConnection(connection: MarketplaceConnection): boolean {
        const isActive = (connection as { isActive?: unknown }).isActive;

        if (typeof isActive === 'boolean') {
            return isActive;
        }

        if (typeof isActive === 'string') {
            return isActive.toLowerCase() === 'true';
        }

        return false;
    }

    toggleProfileMenu() {
        this.profileMenuOpen.update(v => !v);
    }

    closeProfileMenu() {
        this.profileMenuOpen.set(false);
    }

    goToAccountSettings() {
        this.closeProfileMenu();
        this.router.navigate(['/account-settings']);
    }

    goToActivePlan() {
        this.closeProfileMenu();
        this.router.navigate(['/active-plan']);
    }

    logout() {
        this.closeProfileMenu();
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    getDisplayUserName(): string {
        const email = this.authService.getCurrentUser()?.email ?? '';
        if (!email) {
            return 'User';
        }

        const [name] = email.split('@');
        return name || 'User';
    }

    getDisplayUserEmail(): string {
        return this.authService.getCurrentUser()?.email ?? 'No email';
    }

    getDisplayUserRole(): string {
        const role = this.authService.getCurrentUser()?.role ?? 'user';
        return role.toUpperCase();
    }

    private isDashboardUrl(url: string): boolean {
        return url === '/' || url.startsWith('/dashboard');
    }
}
