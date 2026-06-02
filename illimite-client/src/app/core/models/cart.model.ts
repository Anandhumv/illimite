export interface CartItem {
  productId: string;
  qty: number;
  priceAtAdd: number;
}

export interface Cart {
  uid: string;
  items: CartItem[];
  updatedAt: any; // Firestore Timestamp or Date
}
