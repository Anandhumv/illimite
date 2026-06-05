import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css'
})
export class OrderConfirmationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly message = signal('');
  readonly isLoading = signal(true);

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
      this.message.set(error instanceof Error ? error.message : 'Unable to load confirmation.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
