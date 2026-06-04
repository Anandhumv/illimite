# Illimite - API Specification Contract

## Public Routes

- GET /api/health -> Returns backend health status
- GET /api/categories -> Returns Category[]
- GET /api/products -> Returns Product[]
- GET /api/products/:id -> Returns a single Product by Firestore document id or slug

## Auth Routes

- GET /api/auth/session -> Protected token verification route; requires `Authorization: Bearer <Firebase ID token>`

## Customer Routes

- POST /api/cart/items -> Protected cart sync route; persists cart items to `carts/{uid}`
- GET /api/orders -> Protected order history route; returns the signed-in user's orders
- POST /api/orders -> Protected order creation route; validates stock, decrements product stock, writes an order, and clears the server cart

## Admin Routes

- PATCH /api/orders/:id/status -> Protected fulfillment status route; accepts `{ status }`, updates order status
- POST /api/products -> Future admin product creation route; not part of the Day 2 mock contract

## Asset Routes

- POST /api/upload/product-image -> Uploads a product image file to Firebase Storage and returns an image URL

## Implementation Notes

- Product and category read routes are backed by Firestore.
- Cart sync, order creation, order history, and order-status routes are backed by Firestore.
- Protected routes use Firebase Admin SDK token verification middleware.
- Admin product creation is documented for future implementation and is not implemented yet.
