import { inject, Injectable, signal, effect, untracked } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  readonly cartItems = signal<CartItem[]>([]);
  private readonly GUEST_CART_KEY = 'illimite_guest_cart';

  constructor() {
    // Monitor auth state changes to load and sync cart
    effect(() => {
      const user = this.authService.currentUser();
      
      // If auth is loading, do nothing
      if (user === undefined) return;

      // Wrap state changes in untracked to avoid triggering circular dependencies
      untracked(async () => {
        if (user) {
          // Logged in user: load from Firestore, merging any guest cart items
          await this.syncGuestCartToFirestore(user.uid);
        } else {
          // Guest user: load from local storage
          this.loadGuestCart();
        }
      });
    });
  }

  /**
   * Load the cart from local storage for guests.
   */
  private loadGuestCart(): void {
    const raw = localStorage.getItem(this.GUEST_CART_KEY);
    if (raw) {
      try {
        this.cartItems.set(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse guest cart:', e);
        this.cartItems.set([]);
      }
    } else {
      this.cartItems.set([]);
    }
  }

  /**
   * Save the cart to local storage for guests.
   */
  private saveGuestCart(items: CartItem[]): void {
    localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(items));
  }

  /**
   * Synchronize guest cart items into Firestore cart when logging in.
   */
  private async syncGuestCartToFirestore(uid: string): Promise<void> {
    try {
      // 1. Get guest cart items
      const guestRaw = localStorage.getItem(this.GUEST_CART_KEY);
      let guestItems: CartItem[] = [];
      if (guestRaw) {
        try {
          guestItems = JSON.parse(guestRaw);
        } catch {
          // ignore
        }
      }

      // 2. Fetch current user cart from Firestore
      const cartDocRef = doc(this.firestore, `carts/${uid}`);
      const cartSnap = await getDoc(cartDocRef);
      let firestoreItems: CartItem[] = [];

      if (cartSnap.exists()) {
        const cartData = cartSnap.data() as Cart;
        firestoreItems = cartData.items || [];
      }

      // 3. Merge guest items into firestore items
      const mergedItems = [...firestoreItems];
      for (const guestItem of guestItems) {
        const existing = mergedItems.find(item => item.productId === guestItem.productId);
        if (existing) {
          existing.qty += guestItem.qty;
        } else {
          mergedItems.push({ ...guestItem });
        }
      }

      // 4. Update Firestore
      await setDoc(cartDocRef, {
        uid,
        items: mergedItems,
        updatedAt: serverTimestamp()
      });

      // 5. Update local state & clear local storage guest cart
      this.cartItems.set(mergedItems);
      localStorage.removeItem(this.GUEST_CART_KEY);
    } catch (error) {
      console.error('Error syncing guest cart to Firestore:', error);
      // Fallback: just load from Firestore, do not overwrite if Firestore fetch fails
    }
  }

  /**
   * Write cart state to storage (Firestore for auth user, LocalStorage for guest).
   */
  private async persistCart(items: CartItem[]): Promise<void> {
    this.cartItems.set(items);

    const user = this.authService.currentUser();
    if (user) {
      try {
        const cartDocRef = doc(this.firestore, `carts/${user.uid}`);
        await setDoc(cartDocRef, {
          uid: user.uid,
          items,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error saving cart to Firestore:', error);
      }
    } else {
      this.saveGuestCart(items);
    }
  }

  /**
   * Add an item to the cart.
   */
  async addToCart(productId: string, qty: number, priceAtAdd: number): Promise<void> {
    const current = [...this.cartItems()];
    const existing = current.find(item => item.productId === productId);

    if (existing) {
      existing.qty += qty;
    } else {
      current.push({ productId, qty, priceAtAdd });
    }

    await this.persistCart(current);
  }

  /**
   * Update the quantity of a specific item in the cart.
   */
  async updateQuantity(productId: string, qty: number): Promise<void> {
    if (qty <= 0) {
      await this.removeFromCart(productId);
      return;
    }

    const current = this.cartItems().map(item => {
      if (item.productId === productId) {
        return { ...item, qty };
      }
      return item;
    });

    await this.persistCart(current);
  }

  /**
   * Remove an item from the cart.
   */
  async removeFromCart(productId: string): Promise<void> {
    const current = this.cartItems().filter(item => item.productId !== productId);
    await this.persistCart(current);
  }

  /**
   * Clear all items in the cart.
   */
  async clearCart(): Promise<void> {
    await this.persistCart([]);
  }
}
