import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductDetailComponent } from './components/product-detail/product-detail';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'products/:slug', component: ProductDetailComponent }, // Dynamic route handler
    { path: '**', redirectTo: '' }
];
