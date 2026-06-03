import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  productSlug: string | null = null;
  isLoading = true;

  // Day 3 Mock Data Placeholder for UI skeleton layout
  mockProduct = {
    name: 'Premium Interior Sample Feature',
    categoryName: 'Design Curation',
    price: 599,
    description: 'This is a premium design asset placeholder. On Day 4, this space will dynamically render full item metadata straight from your working Firestore document collection streams.',
    stock: 12,
    imageUrl: ''
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Read the parameter safely out of the routing path
    this.productSlug = this.route.snapshot.paramMap.get('slug');

    // Simulate a fast minimal loading frame
    setTimeout(() => {
      this.isLoading = false;
    }, 600);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  }
}