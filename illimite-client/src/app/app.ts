import { ProductCard } from './components/product-card/product-card';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs';
import { ApiProductService } from './services/api-product.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatBadgeModule,
    MatButtonModule,
    MatToolbarModule,
    ProductCard
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly apiProductService = inject(ApiProductService);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly productCount = computed(() => this.products().length);
  readonly currentUrl = signal<string>('/');
  readonly isHomeRoute = computed(() => this.currentUrl() === '/' || this.currentUrl() === '');

  ngOnInit(): void {
    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));

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
