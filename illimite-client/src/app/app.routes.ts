import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ProfileComponent } from './components/profile/profile';
import { CheckoutComponent } from './components/checkout/checkout';
import { OrderHistoryComponent } from './components/order-history/order-history';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'products/:slug', component: ProductDetailComponent }, // Dynamic route handler
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: '' }
];
