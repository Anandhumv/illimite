import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',   // Ensure no '.component' chunk is here
  styleUrl: './product-card.css'       // Ensure no '.component' chunk is here
})
export class ProductCard {
  // Receives individual product objects from your parent app.html loop
  @Input({ required: true }) product!: Product;

  getProductInitial(product: Product): string {
    return (product.categoryName || product.name || 'P').charAt(0).toUpperCase();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
}