import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ApiProductService } from '../../services/api-product.service';
import { Product } from '../../models/product.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly apiProductService = inject(ApiProductService);
  private readonly toastService = inject(ToastService);

  readonly productLookup = signal<Record<string, Product>>({});
  readonly isLoading = signal(true);
  readonly total = computed(() =>
    this.cartService.cartItems().reduce((sum, item) => sum + item.qty * item.priceAtAdd, 0)
  );

  ngOnInit(): void {
    this.apiProductService.getProducts().subscribe({
      next: (products) => {
        this.productLookup.set(
          products.reduce<Record<string, Product>>((lookup, product) => {
            lookup[product.id] = product;
            lookup[product.slug] = product;
            return lookup;
          }, {})
        );
        this.isLoading.set(false);
      },
      error: () => {
        this.toastService.error('Unable to load cart product details.');
        this.isLoading.set(false);
      }
    });
  }

  productFor(productId: string): Product | undefined {
    return this.productLookup()[productId];
  }

  async updateQuantity(productId: string, qty: number): Promise<void> {
    await this.cartService.updateQuantity(productId, Number(qty));
    this.toastService.info('Cart quantity updated.');
  }

  async removeItem(productId: string): Promise<void> {
    await this.cartService.removeFromCart(productId);
    this.toastService.info('Item removed from cart.');
  }

  async clearCart(): Promise<void> {
    await this.cartService.clearCart();
    this.toastService.info('Cart cleared.');
  }
}
