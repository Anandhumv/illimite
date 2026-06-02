export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: any; // Firestore Timestamp or Date
}
