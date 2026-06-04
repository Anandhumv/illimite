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
  readonly productCount = signal<number>(0);

  ngOnInit(): void {
    this.loadActiveProducts();
  }

  async loadActiveProducts(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const activeProducts = await this.productService.getActiveProducts();
      this.products.set(activeProducts);
      this.productCount.set(activeProducts.length);
    } catch (error) {
      console.error('Failed to load active products:', error);
      this.errorMessage.set('Unable to load products. Please try again later.');
    } finally {
      this.isLoading.set(false);
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
