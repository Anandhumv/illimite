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

const categories = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    slug: 'kitchen',
    collectionHandle: 'kitchen',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0661/4217/5482/files/Pourfect1.webp?v=1739733650'
  },
  {
    id: 'home-garden',
    name: 'Home Garden',
    slug: 'home-garden',
    collectionHandle: 'home-garden',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0661/4217/5482/files/WillowWateringCan1.webp?v=1765088882'
  },
  {
    id: 'lamps',
    name: 'Lamps',
    slug: 'lamps',
    collectionHandle: 'lamps-and-lighting',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0661/4217/5482/files/NovaPrismPortableMushroomLamp1.webp?v=1778435190'
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    slug: 'home-decor',
    collectionHandle: 'home-decor',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0661/4217/5482/files/SukiGrandCeramicVase1.webp?v=1765981491'
  },
  {
    id: 'home-fragrance',
    name: 'Home Fragrance',
    slug: 'home-fragrance',
    collectionHandle: 'reed-diffusers',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0661/4217/5482/files/WoodenGlassReedDiffuser1.webp?v=1745485002'
  },
  {
    id: 'home-furnishing',
    name: 'Home Furnishing',
    slug: 'home-furnishing',
    collectionHandle: 'home-furnishing',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0661/4217/5482/files/HaloNestCushionYellow-1.webp?v=1754553163'
  }
];

const GHARKO_BASE_URL = 'https://gharko.in';

function normalizeImageUrl(imageUrl) {
  if (!imageUrl) {
    return '';
  }

  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }

  return imageUrl;
}

function stripHtml(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toPrice(value) {
  const price = Number(value);
  return Number.isFinite(price) ? Math.round(price) : 0;
}

function productDetailsFor(product) {
  const discountPercent = product.price >= 5000 ? 12 : product.price >= 1500 ? 8 : 5;
  const ratingSeed = product.slug.length % 4;
  const rating = Number((4.2 + ratingSeed * 0.1).toFixed(1));
  const ratingCount = 24 + product.slug.length * 3;
  const reviewCount = Math.max(1, Math.round(ratingCount * 0.24));

  return {
    rating,
    ratingCount,
    reviewCount,
    discountPercent,
    originalPrice: Math.round(product.price / (1 - discountPercent / 100)),
    brand: 'Illimite',
    seller: 'Illimite',
    warranty: 'Quality checked',
    deliveryText: 'Delivery timelines vary by location',
    returnPolicy: 'Returns as per store policy',
    highlights: [
      `Curated ${product.categoryName.toLowerCase()} piece`,
      'Premium home styling finish',
      'Original product image',
      'Designed for warm, modern interiors'
    ],
    offers: [
      'Limited-time collection pricing',
      'Secure checkout available',
      'Carefully packed for delivery'
    ],
    specifications: {
      Category: product.categoryName,
      Care: 'Clean gently with a soft dry cloth'
    }
  };
}

async function fetchCollectionProducts(category) {
  const url = `${GHARKO_BASE_URL}/collections/${category.collectionHandle}/products.json?limit=250`;
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'IllimiteSeeder/1.0 (+local-development)'
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${category.name}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const products = payload.products || [];

  return products
    .filter((product) => product.handle && product.title && product.images?.length)
    .map((product) => {
      const imageUrls = product.images
        .map((image) => normalizeImageUrl(image.src))
        .filter(Boolean);
      const price = toPrice(product.variants?.[0]?.price);
      const description = stripHtml(product.body_html) || `${product.title} from the ${category.name} collection.`;

      return {
        id: product.handle,
        slug: product.handle,
        name: product.title,
        description,
        price,
        imageUrl: imageUrls[0],
        imageUrls,
        categoryId: category.id,
        categoryName: category.name,
        stock: product.variants?.some((variant) => variant.available) ? 20 : 0,
        sourceUrl: `${GHARKO_BASE_URL}/products/${product.handle}`
      };
    });
}

async function clearCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();

  if (snapshot.empty) {
    console.log(`[Seed] No existing ${collectionName} documents to clear.`);
    return;
  }

  console.log(`[Seed] Clearing ${snapshot.size} existing ${collectionName} documents...`);

  const batchSize = 450;
  for (let index = 0; index < snapshot.docs.length; index += batchSize) {
    const batch = db.batch();
    snapshot.docs.slice(index, index + batchSize).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

async function seedDatabase() {
  console.log('[Seed] Starting storefront-only Firestore seeding...');

  try {
    const now = new Date().toISOString();
    const productGroups = await Promise.all(categories.map(fetchCollectionProducts));
    const products = productGroups.flat();
    const uniqueProducts = Array.from(
      new Map(products.map((product) => [product.slug, product])).values()
    );

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

    console.log(`[Seed] Staging ${uniqueProducts.length} storefront products...`);
    uniqueProducts.forEach((product) => {
      const productRef = db.collection('products').doc(product.slug);
      batch.set(productRef, {
        ...product,
        ...productDetailsFor(product),
        createdAt: now,
        updatedAt: now
      });
    });

    await batch.commit();
    console.log('[Seed] Success. Firestore now contains only the requested storefront categories and products.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding process failed:', error);
    process.exit(1);
  }
}

seedDatabase();
