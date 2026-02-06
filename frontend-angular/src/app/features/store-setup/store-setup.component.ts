import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Warehouse, Carrier, MarketplaceConnection, Marketplace } from '../../core/models';
import { IconModule } from '../../shared/modules/icon.module';

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


    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading.set(true);

        this.api.getWarehouses().subscribe({
            next: (data) => {
                this.warehouses.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });

        this.api.getCarriers().subscribe({
            next: (data) => this.carriers.set(data),
            error: () => { }
        });

        // Load marketplace connections
        this.api.getMarketplaceConnections().subscribe({
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

    connectMarketplace() {
        // Validation
        const mkp = this.connectingMarketplace();
        const baseValid = !!this.formStoreName() && !!this.formAppKey() && !!this.formAppSecret();

        let valid = baseValid;
        // Amazon additional fields are now optional as per user request
        /*
        if (mkp?.id.startsWith('amazon')) {
            valid = baseValid && !!this.formRefreshToken() && !!this.formAwsAccessKey() && !!this.formAwsSecret();
        }
        */

        if (!valid) {
            alert('Please fill all required fields');
            return;
        }

        this.connecting.set(true);

        const mkpId = mkp?.id || '';
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

        this.api.connectMarketplace(payload).subscribe({
            next: (response: any) => {
                this.connecting.set(false);
                if (response.success) {
                    alert(`Successfully connected to ${payload.marketplaceName}!`);
                    this.connectDialogOpen.set(false);
                    this.loadData(); // Refresh connections
                } else {
                    alert(`Connection failed: ${response.message}`);
                }
            },
            error: (err: any) => {
                this.connecting.set(false);
                alert(`Error: ${err.message || 'Connection failed'}`);
            }
        });
    }

    syncMarketplace(marketplaceId: string) {
        const connection = this.getMarketplaceConnection(marketplaceId);
        if (!connection.isActive) {
            alert('Please connect this marketplace first');
            return;
        }

        // In real implementation, would get connectionId from API
        console.log('Syncing marketplace:', marketplaceId);
        alert('Sync functionality will be implemented once connected!');
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

        const connections = this.marketplaceConnections();
        const connection = connections.find(c => {
            // Mapping frontend IDs to backend Marketplace enum
            if (marketplaceId === 'amazon_in' && c.marketplace === 'amazon') return true;
            if (marketplaceId === 'flipkart' && c.marketplace === 'flipkart') return true;
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
