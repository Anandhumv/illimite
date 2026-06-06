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
  { id: 'bathroom', name: 'Bathroom', slug: 'bathroom', imageUrl: `${placeholderImage}+Bathroom` },
  { id: 'kitchen', name: 'Kitchen & Dining', slug: 'kitchen-dining', imageUrl: `${placeholderImage}+Kitchen` }
];

const productImages = {
  'aura-pendant-light': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
  'solis-brass-desk-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'lumiere-wall-sconce': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=80',
  'monolith-lounge-chair': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',
  'nordic-oak-dining-table': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80',
  'sora-wool-rug': 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=80',
  'zenith-ceramic-vase': 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
  'forma-ceramic-vase-set': 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=900&q=80',
  'chronos-walnut-wall-clock': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80',
  'terra-cotta-plant-pot': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
  'nexus-wireless-charger': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80',
  'aether-noise-cancelling-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'ember-temperature-control-mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  'flux-leather-desk-pad': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'somnus-weighted-blanket': 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80',
  'vaporstone-ultrasonic-diffuser': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80',
  'cura-essential-oils-set': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  'verde-linen-bedding-set': 'https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=900&q=80',
  'hale-bamboo-bath-mat': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
  'meridian-turkish-towel-set': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
  'halo-arched-floor-lamp': 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&q=80',
  'mira-rattan-table-lamp': 'https://images.unsplash.com/photo-1534281368625-7261d219fc4c?auto=format&fit=crop&w=900&q=80',
  'atlas-modular-sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  'oslo-round-coffee-table': 'https://images.unsplash.com/photo-1532372320978-9d8edc20d006?auto=format&fit=crop&w=900&q=80',
  'linea-floating-shelf': 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80',
  'cove-marble-bookends': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  'pixel-smart-display': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80',
  'orbit-bluetooth-speaker': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
  'pulse-smartwatch-stand': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'calma-meditation-cushion': 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=900&q=80',
  'drift-memory-foam-pillow': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80',
  'linen-cloud-quilt': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'noa-bedside-table': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80',
  'aqua-stone-soap-dispenser': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80',
  'serene-vanity-mirror': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
  'aura-travertine-cordless-table-lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'sumi-pleated-paper-pendant-light': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80',
  'linear-matte-black-floor-arch-lamp': 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&q=80',
  'amber-glass-mushroom-accent-light': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
  'alabaster-stone-sphere-sconce': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=80',
  'tokyo-derby-brushed-brass-task-light': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'fluted-frosted-glass-globe-lamp': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80',
  'raw-concrete-cylinder-spot-wall-mount': 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=80',
  'modernist-wabi-sabi-clay-table-light': 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=900&q=80',
  'eclipse-rotatable-wall-disc': 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80',
  'organic-ribbed-ceramic-vase': 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
  'abstract-sandstone-desktop-sculpture': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80',
  'hand-carved-travertine-catchall-bowl': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80',
  'minimalist-solid-brass-satin-bookends': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
  'textured-boucle-ivory-cushion-cover': 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=900&q=80',
  'framed-arched-sandstone-giclee-canvas': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
  'cast-aluminum-brutalist-trifold-candelabra': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80',
  'smoked-grey-glass-totem-vase': 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
  'natural-stoneware-incense-burner-bowl': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  'asymmetric-fluid-form-desk-paperweight': 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80',
  'walnut-bronze-mid-century-side-table': 'https://images.unsplash.com/photo-1532372320978-9d8edc20d006?auto=format&fit=crop&w=900&q=80',
  'japandi-cane-slatted-bench': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',
  'minimalist-solid-oak-nested-coffee-tables': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80',
  'matte-black-aluminum-floating-gallery-ledges': 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80',
  'linen-upholstered-lounge-storage-ottoman': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  'asymmetrical-organic-outline-full-length-mirror': 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
  'monolithic-dark-travertine-plinth-block': 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80',
  'powder-coated-cream-steel-magazine-rack': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80',
  'raw-edge-cedar-stump-stool': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80',
  'fluted-glass-minimalist-storage-sideboard': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
  'hinoki-wood-ultrasonic-oil-diffuser': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80',
  'kyoto-moss-winter-cedar-incense-pack': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  'waffle-weave-organic-flax-cotton-robe': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
  'hand-poured-concrete-soy-candle': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  'natural-sisal-wooden-dry-body-brush': 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80',
  'apothecary-amber-glass-dropper-set': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  'textured-cotton-meditation-floor-pouf': 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=900&q=80',
  'himalayan-rock-salt-block-room-ionizer': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80',
  'sandalwood-restorative-sleep-linen-mist': 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80',
  'pressed-moss-botanical-specimen-frame': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
  'mango-wood-flush-handle-serving-tray': 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=900&q=80',
  'matte-speckled-charcoal-stoneware-bowls': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80',
  'borosilicate-glass-minimalist-carafe-set': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  'brushed-champagne-gold-cutlery-set': 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
  'raw-edge-cleft-slate-coaster-pack': 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=900&q=80',
  'artisanal-white-ceramic-spice-jar-trio': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80',
  'cast-iron-heavy-matte-tea-press': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
  'unbleached-linen-kitchen-hand-towels': 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
  'carved-olive-wood-organic-salad-spoons': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
  'minimalist-matte-white-porcelain-espresso-cups': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80'
};

const productGalleryImages = {
  'aether-noise-cancelling-headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80'
  ],
  'aura-pendant-light': [
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80'
  ],
  'nordic-oak-dining-table': [
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80'
  ],
  'zenith-ceramic-vase': [
    'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80'
  ],
  'cura-essential-oils-set': [
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80'
  ]
};

function imageGalleryFor(product) {
  return Array.from(new Set([
    ...(productGalleryImages[product.slug] || [productImages[product.slug] || product.imageUrl])
  ]));
}

const categoryDetails = {
  lighting: {
    brand: 'Lumora',
    highlights: ['Warm diffused light', 'Energy-efficient LED compatible', 'Premium metal finish', 'Easy ceiling installation'],
    specifications: {
      Material: 'Brushed metal',
      Finish: 'Matte premium finish',
      'Ideal For': 'Dining, bedroom, and living spaces',
      Care: 'Wipe with a dry microfiber cloth'
    }
  },
  furniture: {
    brand: 'Northline',
    highlights: ['Solid wood construction', 'Minimal modern profile', 'Hand-finished surface', 'Designed for everyday use'],
    specifications: {
      Material: 'Solid wood and premium upholstery',
      Finish: 'Natural oil finish',
      'Ideal For': 'Living room and dining spaces',
      Care: 'Avoid direct sunlight and excess moisture'
    }
  },
  decor: {
    brand: 'Casaform',
    highlights: ['Hand-finished detail', 'Minimal home styling', 'Durable everyday build', 'Pairs well with modern interiors'],
    specifications: {
      Material: 'Premium home-grade material',
      Finish: 'Matte designer finish',
      'Ideal For': 'Shelves, tables, and accent corners',
      Care: 'Clean gently with a soft cloth'
    }
  },
  tech: {
    brand: 'Aether Labs',
    highlights: ['Fast everyday performance', 'Premium compact design', 'Reliable daily-use build', 'Modern workspace ready'],
    specifications: {
      Connectivity: 'Wireless compatible',
      Finish: 'Premium matte finish',
      'Ideal For': 'Work, travel, and entertainment',
      Warranty: '1 year limited warranty'
    }
  },
  wellness: {
    brand: 'Cura Living',
    highlights: ['Calming daily-use design', 'Made for comfort routines', 'Premium wellness finish', 'Easy to use and maintain'],
    specifications: {
      Material: 'Wellness-grade materials',
      Finish: 'Soft-touch premium finish',
      'Ideal For': 'Relaxation and self-care',
      Care: 'Store in a cool, dry place'
    }
  },
  bedroom: {
    brand: 'Verde Home',
    highlights: ['Soft breathable comfort', 'Premium bedroom finish', 'Designed for restful sleep', 'Easy home-care routine'],
    specifications: {
      Material: 'Premium textile blend',
      Finish: 'Soft washed finish',
      'Ideal For': 'Bedroom and guest room',
      Care: 'Machine wash gentle cycle'
    }
  },
  bathroom: {
    brand: 'Hale Bath',
    highlights: ['Quick-dry everyday build', 'Water-friendly design', 'Minimal bathroom styling', 'Easy to clean'],
    specifications: {
      Material: 'Bathroom-safe premium material',
      Finish: 'Water-resistant finish',
      'Ideal For': 'Bathroom and vanity spaces',
      Care: 'Air dry after use'
    }
  },
  kitchen: {
    brand: 'Tableform',
    highlights: ['Food-safe premium finish', 'Minimal dining presentation', 'Durable daily-use build', 'Designed for modern tablescapes'],
    specifications: {
      Material: 'Food-safe ceramic, glass, metal, or natural wood',
      Finish: 'Premium dining-grade finish',
      'Ideal For': 'Kitchen, dining, and hosting',
      Care: 'Hand wash recommended for long finish life'
    }
  }
};

const productSpecificDetails = {
  'aether-noise-cancelling-headphones': {
    brand: 'Aether',
    highlights: ['Active noise cancellation', 'Up to 40 hours battery life', 'Memory-foam ear cushions', 'Bluetooth 5.3 with low-latency mode'],
    specifications: {
      Brand: 'Aether',
      Type: 'Over-ear wireless headphones',
      Connectivity: 'Bluetooth 5.3',
      Battery: 'Up to 40 hours',
      Microphone: 'Dual beam-forming microphones',
      Warranty: '1 year manufacturer warranty'
    }
  },
  'chronos-walnut-wall-clock': {
    brand: 'Chronos',
    highlights: ['Silent sweep movement', 'Walnut-look premium face', 'Minimal markers', 'Easy wall mount'],
    specifications: {
      Brand: 'Chronos',
      Type: 'Analog wall clock',
      Material: 'Walnut wood and metal',
      Movement: 'Silent sweep quartz',
      Battery: '1 AA battery'
    }
  }
};

function productDetailsFor(product) {
  const base = categoryDetails[product.categoryId] || categoryDetails.decor;
  const specific = productSpecificDetails[product.slug] || {};
  const discountPercent = product.price >= 500 ? 18 : product.price >= 100 ? 15 : 10;
  const ratingSeed = product.slug.length % 4;
  const rating = Number((4.2 + ratingSeed * 0.1).toFixed(1));
  const ratingCount = 96 + product.slug.length * 17;
  const reviewCount = Math.max(18, Math.round(ratingCount * 0.32));

  return {
    rating,
    ratingCount,
    reviewCount,
    discountPercent,
    originalPrice: Math.round(product.price / (1 - discountPercent / 100)),
    brand: specific.brand || base.brand,
    seller: 'Illimite Home',
    warranty: specific.specifications?.Warranty || base.specifications?.Warranty || '6 months Illimite care warranty',
    deliveryText: 'FREE delivery by Sunday, 14 June',
    returnPolicy: '10 days returnable',
    highlights: specific.highlights || base.highlights,
    offers: [
      `Bank offer: 10% instant discount up to $25 on ${product.categoryName} orders`,
      'No-cost EMI available on selected cards',
      'Free delivery on this product',
      'Partner offer: Extra 5% off for registered Illimite users'
    ],
    specifications: {
      Brand: specific.brand || base.brand,
      ...base.specifications,
      ...(specific.specifications || {})
    }
  };
}

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
  { slug: 'meridian-turkish-towel-set', name: 'Meridian Turkish Towel Set', description: 'Four quick-drying organic cotton towels with flat-woven stripes.', price: 85, imageUrl: 'assets/products/meridian-towels.jpg', categoryId: 'bathroom', categoryName: 'Bathroom', stock: 25 },
  { slug: 'halo-arched-floor-lamp', name: 'Halo Arched Floor Lamp', description: 'A slim arched floor lamp with a linen drum shade and weighted stone base.', price: 315, imageUrl: 'assets/products/halo-floor-lamp.jpg', categoryId: 'lighting', categoryName: 'Lighting', stock: 11 },
  { slug: 'mira-rattan-table-lamp', name: 'Mira Rattan Table Lamp', description: 'A handwoven rattan lamp that brings soft ambient texture to bedside or console spaces.', price: 135, imageUrl: 'assets/products/mira-rattan-lamp.jpg', categoryId: 'lighting', categoryName: 'Lighting', stock: 16 },
  { slug: 'atlas-modular-sofa', name: 'Atlas Modular Sofa', description: 'A low-profile three-seat modular sofa with deep cushions and stain-resistant fabric.', price: 1499, imageUrl: 'assets/products/atlas-sofa.jpg', categoryId: 'furniture', categoryName: 'Furniture', stock: 4 },
  { slug: 'oslo-round-coffee-table', name: 'Oslo Round Coffee Table', description: 'A rounded oak coffee table with a sculptural pedestal base and smooth beveled edge.', price: 540, imageUrl: 'assets/products/oslo-coffee-table.jpg', categoryId: 'furniture', categoryName: 'Furniture', stock: 7 },
  { slug: 'linea-floating-shelf', name: 'Linea Floating Shelf', description: 'A minimalist wall shelf with concealed brackets for books, ceramics, and small decor.', price: 88, imageUrl: 'assets/products/linea-shelf.jpg', categoryId: 'decor', categoryName: 'Home Decor', stock: 26 },
  { slug: 'cove-marble-bookends', name: 'Cove Marble Bookends', description: 'A pair of honed marble bookends with natural veining and felt-protected bases.', price: 72, imageUrl: 'assets/products/cove-bookends.jpg', categoryId: 'decor', categoryName: 'Home Decor', stock: 22 },
  { slug: 'pixel-smart-display', name: 'Pixel Smart Display', description: 'A compact smart display for calendar, music, video calls, and connected home controls.', price: 189, imageUrl: 'assets/products/pixel-display.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 19 },
  { slug: 'orbit-bluetooth-speaker', name: 'Orbit Bluetooth Speaker', description: 'A portable fabric-wrapped speaker with room-filling sound and 18-hour battery life.', price: 159, imageUrl: 'assets/products/orbit-speaker.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 21 },
  { slug: 'pulse-smartwatch-stand', name: 'Pulse Smartwatch Stand', description: 'A weighted aluminum charging stand for smartwatches with hidden cable routing.', price: 49, imageUrl: 'assets/products/pulse-watch-stand.jpg', categoryId: 'tech', categoryName: 'Technology', stock: 34 },
  { slug: 'calma-meditation-cushion', name: 'Calma Meditation Cushion', description: 'A buckwheat-filled meditation cushion with removable organic cotton cover.', price: 64, imageUrl: 'assets/products/calma-cushion.jpg', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 27 },
  { slug: 'drift-memory-foam-pillow', name: 'Drift Memory Foam Pillow', description: 'A cooling memory foam pillow with ergonomic neck support and washable cover.', price: 86, imageUrl: 'assets/products/drift-pillow.jpg', categoryId: 'bedroom', categoryName: 'Bedroom', stock: 32 },
  { slug: 'linen-cloud-quilt', name: 'Linen Cloud Quilt', description: 'A lightweight quilt with linen-cotton shell and breathable year-round fill.', price: 175, imageUrl: 'assets/products/linen-cloud-quilt.jpg', categoryId: 'bedroom', categoryName: 'Bedroom', stock: 13 },
  { slug: 'noa-bedside-table', name: 'Noa Bedside Table', description: 'A compact bedside table with rounded oak drawer front and open display shelf.', price: 260, imageUrl: 'assets/products/noa-bedside-table.jpg', categoryId: 'bedroom', categoryName: 'Bedroom', stock: 9 },
  { slug: 'aqua-stone-soap-dispenser', name: 'Aqua Stone Soap Dispenser', description: 'A refillable stoneware soap dispenser with a stainless pump for clean vanity styling.', price: 32, imageUrl: 'assets/products/aqua-soap-dispenser.jpg', categoryId: 'bathroom', categoryName: 'Bathroom', stock: 42 },
  { slug: 'serene-vanity-mirror', name: 'Serene Round Vanity Mirror', description: 'A round bathroom mirror with a slim metal frame and anti-fog ready glass surface.', price: 210, imageUrl: 'assets/products/serene-vanity-mirror.jpg', categoryId: 'bathroom', categoryName: 'Bathroom', stock: 10 },
  { slug: 'aura-travertine-cordless-table-lamp', name: 'Aura Travertine Cordless Table Lamp', description: 'Wireless, touch-dimmable table lamp carved from cream-toned travertine stone.', price: 8200, imageUrl: 'https://source.unsplash.com/900x700/?travertine,table-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 9 },
  { slug: 'sumi-pleated-paper-pendant-light', name: 'Sumi Pleated Paper Pendant Light', description: 'Origami-inspired mulberry fiber hanging lamp with a soft sculptural shade.', price: 4700, imageUrl: 'https://source.unsplash.com/900x700/?paper-pendant-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 14 },
  { slug: 'linear-matte-black-floor-arch-lamp', name: 'Linear Matte Black Floor Arch Lamp', description: 'Ultra-slim structural LED steel bar with a dramatic arched floor profile.', price: 9500, imageUrl: 'https://source.unsplash.com/900x700/?black-floor-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 6 },
  { slug: 'amber-glass-mushroom-accent-light', name: 'Amber Glass Mushroom Accent Light', description: 'Mid-century handblown bedside lamp with warm amber glass diffusion.', price: 3900, imageUrl: 'https://source.unsplash.com/900x700/?mushroom-table-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 16 },
  { slug: 'alabaster-stone-sphere-sconce', name: 'Alabaster Stone Sphere Sconce', description: 'Flush-mount wall light with natural mineral veins glowing through the shade.', price: 6900, imageUrl: 'https://source.unsplash.com/900x700/?stone-wall-sconce', categoryId: 'lighting', categoryName: 'Lighting', stock: 8 },
  { slug: 'tokyo-derby-brushed-brass-task-light', name: 'Tokyo Derby Brushed Brass Task Light', description: 'Minimalist directional desk light with a brushed brass finish and focused beam.', price: 5200, imageUrl: 'https://source.unsplash.com/900x700/?brass-desk-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 12 },
  { slug: 'fluted-frosted-glass-globe-lamp', name: 'Fluted Frosted Glass Globe Lamp', description: 'Spherical fluted glass table light with a warm oak wood base.', price: 4100, imageUrl: 'https://source.unsplash.com/900x700/?glass-globe-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 11 },
  { slug: 'raw-concrete-cylinder-spot-wall-mount', name: 'Raw Concrete Cylinder Spot Wall Mount', description: 'Industrial minimalist accent downlight cast in a raw concrete cylinder.', price: 3500, imageUrl: 'https://source.unsplash.com/900x700/?concrete-wall-light', categoryId: 'lighting', categoryName: 'Lighting', stock: 15 },
  { slug: 'modernist-wabi-sabi-clay-table-light', name: 'Modernist Wabi-Sabi Clay Table Light', description: 'Hand-molded asymmetrical ceramic lamp with a calm artisan silhouette.', price: 6100, imageUrl: 'https://source.unsplash.com/900x700/?ceramic-table-lamp', categoryId: 'lighting', categoryName: 'Lighting', stock: 7 },
  { slug: 'eclipse-rotatable-wall-disc', name: 'Eclipse Rotatable Wall Disc', description: 'Indirect wall fixture that rotates to create solar-eclipse shadow effects.', price: 8800, imageUrl: 'https://source.unsplash.com/900x700/?modern-wall-light', categoryId: 'lighting', categoryName: 'Lighting', stock: 5 },
  { slug: 'organic-ribbed-ceramic-vase', name: 'Organic Ribbed Ceramic Vase', description: 'Hand-thrown matte white stoneware vase with organic ribbed texture.', price: 1800, imageUrl: 'https://source.unsplash.com/900x700/?ribbed-ceramic-vase', categoryId: 'decor', categoryName: 'Home Decor', stock: 28 },
  { slug: 'abstract-sandstone-desktop-sculpture', name: 'Abstract Sandstone Desktop Sculpture', description: 'Continuous interlocking loop sculpture carved in a warm geometric form.', price: 2200, imageUrl: 'https://source.unsplash.com/900x700/?abstract-sculpture,stone', categoryId: 'decor', categoryName: 'Home Decor', stock: 18 },
  { slug: 'hand-carved-travertine-catchall-bowl', name: 'Hand-Carved Travertine Catchall Bowl', description: 'Heavy porous stone tray for keys, jewelry, and daily essentials.', price: 2100, imageUrl: 'https://source.unsplash.com/900x700/?travertine-bowl', categoryId: 'decor', categoryName: 'Home Decor', stock: 20 },
  { slug: 'minimalist-solid-brass-satin-bookends', name: 'Minimalist Solid Brass Satin Bookends', description: 'Heavy L-shaped brass columns that hold books with quiet architectural weight.', price: 2400, imageUrl: 'https://source.unsplash.com/900x700/?brass-bookends', categoryId: 'decor', categoryName: 'Home Decor', stock: 14 },
  { slug: 'textured-boucle-ivory-cushion-cover', name: 'Textured Boucle Ivory Cushion Cover', description: 'Premium looped wool tactile pillow cover in a soft ivory tone.', price: 1250, imageUrl: 'https://source.unsplash.com/900x700/?boucle-cushion', categoryId: 'decor', categoryName: 'Home Decor', stock: 35 },
  { slug: 'framed-arched-sandstone-giclee-canvas', name: 'Framed Arched Sandstone Giclee Canvas', description: 'Minimalist monochrome earth line art in an arched sandstone palette.', price: 2350, imageUrl: 'https://source.unsplash.com/900x700/?minimal-wall-art', categoryId: 'decor', categoryName: 'Home Decor', stock: 17 },
  { slug: 'cast-aluminum-brutalist-trifold-candelabra', name: 'Cast Aluminum Brutalist Trifold Candelabra', description: 'Matte charcoal metallic candle holder with sculptural brutalist lines.', price: 1950, imageUrl: 'https://source.unsplash.com/900x700/?candelabra,metal', categoryId: 'decor', categoryName: 'Home Decor', stock: 19 },
  { slug: 'smoked-grey-glass-totem-vase', name: 'Smoked Grey Glass Totem Vase', description: 'Stately geometric tinted glass vessel for a minimal tabletop statement.', price: 1650, imageUrl: 'https://source.unsplash.com/900x700/?grey-glass-vase', categoryId: 'decor', categoryName: 'Home Decor', stock: 23 },
  { slug: 'natural-stoneware-incense-burner-bowl', name: 'Natural Stoneware Incense Burner Bowl', description: 'Minimal incense bowl with a central brass core spike and stoneware finish.', price: 850, imageUrl: 'https://source.unsplash.com/900x700/?incense-burner', categoryId: 'decor', categoryName: 'Home Decor', stock: 31 },
  { slug: 'asymmetric-fluid-form-desk-paperweight', name: 'Asymmetric Fluid Form Desk Paperweight', description: 'Solid stainless steel liquid-mirror drop for a polished desk accent.', price: 1450, imageUrl: 'https://source.unsplash.com/900x700/?metal-paperweight', categoryId: 'decor', categoryName: 'Home Decor', stock: 21 },
  { slug: 'walnut-bronze-mid-century-side-table', name: 'Walnut Bronze Mid-Century Side Table', description: 'Low circular dark-grain timber pedestal with a bronze-toned base.', price: 7800, imageUrl: 'https://source.unsplash.com/900x700/?walnut-side-table', categoryId: 'furniture', categoryName: 'Furniture', stock: 8 },
  { slug: 'japandi-cane-slatted-bench', name: 'Japandi Cane Slatted Bench', description: 'Light ashwood bench with woven natural rattan and clean slatted framing.', price: 9200, imageUrl: 'https://source.unsplash.com/900x700/?cane-bench', categoryId: 'furniture', categoryName: 'Furniture', stock: 6 },
  { slug: 'minimalist-solid-oak-nested-coffee-tables', name: 'Minimalist Solid Oak Nested Coffee Tables', description: 'Interlocking modular tables built for compact, space-saving living rooms.', price: 8900, imageUrl: 'https://source.unsplash.com/900x700/?nested-coffee-tables', categoryId: 'furniture', categoryName: 'Furniture', stock: 7 },
  { slug: 'matte-black-aluminum-floating-gallery-ledges', name: 'Matte Black Aluminum Floating Gallery Ledges', description: 'Slim profile picture rails for clean layered art display walls.', price: 3600, imageUrl: 'https://source.unsplash.com/900x700/?floating-shelf', categoryId: 'furniture', categoryName: 'Furniture', stock: 18 },
  { slug: 'linen-upholstered-lounge-storage-ottoman', name: 'Linen Upholstered Lounge Storage Ottoman', description: 'Unbleached flax-fiber cube footrest with hidden storage inside.', price: 7400, imageUrl: 'https://source.unsplash.com/900x700/?linen-ottoman', categoryId: 'furniture', categoryName: 'Furniture', stock: 9 },
  { slug: 'asymmetrical-organic-outline-full-length-mirror', name: 'Asymmetrical Organic Outline Full-Length Mirror', description: 'Wavy wall-leaning floor mirror with a soft organic silhouette.', price: 9500, imageUrl: 'https://source.unsplash.com/900x700/?wavy-floor-mirror', categoryId: 'furniture', categoryName: 'Furniture', stock: 5 },
  { slug: 'monolithic-dark-travertine-plinth-block', name: 'Monolithic Dark Travertine Plinth Block', description: 'Square luxury display plinth that doubles as a sculptural side platform.', price: 8500, imageUrl: 'https://source.unsplash.com/900x700/?stone-plinth', categoryId: 'furniture', categoryName: 'Furniture', stock: 4 },
  { slug: 'powder-coated-cream-steel-magazine-rack', name: 'Powder-Coated Cream Steel Magazine Rack', description: 'Continuous bent-sheet metal slot for books, journals, and living-room styling.', price: 3900, imageUrl: 'https://source.unsplash.com/900x700/?magazine-rack', categoryId: 'furniture', categoryName: 'Furniture', stock: 13 },
  { slug: 'raw-edge-cedar-stump-stool', name: 'Raw Edge Cedar Stump Stool', description: 'Sustainably harvested cedar accent stool with a natural live-edge top.', price: 6200, imageUrl: 'https://source.unsplash.com/900x700/?wood-stump-stool', categoryId: 'furniture', categoryName: 'Furniture', stock: 10 },
  { slug: 'fluted-glass-minimalist-storage-sideboard', name: 'Fluted Glass Minimalist Storage Sideboard', description: 'Low steel cabinet with reeded glass doors and a quiet modern stance.', price: 9500, imageUrl: 'https://source.unsplash.com/900x700/?fluted-glass-sideboard', categoryId: 'furniture', categoryName: 'Furniture', stock: 3 },
  { slug: 'hinoki-wood-ultrasonic-oil-diffuser', name: 'Hinoki Wood Ultrasonic Oil Diffuser', description: 'Whisper-silent mist system encased in real hinoki-style wood.', price: 2400, imageUrl: 'https://source.unsplash.com/900x700/?wood-oil-diffuser', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 24 },
  { slug: 'kyoto-moss-winter-cedar-incense-pack', name: 'Kyoto Moss & Winter Cedar Incense Pack', description: 'Coreless slow-burning incense sticks packed in a clean glass vial.', price: 650, imageUrl: 'https://source.unsplash.com/900x700/?incense-sticks', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 48 },
  { slug: 'waffle-weave-organic-flax-cotton-robe', name: 'Waffle Weave Organic Flax Cotton Robe', description: 'Absorbent GOTS-certified luxury lounge robe with a textured waffle weave.', price: 2300, imageUrl: 'https://source.unsplash.com/900x700/?waffle-robe', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 18 },
  { slug: 'hand-poured-concrete-soy-candle', name: 'Hand-Poured Concrete Soy Candle', description: 'Fog & Fern clean-burning botanical wax candle in a hand-poured concrete jar.', price: 900, imageUrl: 'https://source.unsplash.com/900x700/?concrete-candle', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 40 },
  { slug: 'natural-sisal-wooden-dry-body-brush', name: 'Natural Sisal Wooden Dry Body Brush', description: 'Exfoliating beechwood self-care brush with natural sisal bristles.', price: 720, imageUrl: 'https://source.unsplash.com/900x700/?body-brush', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 37 },
  { slug: 'apothecary-amber-glass-dropper-set', name: 'Apothecary Amber Glass Dropper Set', description: 'Trio of ultraviolet protective tincture bottles for oils and serums.', price: 820, imageUrl: 'https://source.unsplash.com/900x700/?amber-dropper-bottles', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 34 },
  { slug: 'textured-cotton-meditation-floor-pouf', name: 'Textured Cotton Meditation Floor Pouf', description: 'Firm buckwheat-hull floor cushion wrapped in textured cotton fabric.', price: 1600, imageUrl: 'https://source.unsplash.com/900x700/?meditation-cushion', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 22 },
  { slug: 'himalayan-rock-salt-block-room-ionizer', name: 'Himalayan Rock Salt Block Room Ionizer', description: 'Glow-from-within geometric salt block lamp for warm ambient rooms.', price: 1350, imageUrl: 'https://source.unsplash.com/900x700/?himalayan-salt-lamp', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 29 },
  { slug: 'sandalwood-restorative-sleep-linen-mist', name: 'Sandalwood Restorative Sleep Linen Mist', description: 'Calming room spray in a matte bottle with soft sandalwood aromatics.', price: 780, imageUrl: 'https://source.unsplash.com/900x700/?linen-spray', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 41 },
  { slug: 'pressed-moss-botanical-specimen-frame', name: 'Pressed Moss Botanical Specimen Frame', description: 'Preserved forest elements displayed behind clean gallery glass.', price: 1850, imageUrl: 'https://source.unsplash.com/900x700/?botanical-frame,moss', categoryId: 'wellness', categoryName: 'Wellness & Comfort', stock: 16 },
  { slug: 'mango-wood-flush-handle-serving-tray', name: 'Mango Wood Flush Handle Serving Tray', description: 'Eco-friendly durable flat timber platter with flush integrated handles.', price: 1600, imageUrl: 'https://source.unsplash.com/900x700/?wood-serving-tray', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 28 },
  { slug: 'matte-speckled-charcoal-stoneware-bowls', name: 'Matte Speckled Charcoal Stoneware Bowls', description: 'Nesting trio of organic-rimmed salad bowls in speckled charcoal stoneware.', price: 2100, imageUrl: 'https://source.unsplash.com/900x700/?stoneware-bowls', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 24 },
  { slug: 'borosilicate-glass-minimalist-carafe-set', name: 'Borosilicate Glass Minimalist Carafe Set', description: 'Pitcher with an integrated tumbler dust-cap for bedside or dining use.', price: 1450, imageUrl: 'https://source.unsplash.com/900x700/?glass-carafe', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 31 },
  { slug: 'brushed-champagne-gold-cutlery-set', name: 'Brushed Champagne Gold Cutlery Set', description: '16-piece angular stainless dinnerware set with a champagne gold finish.', price: 2400, imageUrl: 'https://source.unsplash.com/900x700/?gold-cutlery', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 20 },
  { slug: 'raw-edge-cleft-slate-coaster-pack', name: 'Raw Edge Cleft Slate Coaster Pack', description: 'Dark grey protective table shields with a foam-backed natural stone base.', price: 650, imageUrl: 'https://source.unsplash.com/900x700/?slate-coasters', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 50 },
  { slug: 'artisanal-white-ceramic-spice-jar-trio', name: 'Artisanal White Ceramic Spice Jar Trio', description: 'Airtight canisters with cork-plug seals for a clean countertop spice setup.', price: 1350, imageUrl: 'https://source.unsplash.com/900x700/?ceramic-spice-jars', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 33 },
  { slug: 'cast-iron-heavy-matte-tea-press', name: 'Cast Iron Heavy Matte Tea Press', description: 'Traditional tetsubin-style teapot with a fine mesh infuser and matte finish.', price: 2250, imageUrl: 'https://source.unsplash.com/900x700/?cast-iron-teapot', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 18 },
  { slug: 'unbleached-linen-kitchen-hand-towels', name: 'Unbleached Linen Kitchen Hand Towels', description: 'Highly absorbent raw-texture towels with easy hanging loops.', price: 850, imageUrl: 'https://source.unsplash.com/900x700/?linen-kitchen-towels', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 44 },
  { slug: 'carved-olive-wood-organic-salad-spoons', name: 'Carved Olive Wood Organic Salad Spoons', description: 'Ergonomic grain-heavy serving utensils carved from natural olive wood.', price: 1200, imageUrl: 'https://source.unsplash.com/900x700/?wood-salad-spoons', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 36 },
  { slug: 'minimalist-matte-white-porcelain-espresso-cups', name: 'Minimalist Matte White Porcelain Espresso Cups', description: 'Handleless double-walled stackable cups in smooth matte white porcelain.', price: 1500, imageUrl: 'https://source.unsplash.com/900x700/?white-espresso-cups', categoryId: 'kitchen', categoryName: 'Kitchen & Dining', stock: 30 }
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
      const imageUrls = imageGalleryFor(product);
      const imageUrl = imageUrls[0];
      const productDetails = productDetailsFor(product);
      batch.set(productRef, {
        id: product.slug,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl,
        imageUrls,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        stock: product.stock,
        ...productDetails,
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

async function updateProductImagesOnly() {
  console.log('[Seed] Updating product image galleries only...');

  try {
    const batch = db.batch();
    const now = new Date().toISOString();
    let count = 0;

    for (const product of products) {
      const productRef = db.collection('products').doc(product.slug);
      const productSnap = await productRef.get();

      if (!productSnap.exists) {
        continue;
      }

      const imageUrls = imageGalleryFor(product);
      const productDetails = productDetailsFor(product);
      batch.set(productRef, {
        imageUrl: imageUrls[0],
        imageUrls,
        ...productDetails,
        updatedAt: now
      }, { merge: true });
      count++;
    }

    await batch.commit();
    console.log(`[Seed] Updated image galleries for ${count} existing products.`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Image update failed:', error);
    process.exit(1);
  }
}

if (process.argv.includes('--images-only')) {
  updateProductImagesOnly();
} else {
  seedDatabase();
}
