# 🚀 E-Commerce Backend API Testing Guide

## 📋 Overview

This guide provides comprehensive testing instructions for all 89+ API endpoints in the e-commerce backend system based on the actual implemented codebase.

## 🔧 Setup Instructions

### 1. Import Postman Collection

- Import the `E-Commerce_Complete_API_Collection.postman_collection.json` file into Postman
- Set environment variables:
  - `base_url`: `http://localhost:5000/api`
  - `auth_token`: (will be auto-populated after login)

### 2. Start the Server

```bash
npm run dev
```

## 🔐 Authentication Flow

### 1. Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "normal",
  "phone": "+1234567890"
}
```

### 2. Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Note**: Save the returned token for authenticated requests.

## 📱 API Endpoints by Category

### 🔑 Authentication

| Method | Endpoint            | Description   | Auth Required |
| ------ | ------------------- | ------------- | ------------- |
| POST   | `/users/register`   | Register user | ❌            |
| POST   | `/users/login`      | Login user    | ❌            |
| POST   | `/users/verify`     | Verify OTP    | ❌            |
| POST   | `/users/resend-otp` | Resend OTP    | ❌            |

### 👤 User Management

| Method | Endpoint                   | Description           | Auth Required |
| ------ | -------------------------- | --------------------- | ------------- |
| GET    | `/users/profile`           | Get user profile      | ✅            |
| PUT    | `/users/profile`           | Update profile        | ✅            |
| GET    | `/users/all-products-list` | Get products (public) | ❌            |

### 🏷️ Category Management (Admin Only)

| Method | Endpoint                                 | Description             | Auth Required |
| ------ | ---------------------------------------- | ----------------------- | ------------- |
| POST   | `/admin/categories/super-category`       | Create super category   | ✅ (Admin)    |
| GET    | `/admin/categories/super-categories`     | Get super categories    | ✅ (Admin)    |
| GET    | `/admin/categories/super-category/:id`   | Get super category      | ✅ (Admin)    |
| PUT    | `/admin/categories/super-category/:id`   | Update super category   | ✅ (Admin)    |
| DELETE | `/admin/categories/super-category/:id`   | Delete super category   | ✅ (Admin)    |
| POST   | `/admin/categories/category`             | Create category         | ✅ (Admin)    |
| GET    | `/admin/categories/categories`           | Get categories          | ✅ (Admin)    |
| GET    | `/admin/categories/category/:id`         | Get category by ID      | ✅ (Admin)    |
| PUT    | `/admin/categories/category/:id`         | Update category         | ✅ (Admin)    |
| DELETE | `/admin/categories/category/:id`         | Delete category         | ✅ (Admin)    |
| POST   | `/admin/categories/sub-category`         | Create sub category     | ✅ (Admin)    |
| GET    | `/admin/categories/sub-categories`       | Get sub categories      | ✅ (Admin)    |
| GET    | `/admin/categories/sub-category/:id`     | Get sub category        | ✅ (Admin)    |
| PUT    | `/admin/categories/sub-category/:id`     | Update sub category     | ✅ (Admin)    |
| DELETE | `/admin/categories/sub-category/:id`     | Delete sub category     | ✅ (Admin)    |
| POST   | `/admin/categories/product-category`     | Create product category | ✅ (Admin)    |
| GET    | `/admin/categories/product-categories`   | Get product categories  | ✅ (Admin)    |
| GET    | `/admin/categories/product-category/:id` | Get product category    | ✅ (Admin)    |
| PUT    | `/admin/categories/product-category/:id` | Update product category | ✅ (Admin)    |
| DELETE | `/admin/categories/product-category/:id` | Delete product category | ✅ (Admin)    |

### 📦 Product Management

| Method | Endpoint             | Description              | Auth Required     |
| ------ | -------------------- | ------------------------ | ----------------- |
| POST   | `/products/create`   | Create product           | ✅ (Admin/Vendor) |
| GET    | `/products/all-list` | Get all products (admin) | ✅ (Admin/Vendor) |
| GET    | `/products/all`      | Get products by role     | ✅ (Admin/Vendor) |
| GET    | `/products/:id`      | Get product by ID        | ✅ (Admin/Vendor) |
| PUT    | `/products/:id`      | Update product           | ✅ (Admin/Vendor) |
| DELETE | `/products/:id`      | Delete product           | ✅ (Admin/Vendor) |

### 🛒 Shopping Cart

| Method | Endpoint            | Description      | Auth Required |
| ------ | ------------------- | ---------------- | ------------- |
| GET    | `/cart`             | Get cart items   | ✅            |
| POST   | `/cart/add`         | Add item to cart | ✅            |
| PUT    | `/cart/:cartItemId` | Update cart item | ✅            |
| DELETE | `/cart/:cartItemId` | Remove cart item | ✅            |
| DELETE | `/cart`             | Clear cart       | ✅            |
| GET    | `/cart/validate`    | Validate cart    | ✅            |

### 📍 Address Management

| Method | Endpoint                        | Description         | Auth Required |
| ------ | ------------------------------- | ------------------- | ------------- |
| POST   | `/addresses`                    | Create address      | ✅            |
| GET    | `/addresses`                    | Get user addresses  | ✅            |
| GET    | `/addresses/default/:type`      | Get default address | ✅            |
| GET    | `/addresses/:addressId`         | Get address by ID   | ✅            |
| PUT    | `/addresses/:addressId`         | Update address      | ✅            |
| PUT    | `/addresses/:addressId/default` | Set default address | ✅            |
| DELETE | `/addresses/:addressId`         | Delete address      | ✅            |

### 🛍️ Order Management

| Method | Endpoint                  | Description          | Auth Required |
| ------ | ------------------------- | -------------------- | ------------- |
| POST   | `/orders`                 | Create order         | ✅            |
| GET    | `/orders`                 | Get user orders      | ✅            |
| GET    | `/orders/status/:status`  | Get orders by status | ✅            |
| GET    | `/orders/:orderId`        | Get order by ID      | ✅            |
| PUT    | `/orders/:orderId`        | Update order status  | ✅            |
| PUT    | `/orders/:orderId/cancel` | Cancel order         | ✅            |

### 💳 Payment Processing

| Method | Endpoint                               | Description         | Auth Required |
| ------ | -------------------------------------- | ------------------- | ------------- |
| POST   | `/payments/initiate`                   | Initiate payment    | ✅            |
| POST   | `/payments/:paymentId/callback`        | Payment callback    | ❌            |
| POST   | `/payments/:paymentId/stripe/callback` | Stripe callback     | ❌            |
| POST   | `/payments/:paymentId/paypal/callback` | PayPal callback     | ❌            |
| POST   | `/payments/:paymentId/refund`          | Refund payment      | ✅ (Admin)    |
| GET    | `/payments/order/:orderId`             | Get order payments  | ✅            |
| GET    | `/payments/:paymentId`                 | Get payment details | ✅            |

### 📦 Shipping & Delivery

| Method | Endpoint                          | Description              | Auth Required       |
| ------ | --------------------------------- | ------------------------ | ------------------- |
| PUT    | `/shipping/:shippingId/status`    | Update shipping status   | ✅ (Admin/Delivery) |
| GET    | `/shipping/order/:orderId`        | Get shipping info        | ✅                  |
| GET    | `/shipping/track/:trackingNumber` | Track shipment           | ❌                  |
| GET    | `/shipping/delivery/assignments`  | Get delivery assignments | ✅ (Delivery)       |

### ⭐ Reviews & Ratings

| Method | Endpoint                      | Description         | Auth Required |
| ------ | ----------------------------- | ------------------- | ------------- |
| POST   | `/reviews`                    | Create review       | ✅            |
| GET    | `/reviews/product/:productId` | Get product reviews | ❌            |
| GET    | `/reviews/user`               | Get user reviews    | ✅            |
| PUT    | `/reviews/:reviewId`          | Update review       | ✅            |
| DELETE | `/reviews/:reviewId`          | Delete review       | ✅            |

### 👨‍💼 Admin Panel

| Method | Endpoint                      | Description        | Auth Required |
| ------ | ----------------------------- | ------------------ | ------------- |
| GET    | `/admin/dashboard`            | Admin dashboard    | ✅ (Admin)    |
| GET    | `/admin/users`                | Get all users      | ✅ (Admin)    |
| PUT    | `/admin/users/:userId/status` | Update user status | ✅ (Admin)    |
| GET    | `/admin/orders`               | Get all orders     | ✅ (Admin)    |
| GET    | `/admin/reports/revenue`      | Get revenue report | ✅ (Admin)    |

### 🏪 Vendor Panel

| Method | Endpoint                         | Description          | Auth Required |
| ------ | -------------------------------- | -------------------- | ------------- |
| GET    | `/vendor/dashboard`              | Vendor dashboard     | ✅ (Vendor)   |
| GET    | `/vendor/products`               | Get vendor products  | ✅ (Vendor)   |
| GET    | `/vendor/orders`                 | Get vendor orders    | ✅ (Vendor)   |
| PUT    | `/vendor/orders/:orderId/status` | Update order status  | ✅ (Vendor)   |
| GET    | `/vendor/inventory/report`       | Get inventory report | ✅ (Vendor)   |

### 🚚 Delivery Panel

| Method | Endpoint                           | Description            | Auth Required |
| ------ | ---------------------------------- | ---------------------- | ------------- |
| GET    | `/delivery/dashboard`              | Delivery dashboard     | ✅ (Delivery) |
| GET    | `/delivery/orders`                 | Get assigned orders    | ✅ (Delivery) |
| PUT    | `/delivery/orders/:orderId/status` | Update delivery status | ✅ (Delivery) |
| GET    | `/delivery/route`                  | Get delivery route     | ✅ (Delivery) |

### 📦 Inventory Management

| Method | Endpoint                        | Description            | Auth Required     |
| ------ | ------------------------------- | ---------------------- | ----------------- |
| POST   | `/inventory/create`             | Create inventory       | ✅ (Admin/Vendor) |
| GET    | `/inventory/product/:productId` | Get product inventory  | ✅ (Admin/Vendor) |
| PUT    | `/inventory/product/:productId` | Update inventory       | ✅ (Admin/Vendor) |
| POST   | `/inventory/restock/:productId` | Restock product        | ✅ (Admin/Vendor) |
| GET    | `/inventory/low-stock`          | Get low stock products | ✅ (Admin/Vendor) |
| GET    | `/inventory/out-of-stock`       | Get out of stock       | ✅ (Admin/Vendor) |
| GET    | `/inventory/report`             | Get inventory report   | ✅ (Admin/Vendor) |

## 📝 Sample Payloads

### Register User

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "normal"
}
```

### Create Super Category

```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

### Create Category

```json
{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "superCategoryId": 1
}
```

### Create Product

```json
{
  "name": "iPhone 15 Pro",
  "productCategoryId": 1,
  "superCategoryId": 1,
  "categoryId": 1,
  "subCategoryId": 1,
  "isActive": true,
  "productType": "smartphone",
  "userId": 2,
  "pricing": [
    {
      "label": "Standard",
      "price": 999.99,
      "currency": "USD",
      "currencySymbol": "$"
    }
  ],
  "images": {
    "black": ["https://example.com/image1.jpg"],
    "white": ["https://example.com/image2.jpg"]
  },
  "attributes": {
    "brand": "Apple",
    "capacity": "128GB",
    "power": "A17 Pro"
  }
}
```

### Add to Cart

```json
{
  "productId": 1,
  "quantity": 2,
  "selectedVariant": {
    "color": "black",
    "storage": "128GB"
  }
}
```

### Create Address

```json
{
  "type": "shipping",
  "firstName": "John",
  "lastName": "Doe",
  "company": "Tech Corp",
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10001",
  "phone": "+1234567890",
  "isDefault": true
}
```

### Create Order

```json
{
  "shippingAddressId": 1,
  "billingAddressId": 1,
  "paymentMethod": "stripe",
  "notes": "Handle with care",
  "couponCode": "SAVE10"
}
```

### Create Review

```json
{
  "productId": 1,
  "rating": 5,
  "title": "Excellent Product!",
  "comment": "This product exceeded my expectations."
}
```

### Update Order Status

```json
{
  "status": "confirmed"
}
```

### Cancel Order

```json
{
  "reason": "Changed mind"
}
```

### Initiate Payment

```json
{
  "orderId": 1,
  "paymentMethod": "stripe",
  "amount": 999.99
}
```

### Update Shipping Status

```json
{
  "status": "in_transit",
  "trackingNumber": "TRK123456789",
  "location": "New York Distribution Center"
}
```

### Create Inventory

```json
{
  "productId": 1,
  "sku": "PHONE-001",
  "quantity": 100,
  "reorderLevel": 10
}
```

### Update Inventory

```json
{
  "quantity": 150,
  "reorderLevel": 15,
  "sku": "PHONE-001-UPDATED"
}
```

### Restock Product

```json
{
  "quantity": 50
}
```

## 🔍 Testing Scenarios

### 1. Complete User Journey

1. Register new user
2. Login and get token
3. Create shipping address
4. Browse products
5. Add products to cart
6. Create order from cart
7. Make payment
8. Track order status
9. Leave product review

### 2. Vendor Workflow

1. Register as vendor
2. Login with vendor credentials
3. Create products
4. Manage inventory
5. Process orders
6. Update order status

### 3. Admin Operations

1. Login as admin
2. View dashboard statistics
3. Manage users
4. Oversee all orders
5. Handle refunds

### 4. Delivery Process

1. Login as delivery person
2. View assigned deliveries
3. Update delivery status
4. Complete deliveries

## 🚨 Error Testing

### Test Invalid Scenarios:

- Invalid authentication tokens
- Missing required fields
- Invalid data types
- Unauthorized access attempts
- Non-existent resource IDs
- Duplicate entries where not allowed

## 📊 Response Formats

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🔧 Environment Variables

Set these in your Postman environment:

- `base_url`: `http://localhost:5000/api`
- `auth_token`: (auto-populated after login)

## 📈 Performance Testing

- Test with multiple concurrent requests
- Verify pagination works correctly
- Check response times for complex queries
- Test file upload endpoints (if implemented)

## 🛡️ Security Testing

- Verify JWT token validation
- Test role-based access control
- Check for SQL injection vulnerabilities
- Validate input sanitization
- Test rate limiting functionality

This comprehensive guide covers all 89+ endpoints in your e-commerce backend system. Import the Postman collection and follow this guide to thoroughly test your API across all user roles and functionality!
