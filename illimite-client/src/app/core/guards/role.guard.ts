import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: Array<UserProfile['role']> = route.data['roles'] ?? [];

  return toObservable(authService.currentUser).pipe(
    filter(user => user !== undefined),
    take(1),
    map(user => {
      if (!user) {
        return router.createUrlTree(['/auth/login']);
      }
      if (requiredRoles.length === 0 || requiredRoles.includes(user.role)) {
        return true;
      }
      return router.createUrlTree(['/unauthorized']);
    })
  );
};
