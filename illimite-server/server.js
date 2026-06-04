const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { db } = require('./config/firebase');
const uploadRouter = require('./routes/upload');
const { verifyFirebaseToken } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Express server skeleton is active'
  });
});

app.get('/api/auth/session', verifyFirebaseToken, (req, res) => {
  res.status(200).json({
    success: true,
    uid: req.user.uid,
    email: req.user.email || null,
    message: 'Firebase token verified'
  });
});

app.use('/api/upload', uploadRouter);

app.get('/api/categories', async (req, res) => {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(categories);
  } catch (err) {
    console.error('[Server] Error fetching categories:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (err) {
    console.error('[Server] Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('[Server] Error fetching product:', err.message);
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
});

app.post('/api/cart/items', verifyFirebaseToken, async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  try {
    await db.collection('carts').doc(req.user.uid).set({
      uid: req.user.uid,
      items,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.status(200).json({
      success: true,
      message: 'Cart synchronized successfully',
      cart: {
        uid: req.user.uid,
        items
      }
    });
  } catch (err) {
    console.error('[Server] Error syncing cart:', err.message);
    res.status(500).json({ error: 'Failed to synchronize cart', details: err.message });
  }
});

app.get('/api/orders', verifyFirebaseToken, async (req, res) => {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  } catch (err) {
    console.error('[Server] Error fetching orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

app.post('/api/orders', verifyFirebaseToken, async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const shippingAddress = req.body?.shippingAddress || '';
  const paymentRef = req.body?.paymentRef || 'mock-payment-ref';

  if (!items.length) {
    return res.status(400).json({ error: 'Cannot place an order with an empty cart' });
  }

  if (!shippingAddress.trim()) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }

  try {
    const orderRef = db.collection('orders').doc();
    const order = await db.runTransaction(async (transaction) => {
      const productUpdates = [];
      let total = 0;

      for (const item of items) {
        const qty = Number(item.qty || 0);
        if (!item.productId || qty <= 0) {
          throw new Error('Each order item must include productId and a positive qty');
        }

        const productRef = db.collection('products').doc(item.productId);
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists) {
          throw new Error(`Product ${item.productId} was not found`);
        }

        const product = productSnap.data();
        const currentStock = Number(product.stock || 0);

        if (currentStock < qty) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const price = Number(item.priceAtAdd ?? item.price ?? product.price ?? 0);
        total += qty * price;
        productUpdates.push({
          ref: productRef,
          newStock: currentStock - qty,
          orderItem: {
            productId: item.productId,
            name: product.name,
            imageUrl: product.imageUrl || '',
            qty,
            price
          }
        });
      }

      productUpdates.forEach((update) => {
        transaction.update(update.ref, { stock: update.newStock });
      });

      const orderData = {
        id: orderRef.id,
        userId: req.user.uid,
        items: productUpdates.map(update => update.orderItem),
        total,
        status: 'pending',
        shippingAddress,
        paymentRef,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      transaction.set(orderRef, orderData);
      transaction.set(db.collection('carts').doc(req.user.uid), {
        uid: req.user.uid,
        items: [],
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return orderData;
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully',
      order
    });
  } catch (err) {
    console.error('[Server] Error creating order:', err.message);
    res.status(400).json({ error: 'Failed to place order', details: err.message });
  }
});

app.patch('/api/orders/:id/status', verifyFirebaseToken, async (req, res) => {
  const status = req.body?.status;

  if (!status) {
    return res.status(400).json({ error: 'Order status is required' });
  }

  try {
    await db.collection('orders').doc(req.params.id).set({
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.status(200).json({
      success: true,
      orderId: req.params.id,
      status,
      message: 'Order status updated'
    });
  } catch (err) {
    console.error('[Server] Error updating order status:', err.message);
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running smoothly on port ${PORT}`);
});
