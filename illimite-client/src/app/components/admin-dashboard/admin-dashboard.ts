import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiProductService } from '../../services/api-product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private readonly apiProductService = inject(ApiProductService);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly lowStockCount = computed(() => this.products().filter(product => product.stock <= 5).length);
  readonly totalStock = computed(() => this.products().reduce((sum, product) => sum + product.stock, 0));
  readonly metrics = computed(() => [
    { label: 'Products', value: String(this.products().length) },
    { label: 'Low stock', value: String(this.lowStockCount()) },
    { label: 'Units available', value: String(this.totalStock()) }
  ]);

  ngOnInit(): void {
    this.apiProductService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load admin product data.');
        this.isLoading.set(false);
      }
    });
  }
}
