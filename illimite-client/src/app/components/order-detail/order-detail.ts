import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);

  readonly order = signal<Order | null>(null);
  readonly isLoading = signal(true);
  readonly message = signal('');
  readonly activeOrderStatuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

  async ngOnInit(): Promise<void> {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.message.set('Order ID was not provided.');
      this.isLoading.set(false);
      return;
    }

    try {
      this.order.set(await this.orderService.getOrderById(orderId));
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Unable to load order.');
      this.toastService.error(this.message());
    } finally {
      this.isLoading.set(false);
    }
  }

  statusStepState(order: Order, status: OrderStatus): 'done' | 'current' | 'pending' {
    const currentIndex = this.activeOrderStatuses.indexOf(order.status);
    const statusIndex = this.activeOrderStatuses.indexOf(status);

    if (statusIndex < currentIndex) {
      return 'done';
    }

    if (statusIndex === currentIndex) {
      return 'current';
    }

    return 'pending';
  }
}
