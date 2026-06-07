import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistItem, WishlistService } from '../../core/services/wishlist.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);

  readonly items = signal<WishlistItem[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.wishlistService.getWishlistItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load wishlist:', error);
        this.errorMessage.set('Unable to load your wishlist right now.');
        this.isLoading.set(false);
      }
    });
  }

  async removeItem(productId: string): Promise<void> {
    try {
      await this.wishlistService.removeFromWishlist(productId);
      this.toastService.success('Removed from wishlist.');
    } catch (error) {
      console.error('Failed to remove wishlist item:', error);
      this.toastService.error('Unable to remove this item.');
    }
  }
}
