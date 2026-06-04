import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { AdminProductsComponent } from './components/admin-products/admin-products';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'products/:slug', component: ProductDetailComponent },
    { path: 'admin/products', component: AdminProductsComponent },
    // Add fallback redirect paths or home pages if applicable...
];