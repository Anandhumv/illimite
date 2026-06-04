import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistoryComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);
  readonly message = signal('');

  async ngOnInit(): Promise<void> {
    try {
      this.orders.set(await this.orderService.getUserOrders());
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Unable to load orders.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
