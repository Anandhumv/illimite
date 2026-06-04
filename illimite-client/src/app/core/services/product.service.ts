import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly firestore = inject(Firestore);

  /**
   * Fetch all categories.
   */
  async getCategories(): Promise<Category[]> {
    try {
      const categoriesCol = collection(this.firestore, 'categories');
      const categorySnapshot = await getDocs(categoriesCol);
      return categorySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Fetch all products.
   */
  async getProducts(): Promise<Product[]> {
    try {
      const productsCol = collection(this.firestore, 'products');
      const productSnapshot = await getDocs(productsCol);
      return productSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Fetch a single product by ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const productDocRef = doc(this.firestore, `products/${id}`);
      const productSnapshot = await getDoc(productDocRef);
      if (productSnapshot.exists()) {
        return {
          id: productSnapshot.id,
          ...productSnapshot.data()
        } as Product;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Fetch products filtered by category ID.
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const productsCol = collection(this.firestore, 'products');
      const q = query(productsCol, where('categoryId', '==', categoryId));
      const productSnapshot = await getDocs(q);
      return productSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Product[];
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch only active products (active === true).
   */
  async getActiveProducts(): Promise<Product[]> {
    try {
      const productsCol = collection(this.firestore, 'products');
      const q = query(productsCol, where('active', '==', true));
      const productSnapshot = await getDocs(q);
      return productSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Product[];
    } catch (error) {
      console.error('Error fetching active products:', error);
      throw error;
    }
  }
}
