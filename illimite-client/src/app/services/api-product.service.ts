import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:5000/api';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiBaseUrl}/products`);
  }

  getCategories(): Observable<CategoryOption[]> {
    return this.http.get<CategoryOption[]>(`${this.apiBaseUrl}/categories`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiBaseUrl}/products/${id}`);
  }

  createProduct(product: Product): Observable<{ success: boolean; product: Product; message: string }> {
    return this.http.post<{ success: boolean; product: Product; message: string }>(
      `${this.apiBaseUrl}/products`,
      product
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<{ success: boolean; product: Product; message: string }> {
    return this.http.patch<{ success: boolean; product: Product; message: string }>(
      `${this.apiBaseUrl}/products/${id}`,
      product
    );
  }

  deleteProduct(id: string): Observable<{ success: boolean; productId: string; message: string }> {
    return this.http.delete<{ success: boolean; productId: string; message: string }>(
      `${this.apiBaseUrl}/products/${id}`
    );
  }
}
