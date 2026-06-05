import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Get the allowed roles declared on the route (e.g. data: { roles: ['admin'] })
  const expectedRoles: Array<UserProfile['role']> = route.data['roles'] ?? [];

  // 2. Read the current user from the signal (already resolved by authGuard running first)
  const user = authService.currentUser();

  // 3. Verify access
  if (user && (expectedRoles.length === 0 || expectedRoles.includes(user.role))) {
    return true; // ✅ Access granted
  }

  // ❌ Access denied — redirect to dashboard
  return router.createUrlTree(['/dashboard']);
};