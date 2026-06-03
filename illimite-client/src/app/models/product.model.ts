export interface Product {
  id: string;          // The auto-assigned or slug-based Firestore document id
  slug: string;        // URL-friendly identifier (e.g., 'aura-pendant-light')
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;  // Explicit link to the matching categories collection document
  categoryName: string;// Denormalized field for fast rendering without separate queries
  stock: number;       // Corrected property name matching your checkout transaction
  createdAt: string;
}