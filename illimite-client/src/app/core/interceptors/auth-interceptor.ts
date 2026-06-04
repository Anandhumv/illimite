import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { Auth } from '@angular/fire/auth';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(Auth);

  return from(auth.currentUser?.getIdToken() ?? Promise.resolve(null)).pipe(
    switchMap(token => {
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(cloned);
      }
      return next(req);
    })
  );
};
