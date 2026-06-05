import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetailComponent } from './product-detail';
import { ApiProductService } from '../../services/api-product.service';
import { CartService } from '../../core/services/cart.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'sample-product'
              }
            }
          }
        },
        {
          provide: ApiProductService,
          useValue: {
            getProductById: () => of({
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
            })
          }
        },
        {
          provide: CartService,
          useValue: {
            addToCart: () => Promise.resolve()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
