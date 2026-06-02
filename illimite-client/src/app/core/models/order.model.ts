export interface OrderItem {
  productId: string;
  qty: number;
  price: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentRef: string;
  createdAt: any; // Firestore Timestamp or Date
}
