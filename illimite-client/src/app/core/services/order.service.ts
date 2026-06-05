import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { Order, OrderStatus } from '../models/order.model';

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  message: string;
  order: Order;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly apiBaseUrl = 'http://localhost:5000/api';

  async placeOrder(shippingAddress: string, paymentRef: string): Promise<Order> {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User must be logged in to place an order.');
    }

    const items = this.cartService.cartItems();
    if (items.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }

    const response = await firstValueFrom(
      this.http.post<CreateOrderResponse>(`${this.apiBaseUrl}/orders`, {
        items,
        shippingAddress,
        paymentRef
      })
    );

    await this.cartService.clearCart();
    return response.order;
  }

  async getUserOrders(): Promise<Order[]> {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User must be logged in to view their orders.');
    }

    return await firstValueFrom(this.http.get<Order[]>(`${this.apiBaseUrl}/orders`));
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return await firstValueFrom(this.http.get<Order>(`${this.apiBaseUrl}/orders/${orderId}`));
  }

  async getAllOrders(): Promise<Order[]> {
    return await firstValueFrom(this.http.get<Order[]>(`${this.apiBaseUrl}/admin/orders`));
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${this.apiBaseUrl}/orders/${orderId}/status`, { status })
    );
  }
}
