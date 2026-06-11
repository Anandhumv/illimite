import { ProductCard } from './components/product-card/product-card';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs';
import { ApiProductService, CategoryOption } from './services/api-product.service';
import { CommentService } from './services/comment.service';
import { Product } from './models/product.model';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { UiLoaderComponent } from './components/shared/ui-loader/ui-loader';
import { UiEmptyStateComponent } from './components/shared/ui-empty-state/ui-empty-state';
import { UiDialogComponent } from './components/shared/ui-dialog/ui-dialog';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    ProductCard,
    UiLoaderComponent,
    UiEmptyStateComponent,
    UiDialogComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly apiProductService = inject(ApiProductService);
  private readonly commentService = inject(CommentService);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly toastService = inject(ToastService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<CategoryOption[]>([]);
  readonly searchTerm = signal<string>('');
  readonly selectedCategoryId = signal<string>('all');
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly commentName = signal('');
  readonly commentEmail = signal('');
  readonly commentMessage = signal('');
  readonly isPostingComment = signal(false);
  readonly filteredProducts = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const categoryId = this.selectedCategoryId();

    return this.products().filter((product) => {
      const matchesCategory = categoryId === 'all' || product.categoryId === categoryId;
      const searchableText = `${product.name} ${product.categoryName} ${product.description}`.toLowerCase();
      const matchesSearch = !query || searchableText.includes(query);
      return matchesCategory && matchesSearch;
    });
  });
  readonly productCount = computed(() => this.products().length);
  readonly filteredProductCount = computed(() => this.filteredProducts().length);
  readonly currentUrl = signal<string>('/');
  readonly isHomeRoute = computed(() => this.currentUrl() === '/' || this.currentUrl() === '');
  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');
  readonly heroProducts = computed(() => this.products().filter((product) => product.imageUrl).slice(0, 12));
  readonly heroSlides = computed(() => {
    const products = this.heroProducts();
    return products.length ? [...products, ...products] : [];
  });

  ngOnInit(): void {
    this.currentUrl.set(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));

    this.apiProductService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        const message = 'Unable to load products. Please confirm the backend is running on port 5000.';
        this.errorMessage.set(message);
        this.toastService.error(message);
        this.isLoading.set(false);
      }
    });

    this.apiProductService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.toastService.error('Unable to load categories.');
      }
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategoryId.set('all');
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
    document.getElementById('catalog-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  getCategoryDisplayName(category: CategoryOption): string {
    const labels: Record<string, string> = {
      'home-fragrance': 'Candles & Diffusers',
      'home-furnishing': 'Cushion & Throws'
    };

    return labels[category.id] || category.name;
  }

  trackByProductId(_: number, product: Product): string {
    return product.id;
  }

  getProductInitial(product: Product): string {
    return (product.categoryName || product.name || 'P').charAt(0).toUpperCase();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  }

  async addToCart(product: Product): Promise<void> {
    try {
      await this.cartService.addToCart(product.id || product.slug, 1, product.price);
      this.toastService.success(`${product.name} added to cart.`);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      this.toastService.error('Unable to add this product to cart.');
    }
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.toastService.info('Signed out successfully.');
    this.router.navigate(['/']);
  }

  postComment(): void {
    const name = this.commentName().trim();
    const email = this.commentEmail().trim();
    const message = this.commentMessage().trim();

    if (!name || !email || !message) {
      this.toastService.error('Please fill name, email, and message before posting.');
      return;
    }

    this.isPostingComment.set(true);
    this.commentService.createComment({ name, email, message }).subscribe({
      next: () => {
        this.commentName.set('');
        this.commentEmail.set('');
        this.commentMessage.set('');
        this.toastService.success('Comment sent successfully.');
        this.isPostingComment.set(false);
      },
      error: (error) => {
        console.error('Failed to post comment:', error);
        const message = error?.error?.details || error?.error?.error || 'Unable to post your comment right now.';
        this.toastService.error(message);
        this.isPostingComment.set(false);
      }
    });
  }
}
