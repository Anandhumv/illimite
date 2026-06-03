export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'shipped';
  createdAt: Date;
}
