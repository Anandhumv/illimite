import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, user, User } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth, private store: Store) {
    this.user$ = user(this.auth);
  }

  // 1. Register with Email and Password
  registerWithEmail(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // 2. Login with Email and Password
  loginWithEmail(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password).then((credential) => {
      this.handleAuthSuccess(credential.user);
      return credential;
    });
  }

  // 3. Google Sign-In (Pop-up window)
  signInWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider).then((credential) => {
      this.handleAuthSuccess(credential.user);
      return credential;
    });
  }

  // 4. Logout Session
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // Helper function to extract user details
  private async handleAuthSuccess(user: User) {
    const token = await user.getIdToken();
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      token: token
    };
    console.log('User authenticated profile:', userProfile);
  }
}