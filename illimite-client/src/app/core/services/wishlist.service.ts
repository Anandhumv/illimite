import { inject, Injectable } from '@angular/core';
import { Firestore, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Product } from '../../models/product.model';
import { AuthService } from './auth.service';

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
}
