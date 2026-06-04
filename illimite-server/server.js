const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Firebase Admin SDK Initialization ---
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;
if (serviceAccountPath) {
  try {
    const resolvedPath = path.resolve(__dirname, serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('[Server] Firebase Admin SDK initialized.');
  } catch (err) {
    try {
      const fallbackPath = path.resolve(__dirname, serviceAccountPath + '.json');
      const serviceAccount = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('[Server] Firebase Admin SDK initialized (via fallback path).');
    } catch (fallbackErr) {
      console.warn('[Server] Firebase Admin SDK NOT initialized — no valid service account key found.');
    }
  }
} else {
  console.warn('[Server] SERVICE_ACCOUNT_PATH not set — Firebase Admin SDK NOT initialized.');
}

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Express server skeleton is active'
  });
});

// GET /api/products — Fetch all products from Firestore
app.get('/api/products', async (req, res) => {
  try {
    const db = admin.firestore();
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
    const db = admin.firestore();
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('[Server] Error fetching product:', err.message);
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
});
// POST /api/orders — Task 3.3 stub
app.post('/api/orders', (req, res) => {
  res.status(201).json({ success: true, message: 'Order received' });
});
// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running smoothly on port ${PORT}`);
});
