import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { debounce } from './debounce';

const CART_COLLECTION = 'carts';

async function syncCartToFirestore(firestore, userId, cartItems) {
  const cartRef = doc(firestore, `${CART_COLLECTION}/${userId}`);
  await setDoc(cartRef, {
    uid: userId,
    items: cartItems,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function createDebouncedCartSync(firestore, userId, delay = 500) {
  const sync = debounce((cartItems) => {
    syncCartToFirestore(firestore, userId, cartItems);
  }, delay);

  return {
    sync,
    cancel: () => sync.cancel(),
    flush: (cartItems) => sync.flush(cartItems),
  };
}
