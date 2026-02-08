// Marketplace Types
export type Marketplace = 'amazon' | 'flipkart' | 'meesho' | 'ajio' | 'myntra' | 'tatacliq' | 'jiomart';

export type MarketplaceStatus = 'live' | 'not_live' | 'error';

export interface MarketplaceListing {
    marketplace: Marketplace;
    status: MarketplaceStatus;
    marketplaceId?: string;
    lastSynced?: Date;
}

// Product Types
export interface Product {
    id: string;
    name: string;
    sku: string;
    hsnCode: string;
    category: string;
    brand: string;

    // Pricing
    purchasePrice: number;
    packagingCost: number;
    shippingCost: number;
    otherCost: number;
    totalPurchaseCost: number;
    sellingPrice: number;
    mrp: number;

    // Marketplace pricing
    marketplaceOrigin: Marketplace;
    amazonPrice?: number;
    flipkartPrice?: number;
    meeshoPrice?: number;
    ajioPrice?: number;
    myntraPrice?: number;
    tatacliqPrice?: number;
    jiomartPrice?: number;

    // Inventory
    totalInventory: number;
    soldQuantity: number;
    returnQuantity: number;
    pendingReturnQuantity: number;
    damagedQuantity: number;

    // Product details
    imageUrl?: string;
    description?: string;
    barcode?: string;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };

    marketplaceListings: MarketplaceListing[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Order Types
export type OrderStatus = 'pending' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentMode = 'prepaid' | 'cod';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    total: number;
}

export interface Order {
    id: string;
    orderNo: string;
    marketplaceOrderId: string;
    referenceNo?: string;
    marketplace: Marketplace;
    orderDate: Date;
    shippingDate?: Date;
    deliveryDate?: Date;
    customer: {
        name: string;
        phone: string;
        email?: string;
        address: string;
        city: string;
        state: string;
        pinCode: string;
    };
    status: OrderStatus;
    paymentMode: PaymentMode;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    trackingNo?: string;
    carrierName?: string;
    labelGenerated: boolean;
    labelUrl?: string;
    warehouseId: string;
}

// Inventory Types
export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItem {
    id: string;
    productId: string;
    product: Product;
    warehouseId: string;
    warehouseName: string;
    available: number;
    reserved: number;
    onHold: number;
    inbound: number;
    reorderLevel: number;
}

// Warehouse Types
export interface Warehouse {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    contactPerson: string;
    phone: string;
    isDefault: boolean;
    isActive: boolean;
}

// Vendor Types
export interface Vendor {
    id: string;
    name: string;
    code: string;
    contactPerson: string;
    phone: string;
    email: string;
    gstin: string;
    city: string;
    state: string;
    address: string;
    paymentTerms: string;
    isActive: boolean;
}

// Purchase Order Types
export type POStatus = 'draft' | 'sent' | 'partially_received' | 'completed' | 'cancelled';

export interface POLineItem {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    orderedQty: number;
    receivedQty: number;
    rejectedQty: number;
    purchasePrice: number;
    tax: number;
    total: number;
}

export interface PurchaseOrder {
    id: string;
    poNo: string;
    vendorId: string;
    vendor: Vendor;
    createdDate: Date;
    expectedDeliveryDate: Date;
    status: POStatus;
    items: POLineItem[];
    totalItems: number;
    totalQuantity: number;
    totalValue: number;
    warehouseId: string;
}

// Carrier & Shipment Types
export interface Carrier {
    id: string;
    name: string;
    accountCode: string;
    serviceablePinCodes: number;
    codEnabled: boolean;
    dailyLimit?: number;
    isActive: boolean;
}

export type ShipmentStatus = 'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'rto';

export interface Shipment {
    id: string;
    orderId: string;
    orderNo: string;
    marketplace: Marketplace;
    carrier: Carrier;
    trackingNo: string;
    labelRate: number;
    warehouseId: string;
    warehouseName: string;
    status: ShipmentStatus;
    shipDate: Date;
    deliveredDate?: Date;
}

// User & Permissions Types
export type UserRole = 'admin' | 'operations' | 'finance' | 'warehouse' | 'viewer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
}

// Marketplace Connection Types
export interface MarketplaceConnection {
    id: string;
    marketplace: Marketplace;
    storeName?: string;
    sellerId?: string;
    apiKey?: string;
    apiSecret?: string;
    refreshToken?: string; // Amazon
    awsAccessKeyId?: string; // Amazon
    awsSecretKey?: string; // Amazon
    locationId?: string;
    isActive: boolean;
    lastSynced?: Date;
}

// Dashboard Analytics Types
export interface DashboardStats {
    totalRevenue?: number;
    totalOrders?: number;
    totalProducts?: number;
    activeUsers?: number;
}

export interface SalesDataPoint {
    date: string;
    sales: number;
    orders: number;
}

export interface MarketplaceSales {
    marketplace: Marketplace;
    sales: number;
    orders: number;
}

export interface ProductSales {
    productId: string;
    productName: string;
    sales: number;
    quantity: number;
}

export interface OrdersByStatus {
    status: OrderStatus;
    count: number;
}
// Auth Models
export type { LoginRequest, LoginResponse, SignupRequest, SignupResponse, DecodedToken, CurrentUser } from './auth.model';
