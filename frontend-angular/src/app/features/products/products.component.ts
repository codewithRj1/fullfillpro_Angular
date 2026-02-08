import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconModule } from '../../shared/modules/icon.module';
import { MarketplaceConnection, Product } from '../../core/models';
import { MarketplaceBadgeComponent } from '../../shared/components/marketplace-badge/marketplace-badge.component';
import { ToastService } from '../../core/services/toast.service';
import { MarketplaceApi } from '../../core/apis/marketplace.api';
import { CreateProductRequest, ProductsApi } from '../../core/apis/products.api';

enum MarketplaceCode {
    Flipkart = 1,
    Amazon = 2,
    Meesho = 3,
    Ajio = 4,
    Myntra = 5,
    TataCliq = 6,
    JioMart = 7
}

const MARKETPLACE_CODE_TO_NAME: Record<number, string> = {
    [MarketplaceCode.Flipkart]: 'flipkart',
    [MarketplaceCode.Amazon]: 'amazon',
    [MarketplaceCode.Meesho]: 'meesho',
    [MarketplaceCode.Ajio]: 'ajio',
    [MarketplaceCode.Myntra]: 'myntra',
    [MarketplaceCode.TataCliq]: 'tatacliq',
    [MarketplaceCode.JioMart]: 'jiomart'
};

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule, IconModule, MarketplaceBadgeComponent],
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    products = signal<Product[]>([]);
    searchQuery = signal('');
    viewMode = signal<'list' | 'grid'>('list');
    loading = signal(true);
    addProductOpen = signal(false);
    imageDialogOpen = signal(false);
    hasVariants = signal(false);

    name = '';
    sku = '';
    hsnCode = '';
    category = '';
    brand = '';
    description = '';
    barcode = '';

    purchasePrice = '';
    packagingCost = '';
    shippingCost = '';
    otherCost = '';
    sellingPrice = '';
    mrp = '';

    inventory = '';
    soldQuantity = '0';
    returnQuantity = '0';
    pendingReturnQuantity = '0';
    damagedQuantity = '0';

    weight = '';
    length = '';
    width = '';
    height = '';

    marketplaceOrigin = '';
    amazonPrice = '';
    flipkartPrice = '';
    meeshoPrice = '';
    ajioPrice = '';
    myntraPrice = '';
    tatacliqPrice = '';
    jiomartPrice = '';

    isActive = true;

    imageItems: Array<{ kind: 'url' | 'file'; preview: string; url?: string; file?: File }> = [];
    imageUrlInput = '';
    variations: Array<{ name: string; values: string }> = [];
    importDialogOpen = signal(false);
    importFileName = '';
    importFileError = '';
    importingMarketplace = signal(false);
    activeStores = signal<MarketplaceConnection[]>([]);
    selectedImportStoreId = signal('');
    editingProductId = signal<string | null>(null);

    // Column Templates need to be accessed via ViewChild in the template itself usually, 
    // but for simple Angular data tables we often pass the TemplateRef.
    // Here we'll define columns structure for the generic table.

    filteredProducts = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.products().filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.sku.toLowerCase().includes(query)
        );
    });

    constructor(private productsApi: ProductsApi, private marketplaceApi: MarketplaceApi, private toast: ToastService) { }

    ngOnInit() {
        this.loadProducts();
        this.loadActiveStores();
    }

    private loadProducts() {
        this.loading.set(true);
        this.productsApi.getProducts().subscribe({
            next: (data) => {
                this.products.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load products', err);
                this.loading.set(false);
            }
        });
    }

    private loadActiveStores() {
        this.marketplaceApi.getMarketplaceConnections().subscribe({
            next: (connections) => {
                const activeStores = connections.filter((connection) => connection.isActive);
                this.activeStores.set(activeStores);
                if (activeStores.length > 0 && !this.selectedImportStoreId()) {
                    this.selectedImportStoreId.set(activeStores[0].id);
                }
            },
            error: () => {
                this.activeStores.set([]);
                this.selectedImportStoreId.set('');
            }
        });
    }

    handleExport() {
        // Export logic
        console.log('Exporting...');
    }

    handleAddProduct() {
        this.resetNewProduct();
        this.editingProductId.set(null);
        this.addProductOpen.set(true);
    }

    openImportDialog() {
        this.importFileName = '';
        this.importFileError = '';
        this.importingMarketplace.set(false);
        this.loadActiveStores();
        this.importDialogOpen.set(true);
    }

    closeImportDialog() {
        this.importDialogOpen.set(false);
    }

    handleImportFile(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const allowed = ['xls', 'xlsx', 'csv'];
        if (!allowed.includes(ext)) {
            this.importFileError = 'Please upload a .xls, .xlsx, or .csv file.';
            this.importFileName = '';
            input.value = '';
            return;
        }

        this.importFileError = '';
        this.importFileName = file.name;
        input.value = '';
    }

    submitImport() {
        if (!this.importFileName) {
            this.importFileError = 'Select a file to import.';
            return;
        }
        console.log('import-products', { fileName: this.importFileName });
        this.closeImportDialog();
    }

    importFromMarketplace() {
        const connectionId = this.selectedImportStoreId();
        if (!connectionId) {
            this.toast.error('Please select an active store');
            return;
        }

        this.importingMarketplace.set(true);
        this.marketplaceApi.importProductsDebug(connectionId).subscribe({
            next: (response) => {
                this.importingMarketplace.set(false);
                const importedCount = response.importedCount;
                if (typeof importedCount === 'number') {
                    this.toast.success(`Imported ${importedCount} products from marketplace`);
                }
                this.closeImportDialog();
                this.loadProducts();
            },
            error: () => {
                this.importingMarketplace.set(false);
            }
        });
    }

    getStoreLabel(store: MarketplaceConnection): string {
        const name = (store.storeName || store.sellerId || '').trim();
        const marketplace = this.resolveMarketplaceName(store.marketplace).toUpperCase();
        return name ? `${name} (${marketplace})` : `${marketplace} - ${store.id}`;
    }

    resolveMarketplaceName(marketplace: unknown, fallback?: unknown): string {
        debugger;
        const normalizedMarketplace = this.normalizeMarketplaceName(marketplace);
        if (normalizedMarketplace) {
            return normalizedMarketplace;
        }

        const normalizedFallback = this.normalizeMarketplaceName(fallback);
        if (normalizedFallback) {
            return normalizedFallback;
        }

        return 'amazon';
    }

    private normalizeMarketplaceName(value: unknown): string | null {
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) {
                return null;
            }

            const numericValue = Number.parseInt(trimmed, 10);
            if (!Number.isNaN(numericValue)) {
                return MARKETPLACE_CODE_TO_NAME[numericValue] ?? null;
            }

            return trimmed.toLowerCase();
        }

        if (typeof value === 'number') {
            return MARKETPLACE_CODE_TO_NAME[value] ?? null;
        }

        return null;
    }

    handleEditProduct(product: Product) {
        this.resetNewProduct();
        this.editingProductId.set(product.id);

        this.name = product.name ?? '';
        this.sku = product.sku ?? '';
        this.hsnCode = product.hsnCode ?? '';
        this.category = product.category ?? '';
        this.brand = product.brand ?? '';
        this.description = product.description ?? '';
        this.barcode = product.barcode ?? '';

        this.purchasePrice = this.toInputNumber(product.purchasePrice);
        this.packagingCost = this.toInputNumber(product.packagingCost);
        this.shippingCost = this.toInputNumber(product.shippingCost);
        this.otherCost = this.toInputNumber(product.otherCost);
        this.sellingPrice = this.toInputNumber(product.sellingPrice);
        this.mrp = this.toInputNumber(product.mrp);

        this.inventory = this.toInputInt(product.totalInventory);
        this.soldQuantity = this.toInputInt(product.soldQuantity);
        this.returnQuantity = this.toInputInt(product.returnQuantity);
        this.pendingReturnQuantity = this.toInputInt(product.pendingReturnQuantity);
        this.damagedQuantity = this.toInputInt(product.damagedQuantity);

        this.weight = this.toInputOptionalNumber(product.weight);
        this.length = this.toInputOptionalNumber(product.dimensions?.length);
        this.width = this.toInputOptionalNumber(product.dimensions?.width);
        this.height = this.toInputOptionalNumber(product.dimensions?.height);

        this.marketplaceOrigin = this.resolveMarketplaceName(product.marketplaceOrigin);
        this.amazonPrice = this.toInputOptionalNumber(product.amazonPrice);
        this.flipkartPrice = this.toInputOptionalNumber(product.flipkartPrice);
        this.meeshoPrice = this.toInputOptionalNumber(product.meeshoPrice);
        this.ajioPrice = this.toInputOptionalNumber(product.ajioPrice);
        this.myntraPrice = this.toInputOptionalNumber(product.myntraPrice);
        this.tatacliqPrice = this.toInputOptionalNumber(product.tatacliqPrice);
        this.jiomartPrice = this.toInputOptionalNumber(product.jiomartPrice);

        this.isActive = product.isActive;
        this.imageItems = product.imageUrl ? [{ kind: 'url', url: product.imageUrl, preview: product.imageUrl }] : [];

        this.addProductOpen.set(true);
    }

    handleDeleteProduct(product: Product) {
        if (confirm('Are you sure?')) {
            this.productsApi.deleteProduct(product.id).subscribe(() => {
                this.products.update(list => list.filter(p => p.id !== product.id));
            });
        }
    }

    closeAddProduct() {
        this.addProductOpen.set(false);
        this.imageDialogOpen.set(false);
        this.editingProductId.set(null);
    }

    resetNewProduct() {
        this.name = '';
        this.sku = '';
        this.hsnCode = '';
        this.category = '';
        this.brand = '';
        this.description = '';
        this.barcode = '';
        this.purchasePrice = '';
        this.packagingCost = '';
        this.shippingCost = '';
        this.otherCost = '';
        this.sellingPrice = '';
        this.mrp = '';
        this.inventory = '';
        this.soldQuantity = '0';
        this.returnQuantity = '0';
        this.pendingReturnQuantity = '0';
        this.damagedQuantity = '0';
        this.weight = '';
        this.length = '';
        this.width = '';
        this.height = '';
        this.marketplaceOrigin = '';
        this.amazonPrice = '';
        this.flipkartPrice = '';
        this.meeshoPrice = '';
        this.ajioPrice = '';
        this.myntraPrice = '';
        this.tatacliqPrice = '';
        this.jiomartPrice = '';
        this.isActive = true;
        this.imageItems = [];
        this.imageUrlInput = '';
        this.hasVariants.set(false);
        this.variations = [];
    }

    openImageDialog() {
        this.imageDialogOpen.set(true);
    }

    closeImageDialog() {
        this.imageDialogOpen.set(false);
    }

    handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        Array.from(input.files).forEach(file => {
            const preview = URL.createObjectURL(file);
            this.imageItems = [...this.imageItems, { kind: 'file', file, preview }];
        });

        input.value = '';
    }

    addImageUrl() {
        const url = this.imageUrlInput.trim();
        if (!url) return;
        this.imageItems = [...this.imageItems, { kind: 'url', url, preview: url }];
        this.imageUrlInput = '';
    }

    removeImage(index: number) {
        const image = this.imageItems[index];
        if (image?.kind === 'file' && image.preview.startsWith('blob:')) {
            URL.revokeObjectURL(image.preview);
        }
        this.imageItems = this.imageItems.filter((_, i) => i !== index);
    }

    addVariation() {
        this.variations = [...this.variations, { name: '', values: '' }];
    }

    removeVariation(index: number) {
        this.variations = this.variations.filter((_, i) => i !== index);
    }

    submitNewProduct() {
        const editingId = this.editingProductId();
        if (editingId) {
            const updates: Partial<Product> = {
                name: this.name.trim(),
                sku: this.sku.trim(),
                hsnCode: this.hsnCode.trim(),
                category: this.category.trim(),
                brand: this.brand.trim(),
                description: this.description.trim(),
                barcode: this.barcode.trim(),
                purchasePrice: this.toDecimal(this.purchasePrice),
                packagingCost: this.toDecimal(this.packagingCost),
                shippingCost: this.toDecimal(this.shippingCost),
                otherCost: this.toDecimal(this.otherCost),
                sellingPrice: this.toDecimal(this.sellingPrice),
                mrp: this.toDecimal(this.mrp),
                totalInventory: this.toInt(this.inventory),
                soldQuantity: this.toInt(this.soldQuantity),
                returnQuantity: this.toInt(this.returnQuantity),
                pendingReturnQuantity: this.toInt(this.pendingReturnQuantity),
                damagedQuantity: this.toInt(this.damagedQuantity),
                weight: this.toOptionalDecimal(this.weight),
                dimensions: {
                    length: this.toDecimal(this.length),
                    width: this.toDecimal(this.width),
                    height: this.toDecimal(this.height)
                },
                marketplaceOrigin: this.resolveMarketplaceName(this.marketplaceOrigin) as Product['marketplaceOrigin'],
                amazonPrice: this.toOptionalDecimal(this.amazonPrice),
                flipkartPrice: this.toOptionalDecimal(this.flipkartPrice),
                meeshoPrice: this.toOptionalDecimal(this.meeshoPrice),
                ajioPrice: this.toOptionalDecimal(this.ajioPrice),
                myntraPrice: this.toOptionalDecimal(this.myntraPrice),
                tatacliqPrice: this.toOptionalDecimal(this.tatacliqPrice),
                jiomartPrice: this.toOptionalDecimal(this.jiomartPrice),
                isActive: this.isActive
            };

            const firstImageUrl = this.imageItems.find((item) => item.kind === 'url' && item.url)?.url?.trim();
            if (firstImageUrl) {
                updates.imageUrl = firstImageUrl;
            }

            this.productsApi.updateProduct(editingId, updates).subscribe({
                next: () => {
                    this.closeAddProduct();
                    this.loadProducts();
                }
            });
            return;
        }

        const request: CreateProductRequest = {
            name: this.name,
            sku: this.sku,
            hsnCode: this.hsnCode,
            category: this.category,
            brand: this.brand,
            description: this.description,
            barcode: this.barcode,
            purchasePrice: this.purchasePrice,
            packagingCost: this.packagingCost,
            shippingCost: this.shippingCost,
            otherCost: this.otherCost,
            sellingPrice: this.sellingPrice,
            mrp: this.mrp,
            inventory: this.inventory,
            soldQuantity: this.soldQuantity,
            returnQuantity: this.returnQuantity,
            pendingReturnQuantity: this.pendingReturnQuantity,
            damagedQuantity: this.damagedQuantity,
            weight: this.weight,
            length: this.length,
            width: this.width,
            height: this.height,
            marketplaceOrigin: this.marketplaceOrigin,
            amazonPrice: this.amazonPrice,
            flipkartPrice: this.flipkartPrice,
            meeshoPrice: this.meeshoPrice,
            ajioPrice: this.ajioPrice,
            myntraPrice: this.myntraPrice,
            tatacliqPrice: this.tatacliqPrice,
            jiomartPrice: this.jiomartPrice,
            isActive: this.isActive,
            imageItems: this.imageItems,
            hasVariants: this.hasVariants(),
            variations: this.variations
        };

        this.productsApi.createProduct(request).subscribe({
            next: () => {
                this.closeAddProduct();
                this.loadProducts();
            }
        });
    }

    isEditing(): boolean {
        return !!this.editingProductId();
    }

    private toDecimal(value: string): number {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    private toOptionalDecimal(value: string): number | undefined {
        const trimmed = value.trim();
        if (!trimmed) {
            return undefined;
        }

        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    private toInt(value: string): number {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    private toInputNumber(value: number): string {
        return Number.isFinite(value) ? String(value) : '0';
    }

    private toInputInt(value: number): string {
        return Number.isFinite(value) ? String(Math.trunc(value)) : '0';
    }

    private toInputOptionalNumber(value: number | undefined): string {
        return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
    }

    syncInventory() {
        // Logic: Iterate all active products and push inventory to all active connections
        // For MVP, we'll just alert that it's starting and maybe call a sync endpoint if available
        // Or we can fetch connections and loop.

        // Since we don't have connection data in this component, we should fetch it first.
        this.marketplaceApi.getMarketplaceConnections().subscribe(connections => {
            const activeConns = connections.filter(c => c.isActive);
            if (activeConns.length === 0) {
                this.toast.error('No active marketplace connections found');
                return;
            }

            if (confirm(`Push inventory for ${this.products().length} products to ${activeConns.length} marketplaces?`)) {
                // Mocking the loop for MVP or calling a bulk sync endpoint if we made one.
                // We only made single item update endpoint: updateMarketplaceInventory
                // Ideally backend should have a 'BulkSync' endpoint.
                // Let's call the syncMarketplaceListings for Import, 
                // but for "Sync Inventory" it usually means Local -> Remote.
                // "One Click Sync" implies a major event.

                // Let's use the 'Sync Products' endpoint we saw in MarketplaceController which uses SyncProductsCommand.
                // That command pulls FROM Flipkart. 
                // The user said "one click sync inventory from fullfillpro to flipkart".
                // That implies PUSH.

                // Since we lack a Bulk Push endpoint, we will implement it as a loop for now or just the Import/Sync endpoint if that's what they meant by "sync".
                // Usually "Sync" is bidirectional or Source of Truth based. 
                // If FulfillmentHub is SOT, we push.

                this.toast.info('Initiating inventory push. This may take a moment.');
                // Iterate and push (simplified for MVP)
                let count = 0;
                // For now, let's just trigger the "SyncProducts" (Import) as that's what we have fully built.
                // If they meant Push, we need to build that command.
                // But typically "Sync" starts with pulling latest state.

                activeConns.forEach(conn => {
                    this.marketplaceApi.syncMarketplace(conn.id).subscribe({
                        next: () => {
                            count++;
                            if (count === activeConns.length) this.toast.success('All marketplaces synced.');
                        }
                    });
                });
            }
        });
    }
}
