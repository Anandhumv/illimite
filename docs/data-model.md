# Illimité - Firestore Data Model

### users/{uid}
- displayName: string
- email: string
- role: 'customer' | 'admin'
- createdAt: timestamp

### categories/{id}
- name: string
- slug: string
- imageUrl: string

### products/{id}
- name: string
- description: string
- price: number
- categoryId: string
- stock: number
- imageUrl: string
- rating: number
- createdAt: timestamp

### carts/{uid}
- items: Array<{ productId: string, qty: number, priceAtAdd: number }>
- updatedAt: timestamp

### orders/{id}
- userId: string
- items: Array<{ productId: string, qty: number, price: number }>
- total: number
- status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
- shippingAddress: string
- paymentRef: string
- createdAt: timestamp
