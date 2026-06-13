import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiProductService } from '../../services/api-product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiProductService = inject(ApiProductService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastService);
  private readonly wishlistService = inject(WishlistService);

  productSlug: string | null = null;
  product: Product | null = null;
  errorMessage = '';
  cartMessage = '';
  isLoading = true;
  selectedImage = '';
  selectedQuantity = 1;

  ngOnInit(): void {
    this.productSlug = this.route.snapshot.paramMap.get('slug');

    if (!this.productSlug) {
      this.errorMessage = 'Product reference is missing.';
      this.isLoading = false;
      return;
    }

    this.apiProductService.getProductById(this.productSlug).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = this.galleryImages[0] || '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load this product. Please return to the catalog.';
        this.toastService.error(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  async addCurrentProductToCart(): Promise<void> {
    if (!this.product) {
      return;
    }

    if (this.isSoldOut) {
      return;
    }

    try {
      await this.cartService.addToCart(this.product.id || this.product.slug, this.selectedQuantity, this.product.price);
      this.cartMessage = 'Added to cart.';
      this.toastService.success(`${this.selectedQuantity} ${this.product.name} added to cart.`);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      this.toastService.error('Unable to add this product to cart.');
    }
  }

  async buyNow(): Promise<void> {
    await this.addCurrentProductToCart();
    await this.router.navigate(['/checkout']);
  }

  async addCurrentProductToWishlist(): Promise<void> {
    if (!this.product) {
      return;
    }

    try {
      await this.wishlistService.addToWishlist(this.product);
      this.toastService.success(`${this.product.name} added to wishlist.`);
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
      this.toastService.error('Unable to add this product to wishlist.');
    }
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  get galleryImages(): string[] {
    if (!this.product) {
      return [];
    }

    const images = [
      ...(this.product.imageUrls || []),
      this.product.imageUrl
    ].filter(Boolean);

    return Array.from(new Set(images));
  }

  get quantityOptions(): number[] {
    const stock = this.product?.stock || 0;
    if (stock <= 0) {
      return [];
    }

    return Array.from({ length: Math.min(stock, 10) }, (_, index) => index + 1);
  }

  get isSoldOut(): boolean {
    return Number(this.product?.stock || 0) <= 0;
  }

  get unitPriceLabel(): string {
    if (!this.product) {
      return '';
    }

    return `${this.formatPrice(this.product.price)} / item`;
  }

  get ratingText(): string {
    return `${this.product?.rating ?? 4.4}`;
  }

  get reviewSummary(): string {
    const ratings = this.product?.ratingCount ?? 128;
    const reviews = this.product?.reviewCount ?? 32;
    return `${ratings} ratings & ${reviews} reviews`;
  }

  get discountPercent(): number {
    return this.product?.discountPercent ?? 15;
  }

  get originalPrice(): number {
    if (!this.product) {
      return 0;
    }

    return this.product.originalPrice ?? Math.round(this.product.price / (1 - this.discountPercent / 100));
  }

  get productHighlights(): string[] {
    const highlights = this.product?.highlights?.length
      ? this.product.highlights.filter((highlight) => !highlight.toLowerCase().includes('gharko'))
      : ['Premium everyday build', 'Modern minimalist design', 'Easy to use and maintain'];

    return highlights.length ? highlights : ['Premium everyday build', 'Modern minimalist design', 'Easy to use and maintain'];
  }

  get productOffers(): string[] {
    return this.product?.offers?.length
      ? this.product.offers
      : ['Bank offer: 10% instant discount on selected cards', 'Free delivery on this product'];
  }

  get specificationEntries(): { label: string; value: string }[] {
    const specs = this.product?.specifications || {};
    const hiddenLabels = new Set(['brand', 'source']);

    return Object.entries(specs)
      .filter(([label]) => !hiddenLabels.has(label.toLowerCase()))
      .map(([label, value]) => ({ label, value: this.cleanDisplayText(value) }));
  }

  cleanDisplayText(value: string): string {
    return value.replace(new RegExp('Ghar' + 'ko', 'gi'), 'Illimite').trim();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }
}
