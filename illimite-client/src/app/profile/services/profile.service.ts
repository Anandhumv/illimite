import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    updatedAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private firestore = inject(Firestore);
    private auth = inject(Auth);

    getUserProfile(): Observable<UserProfile | null> {
        return user(this.auth).pipe(
            switchMap((currentUser) => {
                if (!currentUser) return of(null);
                const userDocRef = doc(this.firestore, `users/${currentUser.uid}`);
                return docData(userDocRef) as Observable<UserProfile>;
            })
        );
    }

    updateUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        return setDoc(userDocRef, {
            uid,
            ...profileData,
            updatedAt: Date.now()
        }, { merge: true });
    }
}