import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    // 🔓 Public Routes (Login / Registration grouped under /auth)
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./auth/components/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./auth/components/register/register.component').then(m => m.RegisterComponent)
            }
        ]
    },

    // 🔐 Protected User Area (Requires simple authentication)
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
    },

    // 🔑 Restricted Administrative Panel (Requires Admin Permissions)
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] }, // Passed down smoothly to your guard's ActivatedRouteSnapshot
        loadComponent: () =>
            import('./admin/admin-panel.component').then(m => m.AdminPanelComponent)
    },

    // 🔄 Fallback Navigation Rules
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirects to dashboard; authGuard will catch it if they aren't logged in!
    { path: '**', redirectTo: 'dashboard' } // Smart catch-all handling
];