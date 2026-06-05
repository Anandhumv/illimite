import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();

      if (!user) {
        toastService.info('Please sign in to continue.');
        resolve(router.createUrlTree(['/login']));
        return;
      }

      const profileRef = doc(firestore, `users/${user.uid}`);
      const profileSnap = await getDoc(profileRef);
      const role = profileSnap.exists() ? profileSnap.data()['role'] : 'customer';

      if (role === 'admin') {
        resolve(true);
        return;
      }

      toastService.error('Admin access is required for that page.');
      resolve(router.createUrlTree(['/']));
    });
  });
};
