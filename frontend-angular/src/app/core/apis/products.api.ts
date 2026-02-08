import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models';
import { API_BASE_URL } from './api.constants';

export interface ProductImageItemRequest {
  kind: 'url' | 'file';
  url?: string;
  file?: File;
}

export interface ProductVariationRequest {
  name: string;
  values: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  hsnCode: string;
  category: string;
  brand: string;
  description: string;
  barcode: string;
  purchasePrice: string;
  packagingCost: string;
  shippingCost: string;
  otherCost: string;
  sellingPrice: string;
  mrp: string;
  inventory: string;
  soldQuantity: string;
  returnQuantity: string;
  pendingReturnQuantity: string;
  damagedQuantity: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  marketplaceOrigin: string;
  amazonPrice: string;
  flipkartPrice: string;
  meeshoPrice: string;
  ajioPrice: string;
  myntraPrice: string;
  tatacliqPrice: string;
  jiomartPrice: string;
  isActive: boolean;
  imageItems: ProductImageItemRequest[];
  hasVariants: boolean;
  variations: ProductVariationRequest[];
}

export interface CreateProductResponse {
  id?: string;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${API_BASE_URL}/products/products`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${API_BASE_URL}/products/${id}`);
  }

  createProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
    const payload = request;
    return this.http.post<CreateProductResponse>(`${API_BASE_URL}/products`, payload);
  }

  updateProduct(id: string, updates: Partial<Product>): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/products/${id}`, updates);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/products/${id}`);
  }

  private buildCreateProductFormData(request: CreateProductRequest): FormData {
    const formData = new FormData();

    formData.append('Name', request.name.trim());
    formData.append('Sku', request.sku.trim());
    this.appendIfHasValue(formData, 'HsnCode', request.hsnCode);
    this.appendIfHasValue(formData, 'Category', request.category);
    this.appendIfHasValue(formData, 'Brand', request.brand);
    this.appendIfHasValue(formData, 'Description', request.description);
    this.appendIfHasValue(formData, 'Barcode', request.barcode);

    formData.append('PurchasePrice', this.toDecimal(request.purchasePrice).toString());
    formData.append('PackagingCost', this.toDecimal(request.packagingCost).toString());
    formData.append('ShippingCost', this.toDecimal(request.shippingCost).toString());
    formData.append('OtherCost', this.toDecimal(request.otherCost).toString());
    formData.append('SellingPrice', this.toDecimal(request.sellingPrice).toString());
    formData.append('Mrp', this.toDecimal(request.mrp).toString());

    formData.append('TotalInventory', this.toInt(request.inventory).toString());
    formData.append('SoldQuantity', this.toInt(request.soldQuantity).toString());
    formData.append('ReturnQuantity', this.toInt(request.returnQuantity).toString());
    formData.append('PendingReturnQuantity', this.toInt(request.pendingReturnQuantity).toString());
    formData.append('DamagedQuantity', this.toInt(request.damagedQuantity).toString());

    this.appendIfHasValue(formData, 'Weight', request.weight);
    this.appendIfHasValue(formData, 'Length', request.length);
    this.appendIfHasValue(formData, 'Width', request.width);
    this.appendIfHasValue(formData, 'Height', request.height);

    this.appendIfHasValue(formData, 'MarketplaceOrigin', request.marketplaceOrigin);
    this.appendIfHasValue(formData, 'AmazonPrice', request.amazonPrice);
    this.appendIfHasValue(formData, 'FlipkartPrice', request.flipkartPrice);
    this.appendIfHasValue(formData, 'MeeshoPrice', request.meeshoPrice);
    this.appendIfHasValue(formData, 'AjioPrice', request.ajioPrice);
    this.appendIfHasValue(formData, 'MyntraPrice', request.myntraPrice);
    this.appendIfHasValue(formData, 'TatacliqPrice', request.tatacliqPrice);
    this.appendIfHasValue(formData, 'JiomartPrice', request.jiomartPrice);
    formData.append('IsActive', request.isActive ? 'true' : 'false');

    request.imageItems
      .filter((item) => item.kind === 'url' && !!item.url)
      .forEach((item) => formData.append('ImageUrls', item.url as string));

    request.imageItems
      .filter((item) => item.kind === 'file' && !!item.file)
      .forEach((item) => formData.append('ImageFiles', item.file as File, (item.file as File).name));

    if (request.hasVariants) {
      request.variations.forEach((variation, variationIndex) => {
        const optionName = variation.name.trim();
        if (!optionName) {
          return;
        }

        formData.append(`Variations[${variationIndex}].Name`, optionName);
        variation.values
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .forEach((value, valueIndex) => {
            formData.append(`Variations[${variationIndex}].Values[${valueIndex}]`, value);
          });
      });
    }

    return formData;
  }

  private appendIfHasValue(formData: FormData, key: string, value: string): void {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      formData.append(key, trimmed);
    }
  }

  private toDecimal(value: string): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private toInt(value: string): number {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
