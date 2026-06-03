# Illimite Project Progress Documentation

Last updated: June 3, 2026

## 1. Project Overview

Illimite is an ecommerce-style web application for displaying and eventually selling curated lifestyle, furniture, decor, wellness, and technology products. The project is currently built as a full-stack JavaScript application with:

- An Angular frontend for the user interface.
- A Node.js and Express backend API.
- Firebase/Firestore as the database layer.
- Firebase Authentication and client-side service scaffolding for future user accounts, carts, and orders.
- A seed script for adding sample premium products into Firestore.

At the current stage, the main working feature is a product catalog page. The Angular app loads product data from the backend endpoint at `http://localhost:5000/api/products` and displays the products in a clean, minimalist grid.

## 2. Current Completion Status

The project has reached an early MVP foundation stage.

Completed so far:

- Angular client project exists and runs on port `4200`.
- Express backend project exists and runs on port `5000`.
- Firebase Admin SDK is used by the backend to read Firestore data.
- Firebase client SDK is configured in Angular.
- Firestore product seeding script exists.
- Product API endpoints are implemented for reading products.
- Angular service exists for calling the backend product API.
- Angular catalog page replaces the default starter page.
- Catalog UI displays product name, category, price, and an image placeholder.
- Loading, empty, and error states exist for the product catalog.
- Unit test for the root Angular catalog component has been updated.
- Existing documentation exists for the API contract and Firestore data model.

Not fully completed yet:

- Login/register screens are not connected to the UI yet.
- Cart UI is not connected to the catalog yet.
- Checkout/order UI is not completed yet.
- Backend routes for cart, order creation, admin product creation, and admin order status updates are documented but not implemented in Express yet.
- There is some product schema mismatch between the seeded data and the planned core data model.
- Images are currently represented by a clean placeholder in the UI, even though seed data also contains `imageUrl` values.

## 3. Repository Structure

Current high-level structure:

```text
illimite/
  docs/
    api-spec.md
    data-model.md
    illimite.postman_collection.json
    project-progress.md

  illimite-client/
    angular.json
    package.json
    src/
      main.ts
      styles.css
      environments/
      app/
        app.ts
        app.html
        app.css
        app.config.ts
        app.routes.ts
        app.spec.ts
        services/
          api-product.service.ts
        models/
          product.model.ts
          order.model.ts
        core/
          services/
            auth.service.ts
            cart.service.ts
            order.service.ts
            product.service.ts
          models/
            user.model.ts
            product.model.ts
            category.model.ts
            cart.model.ts
            order.model.ts

  illimite-server/
    server.js
    seed.js
    package.json
    .env
    .gitignore
```

## 4. Technology Stack

### Frontend

The frontend uses Angular 20.

Important dependencies:

- `@angular/core`
- `@angular/common`
- `@angular/forms`
- `@angular/router`
- `@angular/fire`
- `firebase`
- `rxjs`
- `typescript`

The Angular app uses standalone components rather than the older NgModule-heavy style. The root component is named `App` and is bootstrapped from `src/main.ts`.

### Backend

The backend uses:

- Node.js
- Express 5
- Firebase Admin SDK
- CORS middleware
- dotenv

Important dependencies:

- `express`
- `cors`
- `dotenv`
- `firebase-admin`

The backend is currently a simple API server that connects to Firestore using a Firebase service account.

### Database

The database is Firestore.

Currently used collections include or are planned to include:

- `products`
- `users`
- `categories`
- `carts`
- `orders`

The actively working collection right now is `products`.

## 5. Frontend Deep Description

### 5.1 Angular Bootstrap Flow

The Angular app starts from:

```text
illimite-client/src/main.ts
```

That file bootstraps the root component:

```ts
bootstrapApplication(App, appConfig)
```

The root component lives in:

```text
illimite-client/src/app/app.ts
```

This Angular project uses newer Angular naming:

- `app.ts` instead of `app.component.ts`
- `app.html` instead of `app.component.html`
- `app.css` instead of `app.component.css`

That is why the actual rendered page is controlled by `src/app/app.html`.

### 5.2 Application Configuration

The app configuration lives in:

```text
illimite-client/src/app/app.config.ts
```

This file provides:

- Angular router support with `provideRouter(routes)`.
- HTTP support with `provideHttpClient()`.
- Firebase app initialization with `provideFirebaseApp(...)`.
- Firebase Auth support with `provideAuth(...)`.
- Firestore support with `provideFirestore(...)`.

The important part for the current product catalog is `provideHttpClient()`. Without it, Angular services using `HttpClient` cannot call the backend API.

### 5.3 Product API Service

The product API service lives in:

```text
illimite-client/src/app/services/api-product.service.ts
```

Its responsibility is to keep HTTP API calls out of the component. The service currently points to:

```text
http://localhost:5000/api
```

It exposes:

```ts
getProducts(): Observable<Product[]>
getProductById(id: string): Observable<Product>
```

The catalog page currently uses `getProducts()` to fetch all seeded products from the backend.

### 5.4 Product Model Used by the Current Catalog

The current catalog model lives in:

```text
illimite-client/src/app/models/product.model.ts
```

Current fields:

```ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stockCount: number;
}
```

This model matches the current seeded product data in `seed.js`.

### 5.5 Root Catalog Component

The root component now does the following:

1. Injects `ApiProductService`.
2. Defines Angular signals for UI state:
   - `products`
   - `isLoading`
   - `errorMessage`
   - `productCount`
3. Calls `getProducts()` inside `ngOnInit()`.
4. Stores the API result in the `products` signal.
5. Displays loading, error, empty, or product-grid UI depending on state.

Important component behavior:

- `trackByProductId()` improves rendering performance in the `*ngFor` loop.
- `getProductInitial()` creates the large placeholder letter shown in each product card.
- `formatPrice()` formats prices as USD currency.

### 5.6 Catalog Template

The catalog template lives in:

```text
illimite-client/src/app/app.html
```

The current UI includes:

- A large minimalist hero heading.
- A short description of the storefront.
- A product count line.
- A loading state.
- An error state.
- An empty state.
- A responsive product grid.

The product grid uses Angular structural directives:

```html
*ngFor="let product of products(); trackBy: trackByProductId"
```

Each product card displays:

- Product category.
- Product name.
- Product price.
- A visual placeholder using the first letter of the product category.

### 5.7 Styling

Component-specific styles live in:

```text
illimite-client/src/app/app.css
```

Global styles live in:

```text
illimite-client/src/styles.css
```

The current design direction is:

- Minimalist.
- Calm and warm.
- Light neutral background.
- Product cards with soft borders.
- Responsive grid layout.
- 8px card radius.
- Clean typography using the system font stack.

The UI avoids the default Angular starter page and now behaves like an actual product catalog.

## 6. Backend Deep Description

### 6.1 Server Entry Point

The backend entry point is:

```text
illimite-server/server.js
```

The server uses CommonJS imports:

```js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();
```

The Express app is created with:

```js
const app = express();
```

Middleware currently enabled:

- `cors()`
- `express.json()`

`cors()` currently allows all origins. This is useful for local development because Angular runs on port `4200` and the backend runs on port `5000`. For production, CORS should be restricted to the real frontend domain.

### 6.2 Firebase Admin Initialization

The backend reads the service account path from:

```text
SERVICE_ACCOUNT_PATH
```

The server tries to load the service account file from the configured path. If that fails, it tries a fallback path by appending `.json`.

When the service account is valid, Firebase Admin is initialized with:

```js
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

This allows the Express server to access Firestore with admin privileges.

Important security note:

- Service account files must never be committed.
- The server `.gitignore` already ignores `.env`, `firebase-key.json`, `firebase-key.json.json`, and `*.key.json`.

### 6.3 Implemented Backend Routes

Currently implemented:

```text
GET /api/health
GET /api/products
GET /api/products/:id
```

#### GET /api/health

Purpose:

- Confirms that the Express server is running.

Example response:

```json
{
  "status": "healthy",
  "message": "Express server skeleton is active"
}
```

#### GET /api/products

Purpose:

- Fetches all product documents from Firestore.

Backend logic:

1. Creates a Firestore database reference using `admin.firestore()`.
2. Reads the `products` collection.
3. Maps each Firestore document into an object with:
   - `id`
   - all document fields
4. Returns the product array as JSON.

#### GET /api/products/:id

Purpose:

- Fetches one product by Firestore document ID.

Backend logic:

1. Reads `products/{id}` from Firestore.
2. Returns `404` if the document does not exist.
3. Returns product data if it exists.

### 6.4 Planned API Routes

The existing API contract also documents future routes:

```text
POST /api/cart/items
POST /api/orders
POST /api/products
PATCH /api/orders/:id/status
```

These routes are not yet implemented in the Express backend.

## 7. Database and Seed Data

### 7.1 Seed Script

The seed script lives in:

```text
illimite-server/seed.js
```

It inserts sample products into Firestore.

The script supports two modes:

1. Firestore emulator mode using `FIRESTORE_EMULATOR_HOST`.
2. Production Firebase project mode using `SERVICE_ACCOUNT_PATH`.

### 7.2 Seeded Product Fields

Each seeded product currently contains:

```text
id
name
description
price
category
imageUrl
stockCount
createdAt
```

The seed script contains 20 premium products across categories such as:

- Lighting
- Furniture
- Wellness
- Decor
- Tech
- Bedroom
- Bathroom

Important behavior:

- The seed script creates new auto-generated Firestore document IDs every time it runs.
- If the seed script is run multiple times, duplicate product sets can appear.
- During verification, the frontend showed 40 products, which likely means the 20-product seed was run twice.

### 7.3 Firestore Data Model Documentation

The planned data model is documented in:

```text
docs/data-model.md
```

It includes:

- `users/{uid}`
- `categories/{id}`
- `products/{id}`
- `carts/{uid}`
- `orders/{id}`

### 7.4 Current Product Schema Mismatch

There is one important mismatch to fix later.

Current seed/catalog product fields:

```text
category
stockCount
```

Planned/core Firestore product model fields:

```text
categoryId
stock
rating
```

This matters because the current catalog works with `category` and `stockCount`, but the future order service expects `stock` when decrementing inventory.

Recommended future decision:

- Either update seed data and catalog model to use `categoryId` and `stock`.
- Or update core services and data docs to standardize on `category` and `stockCount`.

The cleaner long-term ecommerce model is usually:

```text
categoryId
stock
```

with a separate `categories` collection.

## 8. Client-Side Service Layer Already Built

Even though the current UI only displays products, there is already useful service code for future features.

### 8.1 AuthService

File:

```text
illimite-client/src/app/core/services/auth.service.ts
```

Current responsibilities:

- Listen to Firebase Auth state changes.
- Store current user state in an Angular signal.
- Sign up users with email and password.
- Update Firebase Auth display name.
- Create a user profile document in Firestore.
- Sign in users with email and password.
- Sign out users.

Current user state can be:

```text
undefined = auth state still loading
null = not authenticated
UserProfile = authenticated
```

This is a good pattern because the UI can distinguish between loading, logged out, and logged in states.

### 8.2 CartService

File:

```text
illimite-client/src/app/core/services/cart.service.ts
```

Current responsibilities:

- Store cart items in an Angular signal.
- Store guest carts in `localStorage`.
- Store authenticated user carts in Firestore.
- Merge guest cart items into Firestore when a guest logs in.
- Add items to cart.
- Update item quantity.
- Remove items from cart.
- Clear cart.

The cart item model currently uses:

```text
productId
qty
priceAtAdd
```

This is a good ecommerce design because `priceAtAdd` preserves the price at the time the user added the product.

### 8.3 OrderService

File:

```text
illimite-client/src/app/core/services/order.service.ts
```

Current responsibilities:

- Place an order for the authenticated user.
- Reject checkout if the user is not logged in.
- Reject checkout if the cart is empty.
- Calculate order total from cart items.
- Use a Firestore transaction to verify and decrement stock.
- Create an order document.
- Clear the cart after successful order creation.
- Fetch the current user's orders.
- Fetch a single order by ID.
- Update order status as an admin utility.

Important current limitation:

- The order transaction checks the product field `stock`.
- Current seeded products use `stockCount`.
- This must be aligned before checkout can work reliably.

## 9. Current Application Data Flow

The working product catalog flow is:

```text
Browser opens http://localhost:4200
  -> Angular bootstraps App component
  -> App component calls ApiProductService.getProducts()
  -> ApiProductService sends GET request to http://localhost:5000/api/products
  -> Express server receives request
  -> Express reads products from Firestore using Firebase Admin SDK
  -> Express returns JSON Product[]
  -> Angular stores products in a signal
  -> Template renders product cards with *ngFor
```

This means the current frontend does not directly read products from Firestore. Product catalog display goes through the Express API.

## 10. How to Run the Project Locally

### 10.1 Start the Backend

From:

```text
illimite-server
```

Run:

```bash
npm start
```

Expected backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Products API:

```text
http://localhost:5000/api/products
```

### 10.2 Start the Angular Frontend

From:

```text
illimite-client
```

Run:

```bash
npm start
```

Expected frontend URL:

```text
http://localhost:4200
```

### 10.3 Seed Products

From:

```text
illimite-server
```

Run:

```bash
node seed.js
```

Before running this, make sure either:

- `FIRESTORE_EMULATOR_HOST` is set for emulator mode.
- Or `SERVICE_ACCOUNT_PATH` is set for Firebase project mode.

Do not run the seed script repeatedly unless duplicate products are acceptable.

## 11. Verification Already Done

The following checks were run successfully:

```bash
npm run build
```

Result:

- Angular production build completed successfully.

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Result:

- Angular unit tests completed successfully.
- 2 tests passed.

Local endpoint checks:

```text
GET http://localhost:4200
GET http://localhost:5000/api/health
GET http://localhost:5000/api/products
```

Result:

- Angular frontend returned 200.
- Backend health returned 200.
- Products API returned 200.
- Catalog rendered with backend product data.

## 12. Current Known Issues and Technical Debt

### 12.1 Product Schema Needs Standardization

The current catalog uses:

```text
category
stockCount
```

The planned core product model uses:

```text
categoryId
stock
```

This should be fixed before cart/checkout work continues.

### 12.2 Backend API Is Smaller Than the API Contract

The docs already describe cart, order, and admin routes, but Express currently only implements:

```text
GET /api/health
GET /api/products
GET /api/products/:id
```

### 12.3 Some Client Services Bypass the Backend

The current catalog uses Express API through `ApiProductService`.

Some core services use AngularFire directly:

- `AuthService`
- `CartService`
- `OrderService`
- `ProductService`

This is acceptable for Firebase apps, but the project should choose a consistent architecture:

Option A:

- Frontend talks mostly to Express.
- Express handles business logic and Firestore access.

Option B:

- Frontend talks directly to Firebase for most operations.
- Express is only used for server-only/admin tasks.

For ecommerce, Option A is often safer for checkout, inventory, admin operations, and payment validation.

### 12.4 No Product Detail Page Yet

The backend supports fetching one product by ID, but the Angular UI does not yet have:

- Product detail route.
- Product detail component.
- Add-to-cart button behavior.

### 12.5 No Visible Auth UI Yet

Auth service logic exists, but there are no finished UI screens for:

- Register.
- Login.
- Logout.
- Account profile.

### 12.6 No Cart/Checkout UI Yet

Cart and order service logic exists, but there are no finished UI screens for:

- Cart drawer/page.
- Quantity controls.
- Checkout form.
- Shipping address entry.
- Payment reference handling.
- Order confirmation.

### 12.7 Seed Script Can Duplicate Products

Because `seed.js` creates new document IDs every run, repeated seeding creates duplicate products instead of replacing old ones.

Possible future fix:

- Use fixed product slugs as document IDs.
- Or clear the products collection before seeding in development.
- Or make the seed script upsert by slug.

## 13. Suggested Next Development Roadmap

### Phase 1: Stabilize Product Model

- Choose final product schema.
- Update `seed.js`.
- Update Angular product models.
- Update docs.
- Update order stock logic.

Recommended final product fields:

```text
id
name
description
price
categoryId
categoryName
stock
imageUrl
rating
createdAt
```

### Phase 2: Improve Product Catalog

- Show real product images from `imageUrl`.
- Add category filters.
- Add search.
- Add product detail page.
- Add stock display.
- Add "Add to Cart" buttons.

### Phase 3: Build Auth Screens

- Register page.
- Login page.
- Logout button.
- Current user display.
- Route protection for checkout/orders.

### Phase 4: Build Cart UI

- Cart drawer or cart page.
- Quantity increment/decrement.
- Remove item.
- Cart total.
- Persist guest cart.
- Merge guest cart after login.

### Phase 5: Build Checkout and Orders

- Checkout page.
- Shipping address form.
- Payment reference placeholder.
- Order creation.
- Order confirmation screen.
- User order history page.

### Phase 6: Move Business Logic to Backend

- Implement `POST /api/cart/items`.
- Implement `POST /api/orders`.
- Implement admin product creation.
- Implement admin order status update.
- Add authentication middleware to Express.
- Verify Firebase ID tokens on protected routes.

### Phase 7: Admin Features

- Admin dashboard.
- Product management.
- Stock management.
- Order management.
- User role checks.

## 14. Summary

Illimite currently has a strong foundation:

- The Angular app is no longer the default starter page.
- A real product catalog interface is displayed.
- The frontend fetches product data from the backend API.
- The Express backend reads products from Firestore.
- Firebase integration is already started on both client and server.
- Seed data exists for a realistic product catalog.
- Auth, cart, and order services are already scaffolded for future features.

The most important next step is to standardize the data model before building more UI on top of it. Once the product schema is consistent, cart and checkout work will be much smoother.
