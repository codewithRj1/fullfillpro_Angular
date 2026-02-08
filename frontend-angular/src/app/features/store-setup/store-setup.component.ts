import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Warehouse, Carrier, MarketplaceConnection, Marketplace } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';
import { ToastService } from '../../core/services/toast.service';
import { InventoryApi } from '../../core/apis/inventory.api';
import { MarketplaceApi } from '../../core/apis/marketplace.api';
import { ShippingApi } from '../../core/apis/shipping.api';

@Component({
    selector: 'app-store-setup',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule],
    templateUrl: './store-setup.component.html',
    styleUrls: ['./store-setup.component.css']
})
export class StoreSetupComponent implements OnInit {
    activeTab = signal<'marketplaces' | 'warehouses' | 'tax' | 'shipping'>('marketplaces');
    warehouses = signal<Warehouse[]>([]);
    carriers = signal<Carrier[]>([]);
    marketplaceConnections = signal<MarketplaceConnection[]>([]);
    loading = signal(true);

    // GST Configuration
    gstGSTIN = signal('27AABCT1234F1ZP');
    gstLegalName = signal('FulfillPro India Pvt. Ltd.');
    gstTradeName = signal('FulfillPro');
    gstPlaceOfSupply = signal('Maharashtra');
    gstDefaultRate = signal(18);

    marketplaceNames: Record<Marketplace, string> = {
        amazon: 'Amazon India',
        flipkart: 'Flipkart',
        meesho: 'Meesho',
        ajio: 'Ajio',
        myntra: 'Myntra',
        tatacliq: 'TataCliq',
        jiomart: 'JioMart'
    };

    // Extended marketplace list including international
    allMarketplaces = [
        { id: 'amazon_in', name: 'Amazon India', country: 'IN', icon: 'store', color: 'bg-orange-500' },
        { id: 'amazon_us', name: 'Amazon USA', country: 'US', icon: 'store', color: 'bg-orange-500' },
        { id: 'flipkart', name: 'Flipkart', country: 'IN', icon: 'shopping-bag', color: 'bg-blue-500' },
        { id: 'meesho', name: 'Meesho', country: 'IN', icon: 'shopping-cart', color: 'bg-purple-500' },
        { id: 'walmart', name: 'Walmart', country: 'US', icon: 'building-2', color: 'bg-blue-600' },
        { id: 'shein', name: 'SHEIN', country: 'Global', icon: 'shirt', color: 'bg-black' },
        { id: 'temu', name: 'Temu', country: 'Global', icon: 'globe', color: 'bg-orange-600' },
        { id: 'myntra', name: 'Myntra', country: 'IN', icon: 'shopping-bag', color: 'bg-pink-500' },
        { id: 'ajio', name: 'AJIO', country: 'IN', icon: 'shirt', color: 'bg-yellow-600' },
        { id: 'tatacliq', name: 'TataCliq', country: 'IN', icon: 'store', color: 'bg-blue-700' },
        { id: 'jiomart', name: 'JioMart', country: 'IN', icon: 'shopping-basket', color: 'bg-blue-500' }
    ];

    // Connection dialog state
    connectDialogOpen = signal(false);
    connectingMarketplace = signal<any>(null);
    formStoreName = signal('');
    formAppKey = signal(''); // Client ID
    formAppSecret = signal(''); // Client Secret
    formRefreshToken = signal('');
    formSellerId = signal('');
    formAwsAccessKey = signal('');
    formAwsSecret = signal('');
    formLocationId = signal('');
    connecting = signal(false);
    flipkartDialogOpen = signal(false);
    flipkartLoginUrl = signal('');
    flipkartCode = signal('');
    flipkartState = signal('');
    private flipkartLoginWindow: Window | null = null;


    constructor(
        private inventoryApi: InventoryApi,
        private shippingApi: ShippingApi,
        private marketplaceApi: MarketplaceApi,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);

        this.inventoryApi.getWarehouses().subscribe({
            next: (data) => {
                this.warehouses.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });

        this.shippingApi.getCarriers().subscribe({
            next: (data) => this.carriers.set(data),
            error: () => { }
        });

        // Load marketplace connections
        this.marketplaceApi.getMarketplaceConnections().subscribe({
            next: (data) => this.marketplaceConnections.set(data),
            error: () => { }
        });
    }

    toggleMarketplace(marketplaceId: string) {
        console.log('Toggle marketplace:', marketplaceId);
        // API call to enable/disable marketplace
    }

    configureMarketplace(marketplaceId: string) {
        const marketplace = this.allMarketplaces.find(m => m.id === marketplaceId);
        if (marketplace) {
            this.connectingMarketplace.set(marketplace);
            this.formStoreName.set('');
            this.formAppKey.set('');
            this.formAppSecret.set('');
            this.formRefreshToken.set('');
            this.formSellerId.set('');
            this.formAwsAccessKey.set('');
            this.formAwsSecret.set('');
            this.formLocationId.set('');
            this.connectDialogOpen.set(true);
        }
    }

    openFlipkartConnectDialog(marketplace: { id: string; name: string; country: string; icon: string; color: string } | null) {
        if (!marketplace) {
            return;
        }

        this.connectingMarketplace.set(marketplace);
        this.flipkartCode.set('');
        this.flipkartState.set('');
        this.flipkartLoginUrl.set('');
        this.connecting.set(true);

        this.marketplaceApi.getFlipkartConnectUrl().subscribe({
            next: (response) => {
                const loginUrl = this.extractFlipkartUrl(response);
                this.connecting.set(false);
                this.connectDialogOpen.set(false);
                this.flipkartLoginUrl.set(loginUrl);
                this.flipkartDialogOpen.set(true);

                if (loginUrl) {
                    this.flipkartLoginWindow = window.open(loginUrl, '_blank', 'noopener,noreferrer,width=900,height=700');
                }
            },
            error: () => {
                this.connecting.set(false);
                this.flipkartDialogOpen.set(true);
            }
        });
    }

    connectFlipkartNow() {
        const code = this.flipkartCode().trim();
        const state = this.flipkartState().trim();

        if (!code || !state) {
            this.toast.error('Code and state are required');
            return;
        }

        this.connecting.set(true);
        this.marketplaceApi.completeFlipkartCallback({ code, state }).subscribe({
            next: (response) => {
                this.connecting.set(false);
                if (response.success) {
                    this.flipkartDialogOpen.set(false);
                    if (this.flipkartLoginWindow && !this.flipkartLoginWindow.closed) {
                        this.flipkartLoginWindow.close();
                    }
                    this.flipkartLoginWindow = null;
                    this.loadData();
                }
            },
            error: () => {
                this.connecting.set(false);
            }
        });
    }

    openFlipkartLogin() {
        const loginUrl = this.flipkartLoginUrl();
        if (!loginUrl) {
            return;
        }

        this.flipkartLoginWindow = window.open(loginUrl, '_blank', 'noopener,noreferrer,width=900,height=700');
    }

    private extractFlipkartUrl(response: { loginUrl?: string; url?: string } | string): string {
        if (typeof response === 'string') {
            return response;
        }

        return response.loginUrl || response.url || '';
    }

    connectMarketplace() {
        // Validation
        const valid = !!this.formStoreName().trim();
        if (!valid) {
            this.toast.error('Store/Seller Name is required');
            return;
        }

        const mkpId = this.connectingMarketplace()?.id || '';
        if (mkpId === 'flipkart') {
            this.openFlipkartConnectDialog(this.connectingMarketplace());
            return;
        }

        this.connecting.set(true);
        const payload = {
            marketplaceName: mkpId.includes('amazon') ? 'amazon' : mkpId,
            storeName: this.formStoreName(),
            appKey: this.formAppKey(),
            appSecret: this.formAppSecret(),
            refreshToken: this.formRefreshToken(),
            sellerId: this.formSellerId(),
            awsAccessKey: this.formAwsAccessKey(),
            awsSecretKey: this.formAwsSecret(),
            locationId: this.formLocationId()
        };

        this.marketplaceApi.connectMarketplace(payload).subscribe({
            next: (response: any) => {
                this.connecting.set(false);
                if (response.success) {
                    this.connectDialogOpen.set(false);
                    this.loadData(); // Refresh connections
                }
            },
            error: () => {
                this.connecting.set(false);
            }
        });
    }

    syncMarketplace(marketplaceId: string) {
        const connection = this.getMarketplaceConnection(marketplaceId);
        if (!connection.isActive) {
            this.toast.error('Please connect this marketplace first');
            return;
        }

        // In real implementation, would get connectionId from API
        console.log('Syncing marketplace:', marketplaceId);
        this.toast.info('Sync functionality will be implemented once connected!');
    }

    saveGSTConfig() {
        console.log('Save GST configuration');
        // API call to save GST settings
    }

    saveCarrierPriority() {
        console.log('Save carrier priority');
        // API call to save carrier order
    }

    activeCarriers() {
        return this.carriers().filter(c => c.isActive);
    }

    getMarketplaceConnection(marketplaceId: string) {
        debugger;

        const connections = this.marketplaceConnections();
        const connection = connections.find(c => {
            // Mapping frontend IDs to backend Marketplace enum
            if (marketplaceId === 'amazon_in' && c.marketplace === 'amazon') return true;
            if (marketplaceId === 'flipkart' && c.marketplace.toString() ==="1" ) return true;
            return false;
        });

        if (connection) {
            return {
                isActive: connection.isActive ?? true,
                sellerId: connection.sellerId,
                lastSynced: connection.lastSynced
            };
        }

        return { isActive: false };
    }
}
