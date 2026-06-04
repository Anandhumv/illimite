import { ProductCard } from './components/product-card/product-card';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiProductService } from './services/api-product.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProductCard, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly apiProductService = inject(ApiProductService);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly productCount = computed(() => this.products().length);

  ngOnInit(): void {
    this.apiProductService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.errorMessage.set('Unable to load products. Please confirm the backend is running on port 5000.');
        this.isLoading.set(false);
      }
    });
  }

  trackByProductId(_: number, product: Product): string {
    return product.id;
  }

  getProductInitial(product: Product): string {
    return (product.categoryName || product.name || 'P').charAt(0).toUpperCase();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
}