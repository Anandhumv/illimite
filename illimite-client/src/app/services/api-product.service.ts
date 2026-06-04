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
}
