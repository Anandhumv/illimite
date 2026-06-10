export interface OrderItem {
  productId: string;
  name?: string;
  imageUrl?: string;
  qty: number;
  price: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName?: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentRef: string;
  createdAt: any; // Firestore Timestamp or Date
  updatedAt?: any;
}
