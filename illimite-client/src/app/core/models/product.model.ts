export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  stock: number;
  imageUrl: string;
  rating: number;
  active: boolean;
  createdAt: any; // Firestore Timestamp or Date
}
