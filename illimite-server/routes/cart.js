const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyFirebaseToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(verifyFirebaseToken);

const CART_COLLECTION = 'carts';

function cartRef(userId) {
  return db.collection(CART_COLLECTION).doc(userId);
}

function validateCartItem(item) {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.productId !== 'string' || !item.productId.trim()) return false;
  if (typeof item.name !== 'string' || !item.name.trim()) return false;
  if (typeof item.price !== 'number' || item.price < 0) return false;
  if (typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) return false;
  if (typeof item.imageUrl !== 'string') return false;
  return true;
}

// GET /api/cart — Fetch the authenticated user's cart
router.get('/', async (req, res) => {
  try {
    const snap = await cartRef(req.user.uid).get();
    const cart = snap.exists ? snap.data() : { uid: req.user.uid, items: [], updatedAt: new Date().toISOString() };
    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error('[Cart] Error fetching cart:', err.message);
    res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
  }
});

// PUT /api/cart — Replace the entire cart
router.put('/', async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  const invalid = items.find(item => !validateCartItem(item));
  if (invalid) {
    return res.status(400).json({
      error: 'Invalid cart item. Each item must have productId (string), name (string), price (number), quantity (positive integer), imageUrl (string).'
    });
  }

  try {
    const cartData = {
      uid: req.user.uid,
      items,
      updatedAt: new Date().toISOString()
    };

    await cartRef(req.user.uid).set(cartData, { merge: true });
    res.status(200).json({ success: true, cart: cartData, message: 'Cart updated' });
  } catch (err) {
    console.error('[Cart] Error replacing cart:', err.message);
    res.status(500).json({ error: 'Failed to update cart', details: err.message });
  }
});

// POST /api/cart/items — Add or update a single item in the cart
router.post('/items', async (req, res) => {
  const item = req.body;

  if (!validateCartItem(item)) {
    return res.status(400).json({
      error: 'Invalid item. Required: productId (string), name (string), price (number), quantity (positive integer), imageUrl (string).'
    });
  }

  try {
    const snap = await cartRef(req.user.uid).get();
    const cart = snap.exists ? snap.data() : { uid: req.user.uid, items: [] };

    const existingIndex = cart.items.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    const cartData = {
      uid: req.user.uid,
      items: cart.items,
      updatedAt: new Date().toISOString()
    };

    await cartRef(req.user.uid).set(cartData, { merge: true });
    res.status(200).json({ success: true, cart: cartData, message: 'Item added to cart' });
  } catch (err) {
    console.error('[Cart] Error adding item:', err.message);
    res.status(500).json({ error: 'Failed to add item to cart', details: err.message });
  }
});

// PATCH /api/cart/items/:productId — Update quantity of a specific item
router.patch('/items/:productId', async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (typeof quantity !== 'number' || quantity < 1 || !Number.isInteger(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a positive integer' });
  }

  try {
    const snap = await cartRef(req.user.uid).get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = snap.data();
    const index = cart.items.findIndex(i => i.productId === productId);

    if (index < 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[index].quantity = quantity;

    const cartData = {
      uid: req.user.uid,
      items: cart.items,
      updatedAt: new Date().toISOString()
    };

    await cartRef(req.user.uid).set(cartData, { merge: true });
    res.status(200).json({ success: true, cart: cartData, message: 'Item quantity updated' });
  } catch (err) {
    console.error('[Cart] Error updating item:', err.message);
    res.status(500).json({ error: 'Failed to update item', details: err.message });
  }
});

// DELETE /api/cart/items/:productId — Remove a specific item from the cart
router.delete('/items/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const snap = await cartRef(req.user.uid).get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cart = snap.data();
    const filtered = cart.items.filter(i => i.productId !== productId);

    if (filtered.length === cart.items.length) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const cartData = {
      uid: req.user.uid,
      items: filtered,
      updatedAt: new Date().toISOString()
    };

    await cartRef(req.user.uid).set(cartData, { merge: true });
    res.status(200).json({ success: true, cart: cartData, message: 'Item removed from cart' });
  } catch (err) {
    console.error('[Cart] Error removing item:', err.message);
    res.status(500).json({ error: 'Failed to remove item', details: err.message });
  }
});

// DELETE /api/cart — Clear the entire cart
router.delete('/', async (req, res) => {
  try {
    const cartData = {
      uid: req.user.uid,
      items: [],
      updatedAt: new Date().toISOString()
    };

    await cartRef(req.user.uid).set(cartData, { merge: true });
    res.status(200).json({ success: true, cart: cartData, message: 'Cart cleared' });
  } catch (err) {
    console.error('[Cart] Error clearing cart:', err.message);
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
});

module.exports = router;
