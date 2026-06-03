export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stockCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
