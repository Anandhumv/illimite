const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || './firebase-key.json';
const serviceAccount = require(path.resolve(__dirname, serviceAccountPath));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const placeholderImage = 'https://placehold.co/600x400?text=Illimite';

const categories = [
  { id: 'lighting', name: 'Lighting', slug: 'lighting', imageUrl: `${placeholderImage}+Lighting` },
  { id: 'furniture', name: 'Furniture', slug: 'furniture', imageUrl: `${placeholderImage}+Furniture` },
  { id: 'decor', name: 'Home Decor', slug: 'home-decor', imageUrl: `${placeholderImage}+Decor` },
  { id: 'tech', name: 'Technology', slug: 'technology', imageUrl: `${placeholderImage}+Technology` },
  { id: 'wellness', name: 'Wellness & Comfort', slug: 'wellness-comfort', imageUrl: `${placeholderImage}+Wellness` },
  { id: 'bedroom', name: 'Bedroom', slug: 'bedroom', imageUrl: `${placeholderImage}+Bedroom` },
  { id: 'bathroom', name: 'Bathroom', slug: 'bathroom', imageUrl: `${placeholderImage}+Bathroom` }
];

const products = [
  { slug: 'aura-pendant-light', name: 'Aura Minimalist Pendant Light', description: 'A brushed aluminum suspension lamp with warm, diffused lighting for calm dining spaces.', price: 249, imageUrl: 'assets/products/aura-light.jpg', categoryId: 'lighting', categoryName: 'Lighting', stock: 15 },
  { slug: 'solis-brass-desk-lamp', name: 'Solis Brass Desk Lamp', description: 'A compact task lamp with a brushed brass finish and adjustable head.', price: 145, imageUrl: 'assets/products/solis-lamp.jpg', categoryId: 'lighting', categoryName: 'Lighting', stock: 12 },
  { slug: 'lumiere-wall-sconce', name: 'Lumiere Wall Sconce', description: 'A soft-glow wall fixture designed for hallways, bedrooms, and reading corners.', price: 169, imageUrl: 'assets/products/lumiere-sconce.jpg', categoryId: 'lighting', categoryName: 'Lighting', stock: 18 },
  { slug: 'monolith-lounge-chair', name: 'Monolith Oak Lounge Chair', description: 'Solid white oak lounge chair with premium linen cushioning and a minimal profile.', price: 899, imageUrl: 'assets/products/monolith-chair.jpg', categoryId: 'furniture', categoryName: 'Furniture', stock: 8 },
  { slug: 'nordic-oak-dining-table', name: 'Nordic Oak Dining Table', description: 'A solid white oak dining table seating up to six people, hand-finished with natural oils.', price: 1200, imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500', categoryId: 'furniture', categoryName: 'Furniture', stock: 5 },
  { slug: 'sora-wool-rug', name: 'Sora Handwoven Wool Rug', description: 'A textured flat-weave rug with neutral geometric patterning and New Zealand wool.', price: 420, imageUrl: 'assets/products/sora-rug.jpg', categoryId: 'furniture', categoryName: 'Furniture', stock: 6 },
  { slug: 'zenith-ceramic-vase', name: 'Zenith Matte Ceramic Vase', description: 'Hand-thrown earthenware vase with a textured neutral finish for dried botanicals.', price: 75, imageUrl: 'assets/products/zenith-vase.jpg', categoryId: 'decor', categoryName: 'Home Decor', stock: 45 },
  { slug: 'forma-ceramic-vase-set', name: 'Forma Ceramic Vase Set', description: 'A trio of matte ceramic vases in soft earth tones for tabletop styling.', price: 45, imageUrl: 'assets/products/forma-vase-set.jpg', categoryId: 'decor', categoryName: 'Home Decor', stock: 30 },
  { slug: 'chronos-walnut-wall-clock', name: 'Chronos Walnut Wall Clock', description: 'A silent sweep wall clock with a dark walnut face and minimal markers.', price: 110, imageUrl: 'assets/products/chronos-clock.jpg', categoryId: 'decor', categoryName: 'Home Decor', stock: 20 },
  { slug: 'terra-cotta-plant-pot', name: 'Terra Cotta Plant Pot', description: 'A hand-thrown planter with drainage hole and matching saucer.', price: 28, imageUrl: 'assets/products/terra-pot.jpg', categoryId: 'decor', categoryName: 'Home Decor', stock: 40 },
  { slug: 'nexus-wireless-charger', name: 'Nexus Walnut Wireless Charging Pad', description: 'A fast-charging dock enclosed in walnut wood and premium wool felt.', price: 110, imageUrl: 'assets/products/nexus-charger.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 30 },
  { slug: 'aether-noise-cancelling-headphones', name: 'Aether Noise-Cancelling Headphones', description: 'Over-ear wireless headphones with active noise cancellation and long battery life.', price: 299, imageUrl: 'assets/products/aether-headphones.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 18 },
  { slug: 'ember-temperature-control-mug', name: 'Ember Temperature Control Mug', description: 'A smart mug that keeps coffee or tea at a preferred drinking temperature.', price: 129, imageUrl: 'assets/products/ember-mug.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 28 },
  { slug: 'flux-leather-desk-pad', name: 'Flux Leather Desk Pad', description: 'A vegetable-tanned leather desk mat with a stable micro-suction base.', price: 95, imageUrl: 'assets/products/flux-desk-pad.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 20 },
  { slug: 'somnus-weighted-blanket', name: 'Somnus Organic Knitted Weighted Blanket', description: 'A breathable hand-knitted organic cotton blanket designed for restful sleep.', price: 195, imageUrl: 'assets/products/somnus-blanket.jpg', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 20 },
  { slug: 'vaporstone-ultrasonic-diffuser', name: 'VaporStone Ultrasonic Diffuser', description: 'A ceramic essential oil diffuser with ambient glow and quiet mist output.', price: 65, imageUrl: 'assets/products/vaporstone-diffuser.jpg', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 50 },
  { slug: 'cura-essential-oils-set', name: 'Cura Essential Oils Set', description: 'A six-oil set featuring lavender, eucalyptus, peppermint, tea tree, lemongrass, and orange.', price: 38, imageUrl: 'assets/products/cura-oils.jpg', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 60 },
  { slug: 'verde-linen-bedding-set', name: 'Verde Linen Bedding Set', description: 'A French flax linen duvet cover and pillowcase set in a soft sage tone.', price: 240, imageUrl: 'assets/products/verde-bedding.jpg', categoryId: 'bedroom', categoryName: 'Bedroom', stock: 10 },
  { slug: 'hale-bamboo-bath-mat', name: 'Hale Bamboo Bath Mat', description: 'A water-resistant slatted bamboo bath mat with non-slip rubber feet.', price: 35, imageUrl: 'assets/products/hale-bath-mat.jpg', categoryId: 'bathroom', categoryName: 'Bathroom', stock: 30 },
  { slug: 'meridian-turkish-towel-set', name: 'Meridian Turkish Towel Set', description: 'Four quick-drying organic cotton towels with flat-woven stripes.', price: 85, imageUrl: 'assets/products/meridian-towels.jpg', categoryId: 'bathroom', categoryName: 'Bathroom', stock: 25 }
];

async function seedDatabase() {
  console.log('[Seed] Starting Day 2 Firestore seeding...');

  try {
    const now = new Date().toISOString();

    await clearCollection('categories');
    await clearCollection('products');

    const batch = db.batch();

    console.log(`[Seed] Staging ${categories.length} categories...`);
    categories.forEach((category) => {
      const categoryRef = db.collection('categories').doc(category.id);
      batch.set(categoryRef, {
        id: category.id,
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl,
        updatedAt: now
      });
    });

    console.log(`[Seed] Staging ${products.length} products...`);
    products.forEach((product) => {
      const productRef = db.collection('products').doc(product.slug);
      batch.set(productRef, {
        id: product.slug,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        imageUrls: [product.imageUrl],
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        stock: product.stock,
        createdAt: now,
        updatedAt: now
      });
    });

    await batch.commit();
    console.log('[Seed] Success. Categories and products are seeded with stable document IDs.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding process failed:', error);
    process.exit(1);
  }
}

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log(`[Seed] No existing ${collectionName} documents to clear.`);
    return;
  }

  console.log(`[Seed] Clearing ${snapshot.size} existing ${collectionName} documents...`);
  const deleteBatch = db.batch();

  snapshot.docs.forEach((doc) => {
    deleteBatch.delete(doc.ref);
  });

  await deleteBatch.commit();
}

seedDatabase();
