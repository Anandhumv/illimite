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

  async addToWishlist(product: Product): Promise<void> {
    const user = this.authService.currentUser();

    if (!user) {
      throw new Error('User must be logged in to use the wishlist.');
    }

    const productId = product.id || product.slug;
    const wishlistItemRef = doc(this.firestore, `wishlists/${user.uid}/items/${productId}`);

    await setDoc(wishlistItemRef, {
      productId,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      addedAt: serverTimestamp()
    }, { merge: true });
  }

  getWishlistItems(): Observable<WishlistItem[]> {
    const user = this.authService.currentUser();

    if (!user) {
      return of([]);
    }

    const wishlistItemsRef = collection(this.firestore, `wishlists/${user.uid}/items`);
    return collectionData(wishlistItemsRef) as Observable<WishlistItem[]>;
  }

  async removeFromWishlist(productId: string): Promise<void> {
    const user = this.authService.currentUser();

    if (!user) {
      throw new Error('User must be logged in to use the wishlist.');
    }

    await deleteDoc(doc(this.firestore, `wishlists/${user.uid}/items/${productId}`));
  }
}
