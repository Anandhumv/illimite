# Illimité - API Specification Contract

## Public Routes
- GET /api/products -> Returns Product[]
- GET /api/products/:id -> Returns a single Product

## Customer (Logged In) Routes
- POST /api/cart/items -> Updates the Cart, returns updated Cart
- POST /api/orders -> Creates an Order, returns created Order

## Admin Only Routes
- POST /api/products -> Creates a Product, returns created Product
- PATCH /api/orders/:id/status -> Updates Order status, returns updated Order
