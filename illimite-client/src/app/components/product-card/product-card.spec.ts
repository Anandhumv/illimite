import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', {
      id: 'sample-product',
      slug: 'sample-product',
      name: 'Sample Product',
      description: 'Sample description',
      price: 99,
      imageUrl: '',
      categoryId: 'decor',
      categoryName: 'Decor',
      stock: 10,
      createdAt: new Date().toISOString()
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
