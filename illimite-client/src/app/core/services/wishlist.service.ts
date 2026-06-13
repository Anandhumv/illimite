import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { AuthService } from './auth.service';

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  addedAt?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly guestWishlistKey = 'illimite_guest_wishlist';

  async addToWishlist(product: Product): Promise<void> {
    const user = this.authService.currentUser();
    const productId = product.id || product.slug;

    if (!user) {
      const items = this.getGuestWishlistItems();
      const nextItem = this.createWishlistItem(product, productId, new Date().toISOString());
      const nextItems = [
        nextItem,
        ...items.filter((item) => item.productId !== productId)
      ];

      this.setGuestWishlistItems(nextItems);
      return;
    }

    const wishlistItemRef = doc(this.firestore, `wishlists/${user.uid}/items/${productId}`);

    await setDoc(wishlistItemRef, {
      ...this.createWishlistItem(product, productId),
      addedAt: serverTimestamp()
    }, { merge: true });
  }

  getWishlistItems(): Observable<WishlistItem[]> {
    const user = this.authService.currentUser();

    if (!user) {
      return of(this.getGuestWishlistItems());
    }

    const wishlistItemsRef = collection(this.firestore, `wishlists/${user.uid}/items`);
    return collectionData(wishlistItemsRef) as Observable<WishlistItem[]>;
  }

  async removeFromWishlist(productId: string): Promise<void> {
    const user = this.authService.currentUser();

    if (!user) {
      this.setGuestWishlistItems(
        this.getGuestWishlistItems().filter((item) => item.productId !== productId)
      );
      return;
    }

    await deleteDoc(doc(this.firestore, `wishlists/${user.uid}/items/${productId}`));
  }

  private createWishlistItem(product: Product, productId: string, addedAt?: unknown): WishlistItem {
    return {
      productId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      addedAt
    };
  }

  private getGuestWishlistItems(): WishlistItem[] {
    try {
      const rawItems = localStorage.getItem(this.guestWishlistKey);
      return rawItems ? JSON.parse(rawItems) as WishlistItem[] : [];
    } catch {
      return [];
    }
  }

  private setGuestWishlistItems(items: WishlistItem[]): void {
    localStorage.setItem(this.guestWishlistKey, JSON.stringify(items));
  }
}
