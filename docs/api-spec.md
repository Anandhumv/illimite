# Illimite - API Specification Contract

## Public Routes

- GET /api/health -> Returns backend health status
- GET /api/products -> Returns Product[]
- GET /api/products/:id -> Returns a single Product by Firestore document id or slug

## Customer Routes

- POST /api/cart/items -> Mock cart sync contract; accepts cart payload, returns `{ success: true, message: "Cart synchronized successfully" }`
- POST /api/orders -> Mock order submission contract; accepts order payload, returns `{ success: true, orderId: "mock-order-id-12345", message: "Order placed successfully" }`

## Admin Routes

- PATCH /api/orders/:id/status -> Mock fulfillment status contract; accepts `{ status }`, returns `{ success: true, orderId, status, message: "Order status updated" }`
- POST /api/products -> Future admin product creation route; not part of the Day 2 mock contract

## Asset Routes

- POST /api/upload/product-image -> Uploads a product image file to Firebase Storage and returns an image URL

## Implementation Notes

- Product read routes are backed by Firestore.
- Cart, order, and order-status routes are currently mock contract stubs to lock the Day 2 API shape.
- Admin product creation is documented for future implementation and is not implemented yet.
