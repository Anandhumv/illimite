import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',   // Ensure no '.component' chunk is here
  styleUrl: './product-card.css'       // Ensure no '.component' chunk is here
})
export class ProductCard {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly wishlistService = inject(WishlistService);

  // Receives individual product objects from your parent app.html loop
  @Input({ required: true }) product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  async onAddToWishlist(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.currentUser()) {
      this.toastService.info('Please login or register before adding products to your wishlist.');
      await this.router.navigate(['/login']);
      return;
    }

    try {
      await this.wishlistService.addToWishlist(this.product);
      this.toastService.success(`${this.product.name} added to wishlist.`);
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
      this.toastService.error('Unable to add this product to wishlist.');
    }
  }

  getProductInitial(product: Product): string {
    return (product.categoryName || product.name || 'P').charAt(0).toUpperCase();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}
