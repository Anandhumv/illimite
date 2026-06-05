import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiProductService } from '../../services/api-product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';

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
        this.isLoading = false;
      }
    });
  }

  async addCurrentProductToCart(): Promise<void> {
    if (!this.product) {
      return;
    }

    await this.cartService.addToCart(this.product.id || this.product.slug, 1, this.product.price);
    this.cartMessage = 'Added to cart.';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
}
