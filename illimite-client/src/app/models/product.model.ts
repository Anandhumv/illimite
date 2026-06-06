export interface Product {
  id: string;          // The auto-assigned or slug-based Firestore document id
  slug: string;        // URL-friendly identifier (e.g., 'aura-pendant-light')
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageUrls?: string[];
  categoryId: string;  // Explicit link to the matching categories collection document
  categoryName: string;// Denormalized field for fast rendering without separate queries
  stock: number;       // Corrected property name matching your checkout transaction
  createdAt: string;
  rating?: number;
  ratingCount?: number;
  reviewCount?: number;
  discountPercent?: number;
  originalPrice?: number;
  brand?: string;
  seller?: string;
  warranty?: string;
  deliveryText?: string;
  returnPolicy?: string;
  highlights?: string[];
  offers?: string[];
  specifications?: Record<string, string>;
}
