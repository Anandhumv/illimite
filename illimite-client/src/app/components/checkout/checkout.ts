import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ApiProductService } from '../../services/api-product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly apiProductService = inject(ApiProductService);

  shippingAddress = '';
  paymentRef = 'mock-payment-ref';
  readonly message = signal('');
  readonly isSubmitting = signal(false);
  readonly productLookup = signal<Record<string, Product>>({});
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
      },
      error: (err) => console.error('Failed to load checkout product summaries:', err)
    });
  }

  productFor(productId: string): Product | undefined {
    return this.productLookup()[productId];
  }

  async updateQuantity(productId: string, qty: number): Promise<void> {
    await this.cartService.updateQuantity(productId, qty);
  }

  async removeItem(productId: string): Promise<void> {
    await this.cartService.removeFromCart(productId);
  }

  async submitOrder(): Promise<void> {
    this.message.set('');

    if (!this.shippingAddress.trim()) {
      this.message.set('Add a shipping address before placing the order.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const order = await this.orderService.placeOrder(this.shippingAddress, this.paymentRef);
      this.message.set(`Order ${order.id} created successfully.`);
    } catch (error) {
      const fallback = 'Checkout skeleton is ready. Sign in and add cart items to place an order.';
      this.message.set(error instanceof Error ? error.message : fallback);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
