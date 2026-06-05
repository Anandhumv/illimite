import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  // currentUser: undefined (loading), null (not authenticated), UserProfile (authenticated)
  readonly currentUser = signal<UserProfile | null | undefined>(undefined);

  constructor() {
    // Listen to Firebase Auth state changes
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await this.syncUserProfile(firebaseUser);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  /**
   * Fetch user profile from Firestore and update currentUser signal.
   */
  private async syncUserProfile(firebaseUser: FirebaseUser): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        this.currentUser.set(userDocSnap.data() as UserProfile);
      } else {
        // If profile does not exist yet (e.g. sign-up in progress),
        // build a temporary local profile until Firestore write completes.
        this.currentUser.set({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'customer',
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error syncing user profile from Firestore:', error);
      this.currentUser.set(null);
    }
  }

  /**
   * Register a new user with Email and Password.
   * Creates a credentials entry and a Firestore profile document.
   */
  async signUpWithEmailAndPassword(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserProfile> {
    try {
      // 1. Create firebase user credentials
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = credential.user;

      // 2. Set display name in auth profile
      await updateProfile(user, { displayName });

      // 3. Create profile document in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName,
        email,
        role: 'customer',
        createdAt: serverTimestamp()
      };

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, userProfile);

      // Convert timestamp for the signal state (since serverTimestamp resolves on server)
      const localProfile: UserProfile = {
        ...userProfile,
        createdAt: new Date()
      };

      this.currentUser.set(localProfile);
      return localProfile;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  /**
   * Login user with Email and Password.
   */
  async signInWithEmailAndPassword(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  /**
   * Login or register with Google and ensure a Firestore user profile exists.
   */
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      const firebaseUser = credential.user;
      const userDocRef = doc(this.firestore, `users/${firebaseUser.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const profile = userDocSnap.data() as UserProfile;
        this.currentUser.set(profile);
        return profile;
      }

      const userProfile: UserProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email || '',
        role: 'customer',
        createdAt: serverTimestamp()
      };

      await setDoc(userDocRef, userProfile);

      const localProfile: UserProfile = {
        ...userProfile,
        createdAt: new Date()
      };

      this.currentUser.set(localProfile);
      return localProfile;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    }
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.getIdToken() : null;
  }

  /**
   * Log out the current user.
   */
  async signOut(): Promise<void> {
    try {
      await fbSignOut(this.auth);
      this.currentUser.set(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }
}
