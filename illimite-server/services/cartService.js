const { db } = require('../config/firebase');

const CART_COLLECTION = 'carts';

async function getCart(userId) {
  const snap = await db.collection(CART_COLLECTION).doc(userId).get();
  return snap.exists ? snap.data().items : [];
}

async function syncCart(userId, cartItems) {
  await db.collection(CART_COLLECTION).doc(userId).set(
    { items: cartItems },
    { merge: true }
  );
}

module.exports = { getCart, syncCart };
