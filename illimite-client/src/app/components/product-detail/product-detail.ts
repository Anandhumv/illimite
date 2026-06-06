import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiProductService } from '../../services/api-product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly apiProductService = inject(ApiProductService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  productSlug: string | null = null;
  product: Product | null = null;
  errorMessage = '';
  cartMessage = '';
  isLoading = true;

  ngOnInit(): void {
    this.productSlug = this.route.snapshot.paramMap.get('slug');

    if (!this.productSlug) {
      this.errorMessage = 'Product reference is missing.';
      this.isLoading = false;
      return;
    }

    this.apiProductService.getProductById(this.productSlug).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load this product. Please return to the catalog.';
        this.toastService.error(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  async addCurrentProductToCart(): Promise<void> {
    if (!this.product) {
      return;
    }

    if (!this.authService.currentUser()) {
      this.toastService.info('Please login or register before adding products to cart.');
      await this.router.navigate(['/login']);
      return;
    }

    try {
      await this.cartService.addToCart(this.product.id || this.product.slug, 1, this.product.price);
      this.cartMessage = 'Added to cart.';
      this.toastService.success(`${this.product.name} added to cart.`);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      this.toastService.error('Unable to add this product to cart.');
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
