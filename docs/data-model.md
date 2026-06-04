# Illimite - Firestore Data Model

This document defines the Day 2 Foundation Firestore schema for Illimite.

## categories/{id}

Standalone root-level product category documents.

Example document id:

```text
electronics
```

Fields:

- id: string
- name: string
- slug: string
- imageUrl: string
- updatedAt: timestamp | string

Example:

```json
{
  "id": "electronics",
  "name": "Electronics",
  "slug": "electronics",
  "imageUrl": "https://placehold.co/600x400?text=Illimite+Electronics",
  "updatedAt": "2026-06-04T00:00:00.000Z"
}
```

## products/{slug}

Catalog product documents. Product document IDs use stable slugs to avoid duplicate seed data.

Example document id:

```text
aura-pendant-light
```

Fields:

- id: string
- name: string
- slug: string
- description: string
- price: number
- categoryId: string
- categoryName: string
- stock: number
- imageUrl: string
- imageUrls: string[]
- createdAt: timestamp | string
- updatedAt: timestamp | string

Example:

```json
{
  "id": "aura-pendant-light",
  "name": "Aura Minimalist Pendant Light",
  "slug": "aura-pendant-light",
  "description": "A brushed aluminum suspension lamp with warm, diffused lighting for calm dining spaces.",
  "price": 249,
  "categoryId": "lighting",
  "categoryName": "Lighting",
  "stock": 15,
  "imageUrl": "assets/products/aura-light.jpg",
  "imageUrls": ["assets/products/aura-light.jpg"],
  "createdAt": "2026-06-04T00:00:00.000Z",
  "updatedAt": "2026-06-04T00:00:00.000Z"
}
```

Notes:

- `categoryId` links each product to `categories/{id}`.
- `categoryName` is denormalized onto products so the catalog can render quickly without a second query.
- `imageUrl` is the primary catalog image used by the current Angular UI.
- `imageUrls` is the finalized multi-image product field for future detail/gallery screens.
- `stock` is the inventory field reserved for checkout and order validation.

## carts/{uid}

Customer cart documents for future persistent cart syncing.

Fields:

- uid: string
- items: Array<{ productId: string, qty: number, priceAtAdd: number }>
- updatedAt: timestamp | string

## orders/{id}

Customer order documents for future checkout and fulfillment workflows.

Fields:

- id: string
- userId: string
- items: Array<{ productId: string, qty: number, price: number }>
- total: number
- status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- shippingAddress: string
- paymentRef: string
- createdAt: timestamp | string
- updatedAt: timestamp | string
