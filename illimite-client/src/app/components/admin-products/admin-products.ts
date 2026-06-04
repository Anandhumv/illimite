import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly errorCode = signal<string | null>(null);
  readonly productCount = signal<number>(0);

  ngOnInit(): void {
    this.loadActiveProducts();
  }

  async loadActiveProducts(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.errorCode.set(null);

    try {
      const activeProducts = await this.productService.getActiveProducts();
      this.products.set(activeProducts);
      this.productCount.set(activeProducts.length);
    } catch (error: any) {
      console.error('Failed to load active products:', error);
      this.errorCode.set(error.code || 'unknown');
      this.errorMessage.set(this.getFirestoreErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  private getFirestoreErrorMessage(error: any): string {
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to access products. Please check your Firestore security rules.';
      case 'unauthenticated':
        return 'Authentication required. Please sign in and try again.';
      case 'not-found':
        return 'The products collection was not found. Please verify the database configuration.';
      case 'unavailable':
        return 'The service is currently unavailable. Please check your connection and try again.';
      case 'resource-exhausted':
        return 'Too many requests. Please wait a moment and try again.';
      default:
        return 'Unable to load products. Please try again later.';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
}
