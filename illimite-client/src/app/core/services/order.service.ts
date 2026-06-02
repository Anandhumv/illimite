import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  orderBy
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { Order, OrderItem, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  /**
   * Place a new order using a Firestore Transaction.
   * Decrements stock counts and throws an error if any item is out of stock.
   */
  async placeOrder(shippingAddress: string, paymentRef: string): Promise<Order> {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User must be logged in to place an order.');
    }

    const cartItems = this.cartService.cartItems();
    if (cartItems.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }

    // Generate reference to a new Order doc ID
    const ordersCol = collection(this.firestore, 'orders');
    const orderDocRef = doc(ordersCol);
    const orderId = orderDocRef.id;

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.qty * item.priceAtAdd, 0);

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.productId,
      qty: item.qty,
      price: item.priceAtAdd
    }));

    const orderData: Omit<Order, 'createdAt'> & { createdAt: any } = {
      id: orderId,
      userId: user.uid,
      items: orderItems,
      total,
      status: 'pending',
      shippingAddress,
      paymentRef,
      createdAt: serverTimestamp()
    };

    try {
      // Execute within a transaction to safely handle stock subtraction
      await runTransaction(this.firestore, async (transaction) => {
        // 1. Read product stocks and verify availability
        const productSnapshots = [];
        for (const item of cartItems) {
          const productRef = doc(this.firestore, `products/${item.productId}`);
          const productSnap = await transaction.get(productRef);
          
          if (!productSnap.exists()) {
            throw new Error(`Product with ID ${item.productId} does not exist.`);
          }

          const productData = productSnap.data();
          const currentStock = productData['stock'] || 0;

          if (currentStock < item.qty) {
            throw new Error(`Insufficient stock for product "${productData['name']}". Available: ${currentStock}, Requested: ${item.qty}`);
          }

          productSnapshots.push({
            ref: productRef,
            newStock: currentStock - item.qty
          });
        }

        // 2. Perform updates (subtract stock)
        for (const prod of productSnapshots) {
          transaction.update(prod.ref, { stock: prod.newStock });
        }

        // 3. Write Order document
        transaction.set(orderDocRef, orderData);
      });

      // 4. Order successful! Clear client cart
      await this.cartService.clearCart();

      // Return local order object representation
      return {
        ...orderData,
        createdAt: new Date()
      } as Order;

    } catch (error) {
      console.error('Checkout transaction failed:', error);
      throw error;
    }
  }

  /**
   * Fetch all orders placed by the current user.
   */
  async getUserOrders(): Promise<Order[]> {
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error('User must be logged in to view their orders.');
    }

    try {
      const ordersCol = collection(this.firestore, 'orders');
      const q = query(
        ordersCol,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const ordersSnap = await getDocs(q);

      return ordersSnap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  /**
   * Fetch details of a single order by ID.
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(this.firestore, `orders/${orderId}`);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        return {
          id: orderSnap.id,
          ...orderSnap.data()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Update the status of an order. (Admin utility)
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const orderRef = doc(this.firestore, `orders/${orderId}`);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error(`Error updating order status for ${orderId}:`, error);
      throw error;
    }
  }
}
