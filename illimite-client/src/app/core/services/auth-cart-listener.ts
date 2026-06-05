import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const GUEST_CART_KEY = 'illimite_guest_cart';

interface CartItem {
  productId: string;
  qty: number;
  priceAtAdd: number;
}

interface Cart {
  uid: string;
  items: CartItem[];
  updatedAt: any;
}

function getGuestCart(): CartItem[] {
  const raw = localStorage.getItem(GUEST_CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY);
}

function mergeCartItems(firestoreItems: CartItem[], guestItems: CartItem[]): CartItem[] {
  const merged = [...firestoreItems];
  for (const guestItem of guestItems) {
    const existing = merged.find(item => item.productId === guestItem.productId);
    if (existing) {
      existing.qty += guestItem.qty;
    } else {
      merged.push({ ...guestItem });
    }
  }
  return merged;
}

export function initAuthCartListener(
  auth: Auth,
  firestore: Firestore,
  onCartChange: (items: CartItem[]) => void
): () => void {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const guestItems = getGuestCart();

      const cartRef = doc(firestore, `carts/${user.uid}`);
      const cartSnap = await getDoc(cartRef);
      const firestoreItems: CartItem[] = cartSnap.exists()
        ? (cartSnap.data() as Cart).items || []
        : [];

      const merged = guestItems.length
        ? mergeCartItems(firestoreItems, guestItems)
        : firestoreItems;

      await setDoc(cartRef, {
        uid: user.uid,
        items: merged,
        updatedAt: serverTimestamp()
      }, { merge: true });

      clearGuestCart();
      onCartChange(merged);
    } else {
      clearGuestCart();
      onCartChange([]);
    }
  });
}
