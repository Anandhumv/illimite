import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiProductService } from '../../services/api-product.service';
import { CommentService, StorefrontComment } from '../../services/comment.service';
import { Product } from '../../models/product.model';
import { Order, OrderStatus } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

interface ProductForm {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  stock: number;
}

type AdminSection = 'catalog' | 'inventory' | 'fulfillment' | 'comments';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private readonly apiProductService = inject(ApiProductService);
  private readonly commentService = inject(CommentService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<{ id: string; name: string; slug: string; imageUrl: string }[]>([]);
  readonly orders = signal<Order[]>([]);
  readonly comments = signal<StorefrontComment[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly adminMessage = signal('');
  readonly editingProductId = signal<string | null>(null);
  readonly activeSection = signal<AdminSection>('catalog');
  readonly orderStatuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
  readonly activeOrderStatuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
  readonly productForm = signal<ProductForm>(this.emptyProductForm());
  readonly lowStockCount = computed(() => this.products().filter(product => product.stock <= 5).length);
  readonly totalStock = computed(() => this.products().reduce((sum, product) => sum + product.stock, 0));
  readonly openOrders = computed(() =>
    this.orders().filter(order => !['delivered', 'cancelled'].includes(order.status)).length
  );
  readonly metrics = computed(() => [
    { label: 'Products', value: String(this.products().length) },
    { label: 'Low stock', value: String(this.lowStockCount()) },
    { label: 'Units available', value: String(this.totalStock()) },
    { label: 'Open orders', value: String(this.openOrders()) },
    { label: 'Comments', value: String(this.comments().length) }
  ]);

  async ngOnInit(): Promise<void> {
    await this.loadAdminData();
  }

  async loadAdminData(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const [products, categories, orders, comments] = await Promise.all([
        firstValueFrom(this.apiProductService.getProducts()),
        firstValueFrom(this.apiProductService.getCategories()),
        this.orderService.getAllOrders(),
        firstValueFrom(this.commentService.getAdminComments())
      ]);

      this.products.set(products);
      this.categories.set(categories);
      this.orders.set(orders);
      this.comments.set(comments);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load admin data.';
      this.errorMessage.set(message);
      this.toastService.error(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  updateForm(field: keyof ProductForm, value: string | number): void {
    const next = { ...this.productForm(), [field]: value };

    if (field === 'name' && !this.editingProductId()) {
      next.slug = this.slugify(String(value));
      next.id = next.slug;
    }

    if (field === 'categoryId') {
      const category = this.categories().find(item => item.id === value);
      next.categoryName = category?.name || '';
    }

    this.productForm.set(next);
  }

  editProduct(product: Product): void {
    this.activeSection.set('catalog');
    this.editingProductId.set(product.id);
    this.productForm.set({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      stock: product.stock
    });
    this.adminMessage.set('');
  }

  resetForm(): void {
    this.editingProductId.set(null);
    this.productForm.set(this.emptyProductForm());
  }

  async saveProduct(): Promise<void> {
    const form = this.productForm();

    if (!form.name.trim() || !form.slug.trim() || !form.categoryId) {
      this.adminMessage.set('Product name, slug, and category are required.');
      this.toastService.error(this.adminMessage());
      return;
    }

    const payload: Product = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrls: form.imageUrl ? [form.imageUrl] : [],
      createdAt: new Date().toISOString()
    };

    this.isSaving.set(true);
    this.adminMessage.set('');

    try {
      if (this.editingProductId()) {
        const response = await firstValueFrom(
          this.apiProductService.updateProduct(this.editingProductId() || form.id, payload)
        );
        this.products.update(products =>
          products.map(product => product.id === response.product.id ? response.product : product)
        );
        this.adminMessage.set('Product updated successfully.');
        this.toastService.success(this.adminMessage());
      } else {
        const response = await firstValueFrom(this.apiProductService.createProduct(payload));
        this.products.update(products => [response.product, ...products]);
        this.adminMessage.set('Product created successfully.');
        this.toastService.success(this.adminMessage());
      }

      this.resetForm();
    } catch (error) {
      this.adminMessage.set(error instanceof Error ? error.message : 'Unable to save product.');
      this.toastService.error(this.adminMessage());
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteProduct(product: Product): Promise<void> {
    const confirmed = window.confirm(`Delete ${product.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      await firstValueFrom(this.apiProductService.deleteProduct(product.id));
      this.products.update(products => products.filter(item => item.id !== product.id));
      this.adminMessage.set('Product deleted successfully.');
      this.toastService.success(this.adminMessage());
    } catch (error) {
      this.adminMessage.set(error instanceof Error ? error.message : 'Unable to delete product.');
      this.toastService.error(this.adminMessage());
    }
  }

  async updateOrderStatus(order: Order, status: OrderStatus): Promise<void> {
    if (order.status === status) {
      return;
    }

    try {
      await this.orderService.updateOrderStatus(order.id, status);
      this.orders.update(orders =>
        orders.map(item => item.id === order.id ? { ...item, status } : item)
      );
      this.adminMessage.set(`Order moved to ${status}.`);
      this.toastService.success(this.adminMessage());
    } catch (error) {
      this.adminMessage.set(error instanceof Error ? error.message : 'Unable to update order status.');
      this.toastService.error(this.adminMessage());
    }
  }

  statusStepState(order: Order, status: OrderStatus): 'done' | 'current' | 'pending' | 'cancelled' {
    if (order.status === 'cancelled') {
      return status === 'cancelled' ? 'cancelled' : 'pending';
    }

    const currentIndex = this.activeOrderStatuses.indexOf(order.status);
    const statusIndex = this.activeOrderStatuses.indexOf(status);

    if (statusIndex < currentIndex) {
      return 'done';
    }

    if (statusIndex === currentIndex) {
      return 'current';
    }

    return 'pending';
  }

  shortId(value: string): string {
    const normalized = (value || 'Customer').trim();
    return normalized.length > 8 ? normalized.slice(0, 8) : normalized;
  }

  setActiveSection(section: AdminSection): void {
    this.activeSection.set(section);
  }

  private emptyProductForm(): ProductForm {
    return {
      id: '',
      slug: '',
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: '',
      categoryName: '',
      stock: 0
    };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
