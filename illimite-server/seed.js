const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-key.json';
const serviceAccount = require(path.resolve(serviceAccountPath));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// 1. Unified Categories Dataset
const categories = [
  { id: 'lighting', name: 'Lighting' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'decor', name: 'Home Decor' },
  { id: 'tech', name: 'Technology' },
  { id: 'wellness', name: 'Wellness & Comfort' }
];

// 2. Standardized Products Dataset (20 premium items)
const products = [
  {
    slug: 'aura-pendant-light',
    name: 'Aura Minimalist Pendant Light',
    description: 'A sleek, brushed aluminum suspension lamp providing warm, diffused ambient lighting for modern dining areas.',
    price: 249.00,
    imageUrl: 'assets/products/aura-light.jpg',
    categoryId: 'lighting',
    categoryName: 'Lighting',
    stock: 15
  },
  {
    slug: 'monolith-lounge-chair',
    name: 'Monolith Oak Lounge Chair',
    description: 'Crafted from solid sustainable white oak with premium linen cushioning. Minimal form meets maximal comfort.',
    price: 899.00,
    imageUrl: 'assets/products/monolith-chair.jpg',
    categoryId: 'furniture',
    categoryName: 'Furniture',
    stock: 8
  },
  {
    slug: 'zenith-ceramic-vase',
    name: 'Zenith Matte Ceramic Vase',
    description: 'Hand-thrown earthenware vase featuring a textured neutral finish, perfect for dried botanical arrangements.',
    price: 75.00,
    imageUrl: 'assets/products/zenith-vase.jpg',
    categoryId: 'decor',
    categoryName: 'Home Decor',
    stock: 45
  },
  {
    slug: 'nexus-wireless-charger',
    name: 'Nexus Walnut Wireless Charging Pad',
    description: 'Fast-charging multi-device dock enclosed in a solid block of walnut wood and premium wool felt canvas.',
    price: 110.00,
    imageUrl: 'assets/products/nexus-charger.jpg',
    categoryId: 'tech',
    categoryName: 'Technology',
    stock: 30
  },
  {
    slug: 'somnus-weighted-blanket',
    name: 'Somnus Organic Knitted Weighted Blanket',
    description: 'Breathable, hand-knitted organic cotton layout designed to naturally reduce stress and promote deep sleep cycles.',
    price: 195.00,
    imageUrl: 'assets/products/somnus-blanket.jpg',
    categoryId: 'wellness',
    categoryName: 'Wellness & Comfort',
    stock: 20
  },
  {
    slug: 'nordic-oak-dining-table',
    name: 'Nordic Oak Dining Table',
    description: 'Solid white oak dining table seating up to 6 people. Hand-finished with natural oils.',
    price: 1200.00,
    imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500',
    categoryId: 'furniture',
    categoryName: 'Furniture',
    stock: 5
  }
];

async function seedDatabase() {
  console.log('⏳ Starting clean Day 2 Database Seeding process...');

  try {
    const batch = db.batch();

    // Seed Categories using fixed IDs to enforce schema rules
    console.log('📦 Staging categories...');
    categories.forEach((cat) => {
      const catRef = db.collection('categories').doc(cat.id);
      batch.set(catRef, { name: cat.name }, { merge: true });
    });

    // Seed Products using slugs as Doc IDs to stop duplications
    console.log('📦 Staging premium products...');
    products.forEach((prod) => {
      const prodRef = db.collection('products').doc(prod.slug);
      batch.set(prodRef, {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        imageUrl: prod.imageUrl,
        categoryId: prod.categoryId,
        categoryName: prod.categoryName,
        stock: prod.stock,
        createdAt: new Date().toISOString()
      }, { merge: true });
    });

    // Commit batch transaction
    await batch.commit();
    console.log('✅ Success! Firestore architecture is perfectly seeded with zero duplicates.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process critically failed:', error);
    process.exit(1);
  }
}

seedDatabase();