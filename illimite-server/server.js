const express = require('express');
const cors = require('cors');
const { admin, db, bucket } = require('./config/firebase');
require('dotenv').config();

const uploadRouter = require('./routes/upload');
const cartRouter = require('./routes/cart');
const { verifyFirebaseToken } = require('./middleware/auth');
const { generateOrderId } = require('./utils/orderIdGenerator');

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
app.use('/api/cart', cartRouter);

async function requireAdmin(req, res, next) {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const role = userDoc.exists ? userDoc.data().role : 'customer';

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    return next();
  } catch (err) {
    console.error('[Server] Error checking admin role:', err.message);
    return res.status(500).json({ error: 'Failed to verify admin role', details: err.message });
  }
}

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

app.post('/api/products', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const product = req.body || {};
  const requiredFields = ['name', 'slug', 'description', 'price', 'categoryId', 'categoryName', 'stock'];
  const missing = requiredFields.filter(field => product[field] === undefined || product[field] === '');

  if (missing.length) {
    return res.status(400).json({ error: `Missing product fields: ${missing.join(', ')}` });
  }

  try {
    const productId = product.id || product.slug;
    const productData = {
      id: productId,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl || '',
      imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [],
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      stock: Number(product.stock),
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('products').doc(productId).set(productData);
    res.status(201).json({ success: true, product: productData, message: 'Product created successfully' });
  } catch (err) {
    console.error('[Server] Error creating product:', err.message);
    res.status(500).json({ error: 'Failed to create product', details: err.message });
  }
});

app.patch('/api/products/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const updates = req.body || {};
  const allowedFields = [
    'slug',
    'name',
    'description',
    'price',
    'imageUrl',
    'imageUrls',
    'categoryId',
    'categoryName',
    'stock'
  ];

  const productUpdates = allowedFields.reduce((acc, field) => {
    if (updates[field] !== undefined) {
      acc[field] = ['price', 'stock'].includes(field) ? Number(updates[field]) : updates[field];
    }
    return acc;
  }, {});

  if (!Object.keys(productUpdates).length) {
    return res.status(400).json({ error: 'No valid product fields supplied' });
  }

  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    productUpdates.updatedAt = new Date().toISOString();
    await productRef.set(productUpdates, { merge: true });

    const updated = await productRef.get();
    res.status(200).json({
      success: true,
      product: { id: updated.id, ...updated.data() },
      message: 'Product updated successfully'
    });
  } catch (err) {
    console.error('[Server] Error updating product:', err.message);
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

app.delete('/api/products/:id', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await productRef.delete();
    res.status(200).json({ success: true, productId: req.params.id, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('[Server] Error deleting product:', err.message);
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

app.get('/api/orders', verifyFirebaseToken, async (req, res) => {
  try {
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.user.uid)
      .get();

    const orders = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0));

    res.status(200).json(orders);
  } catch (err) {
    console.error('[Server] Error fetching orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

app.get('/api/admin/orders', verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  } catch (err) {
    console.error('[Server] Error fetching admin orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch admin orders', details: err.message });
  }
});

app.get('/api/orders/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const orderDoc = await db.collection('orders').doc(req.params.id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = { id: orderDoc.id, ...orderDoc.data() };
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const role = userDoc.exists ? userDoc.data().role : 'customer';

    if (order.userId !== req.user.uid && role !== 'admin') {
      return res.status(403).json({ error: 'You cannot view this order' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('[Server] Error fetching order:', err.message);
    res.status(500).json({ error: 'Failed to fetch order', details: err.message });
  }
});

app.post('/api/orders', verifyFirebaseToken, async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const shippingAddress = req.body?.shippingAddress || '';
  const paymentRef = req.body?.paymentRef || 'mock-payment-ref';
  const customerName = req.body?.customerName?.trim() || req.user?.displayName || 'Customer';

  if (!items.length) {
    return res.status(400).json({ error: 'Cannot place an order with an empty cart' });
  }

  if (!shippingAddress.trim()) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }

  try {
    const customOrderId = generateOrderId(customerName);
    const orderRef = db.collection('orders').doc(customOrderId);
    const order = await db.runTransaction(async (transaction) => {
      const productUpdates = [];
      let total = 0;

      for (const item of items) {
        const qty = Number(item.qty ?? item.quantity ?? 0);
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
            quantity: qty,
            price
          }
        });
      }

      productUpdates.forEach((update) => {
        transaction.update(update.ref, { stock: update.newStock });
      });

      const orderData = {
        id: customOrderId,
        userId: req.user.uid,
        customerName,
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

app.patch('/api/orders/:id/status', verifyFirebaseToken, requireAdmin, async (req, res) => {
  const status = req.body?.status;
  const allowedStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!status) {
    return res.status(400).json({ error: 'Order status is required' });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: `Order status must be one of: ${allowedStatuses.join(', ')}` });
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
