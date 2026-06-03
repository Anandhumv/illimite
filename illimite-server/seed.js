const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration: check if running against emulator, else require service account
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH;

if (emulatorHost) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'illimite-ec139'
  });
  console.log(`[Seed] Initializing in Emulator Mode at ${emulatorHost}`);
} else if (serviceAccountPath) {
  try {
    const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log(`[Seed] Initializing in Production Mode using service account: ${resolvedPath}`);
  } catch (err) {
    console.error(`[Seed] Error loading service account key from "${serviceAccountPath}":`, err.message);
    process.exit(1);
  }
} else {
  console.error('[Seed] Configuration Error:');
  console.error('Please set either "FIRESTORE_EMULATOR_HOST=localhost:8080" for testing,');
  console.error('or "SERVICE_ACCOUNT_PATH=./path/to/key.json" in your .env file.');
  process.exit(1);
}

const db = admin.firestore();

// 20 realistic premium products with requested fields: name, description, price, category, imageUrl, stockCount
const products = [
  {
    name: "Lumière Minimalist Pendant Light",
    description: "A sleek, brushed-aluminum pendant light with adjustable color temperatures and modern styling.",
    price: 189,
    category: "Lighting",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    stockCount: 25
  },
  {
    name: "AeroSvelte Ergonomic Desk Chair",
    description: "Premium breathable mesh office chair with synchronous tilt mechanism and adjustable lumbar support.",
    price: 349,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500",
    stockCount: 15
  },
  {
    name: "Nordic Oak Dining Table",
    description: "Solid white oak dining table seating up to 6 people. Hand-finished with natural oils.",
    price: 899,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500",
    stockCount: 8
  },
  {
    name: "VaporStone Ultrasonic Diffuser",
    description: "Hand-crafted ceramic stone cover essential oil diffuser with ambient glow.",
    price: 65,
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500",
    stockCount: 50
  },
  {
    name: "Forma Ceramic Vase Set",
    description: "Trio of matte-finished ceramic vases in earthy tones, perfect for dried botanicals.",
    price: 45,
    category: "Decor",
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500",
    stockCount: 30
  },
  {
    name: "Chronos Walnut Wall Clock",
    description: "Minimalist wall clock made of dark walnut wood with silent sweep movement.",
    price: 110,
    category: "Decor",
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdad1c?w=500",
    stockCount: 20
  },
  {
    name: "Terra Cotta Plant Pot",
    description: "Hand-thrown terra cotta planter with drainage hole and matching saucer.",
    price: 28,
    category: "Decor",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
    stockCount: 40
  },
  {
    name: "Monolith Wireless Charger",
    description: "CNC-machined marble wireless charging pad with fast-charging support.",
    price: 79,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500",
    stockCount: 35
  },
  {
    name: "Sonos Aura Smart Speaker",
    description: "Room-filling 360-degree sound speaker with voice assistant integration and fabric grille.",
    price: 199,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
    stockCount: 22
  },
  {
    name: "Aether Noise-Cancelling Headphones",
    description: "Over-ear wireless headphones with active noise cancellation and 40-hour battery life.",
    price: 299,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stockCount: 18
  },
  {
    name: "Ember Mug Temperature Control",
    description: "Smart mug that keeps your coffee or tea at your preferred drinking temperature.",
    price: 129,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500",
    stockCount: 28
  },
  {
    name: "Solis Brass Desk Lamp",
    description: "Mid-century modern task lamp with brushed brass finish and adjustable head.",
    price: 145,
    category: "Lighting",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    stockCount: 12
  },
  {
    name: "Verde Linen Bedding Set",
    description: "100% French flax linen duvet cover and pillowcase set in sage green.",
    price: 240,
    category: "Bedroom",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
    stockCount: 10
  },
  {
    name: "Somnus Weighted Blanket",
    description: "15-pound cooling glass bead weighted blanket with organic cotton cover.",
    price: 135,
    category: "Bedroom",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
    stockCount: 14
  },
  {
    name: "Hale Bamboo Bath Mat",
    description: "Water-resistant slatted bamboo bath mat with non-slip rubber feet.",
    price: 35,
    category: "Bathroom",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500",
    stockCount: 30
  },
  {
    name: "Meridian Turkish Towel Set",
    description: "Set of 4 quick-drying organic cotton towels with flat-woven stripes.",
    price: 85,
    category: "Bathroom",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500",
    stockCount: 25
  },
  {
    name: "Cura Essential Oils Set",
    description: "Six therapeutic-grade organic essential oils: Lavender, Eucalyptus, Peppermint, Tea Tree, Lemongrass, and Sweet Orange.",
    price: 38,
    category: "Wellness",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500",
    stockCount: 60
  },
  {
    name: "Sora Handwoven Wool Rug",
    description: "Textured flat-weave rug featuring geometric neutral patterns, made of New Zealand wool.",
    price: 420,
    category: "Furniture",
    imageUrl: "https://images.unsplash.com/photo-1576016770956-debb63d900ad?w=500",
    stockCount: 6
  },
  {
    name: "Oasis Self-Watering Planter",
    description: "Minimalist self-watering planter with visual water-level indicator.",
    price: 42,
    category: "Decor",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500",
    stockCount: 45
  },
  {
    name: "Flux Leather Desk Pad",
    description: "Top-grain vegetable-tanned leather desk mat with micro-suction backing.",
    price: 95,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500",
    stockCount: 20
  }
];

async function seedDatabase() {
  console.log('[Seed] Seeding products collection...');
  const batch = db.batch();

  products.forEach(product => {
    // Generate new document reference with auto-ID
    const docRef = db.collection('products').doc();
    batch.set(docRef, {
      ...product,
      id: docRef.id, // Embed ID in the doc fields as per front-end model
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  try {
    await batch.commit();
    console.log('[Seed] Database successfully seeded with 20 premium products!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error committing seeding batch:', error);
    process.exit(1);
  }
}

seedDatabase();
