import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { ApiProductService } from './services/api-product.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: ApiProductService,
          useValue: {
            getProducts: () => of([
              {
                id: 'product-1',
                name: 'Lumiere Pendant Light',
                description: 'A seeded catalog product.',
                price: 189,
                imageUrl: '',
                slug: 'lumiere-pendant-light',
                categoryId: 'lighting',
                categoryName: 'Lighting',
                stock: 25,
                createdAt: new Date().toISOString()
              }
            ])
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the product catalog', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Curated products');
    expect(compiled.textContent).toContain('Lumiere Pendant Light');
  });
});
