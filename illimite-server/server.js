const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import your central Firebase configuration module and upload router
const { db } = require('./config/firebase');
const uploadRouter = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Express server skeleton is active'
  });
});

// 2. Register your brand new asset upload endpoint mapping
// This exposes your storage route at: http://localhost:5000/api/upload/product-image
app.use('/api/upload', uploadRouter);

// GET /api/products — Fetch all products from Firestore
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

// GET /api/products/:id — Fetch single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('[Server] Error fetching product:', err.message);
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
});
// POST /api/cart/items - Mock Day 2 contract route for cart syncing
app.post('/api/cart/items', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart synchronized successfully'
  });
});

// POST /api/orders - Mock Day 2 contract route for order submission
app.post('/api/orders', (req, res) => {
  res.status(201).json({
    success: true,
    orderId: 'mock-order-id-12345',
    message: 'Order placed successfully'
  });
});

// PATCH /api/orders/:id/status - Mock Day 2 contract route for fulfillment states
app.patch('/api/orders/:id/status', (req, res) => {
  res.status(200).json({
    success: true,
    orderId: req.params.id,
    status: req.body.status,
    message: 'Order status updated'
  });
});
// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running smoothly on port ${PORT}`);
});
