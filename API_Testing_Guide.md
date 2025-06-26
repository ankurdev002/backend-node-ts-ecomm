# 🚀 E-Commerce Backend API Testing Guide

## 📋 Overview

This guide provides comprehensive testing instructions for all 60+ API endpoints in the e-commerce backend system.

## 🔧 Setup Instructions

### 1. Import Postman Collection

- Import the `E-Commerce_API_Collection.postman_collection.json` file into Postman
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

### 👤 User Management

| Method | Endpoint            | Description      | Auth Required |
| ------ | ------------------- | ---------------- | ------------- |
| GET    | `/users/profile`    | Get user profile | ✅            |
| PUT    | `/users/profile`    | Update profile   | ✅            |
| POST   | `/users/verify-otp` | Verify OTP       | ❌            |
| POST   | `/users/resend-otp` | Resend OTP       | ❌            |

### 🏷️ Categories

| Method | Endpoint          | Description        | Auth Required |
| ------ | ----------------- | ------------------ | ------------- |
| GET    | `/categories`     | Get all categories | ❌            |
| POST   | `/categories`     | Create category    | ✅ (Admin)    |
| GET    | `/categories/:id` | Get category by ID | ❌            |
| PUT    | `/categories/:id` | Update category    | ✅ (Admin)    |
| DELETE | `/categories/:id` | Delete category    | ✅ (Admin)    |

### 📦 Products

| Method | Endpoint        | Description       | Auth Required |
| ------ | --------------- | ----------------- | ------------- |
| GET    | `/products`     | Get all products  | ❌            |
| POST   | `/products`     | Create product    | ✅ (Vendor)   |
| GET    | `/products/:id` | Get product by ID | ❌            |
| PUT    | `/products/:id` | Update product    | ✅ (Vendor)   |
| DELETE | `/products/:id` | Delete product    | ✅ (Vendor)   |

### 🛒 Shopping Cart

| Method | Endpoint        | Description      | Auth Required |
| ------ | --------------- | ---------------- | ------------- |
| GET    | `/cart`         | Get cart items   | ✅            |
| POST   | `/cart/add`     | Add item to cart | ✅            |
| PUT    | `/cart/:itemId` | Update cart item | ✅            |
| DELETE | `/cart/:itemId` | Remove cart item | ✅            |
| DELETE | `/cart/clear`   | Clear cart       | ✅            |

### 📍 Addresses

| Method | Endpoint                   | Description         | Auth Required |
| ------ | -------------------------- | ------------------- | ------------- |
| GET    | `/addresses`               | Get user addresses  | ✅            |
| POST   | `/addresses`               | Create address      | ✅            |
| GET    | `/addresses/:id`           | Get address by ID   | ✅            |
| PUT    | `/addresses/:id`           | Update address      | ✅            |
| DELETE | `/addresses/:id`           | Delete address      | ✅            |
| PUT    | `/addresses/:id/default`   | Set default address | ✅            |
| GET    | `/addresses/default/:type` | Get default address | ✅            |

### 🛍️ Orders

| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| GET    | `/orders`            | Get user orders        | ✅            |
| POST   | `/orders`            | Create order from cart | ✅            |
| GET    | `/orders/:id`        | Get order by ID        | ✅            |
| PUT    | `/orders/:id/status` | Update order status    | ✅ (Vendor)   |
| PUT    | `/orders/:id/cancel` | Cancel order           | ✅            |

### 💳 Payments

| Method | Endpoint                        | Description         | Auth Required |
| ------ | ------------------------------- | ------------------- | ------------- |
| POST   | `/payments/initiate`            | Initiate payment    | ✅            |
| POST   | `/payments/:id/callback`        | Payment callback    | ❌            |
| POST   | `/payments/:id/stripe/callback` | Stripe callback     | ❌            |
| POST   | `/payments/:id/paypal/callback` | PayPal callback     | ❌            |
| POST   | `/payments/:id/refund`          | Refund payment      | ✅ (Admin)    |
| GET    | `/payments/order/:orderId`      | Get order payments  | ✅            |
| GET    | `/payments/:id`                 | Get payment details | ✅            |

### 📦 Shipping

| Method | Endpoint                          | Description            | Auth Required       |
| ------ | --------------------------------- | ---------------------- | ------------------- |
| GET    | `/shipping/order/:orderId`        | Get order shipping     | ✅                  |
| PUT    | `/shipping/:id/status`            | Update shipping status | ✅ (Admin/Delivery) |
| GET    | `/shipping/track/:trackingNumber` | Track shipment         | ❌                  |

### ⭐ Reviews

| Method | Endpoint                      | Description         | Auth Required |
| ------ | ----------------------------- | ------------------- | ------------- |
| POST   | `/reviews`                    | Create review       | ✅            |
| GET    | `/reviews/product/:productId` | Get product reviews | ❌            |
| GET    | `/reviews/user`               | Get user reviews    | ✅            |
| PUT    | `/reviews/:id`                | Update review       | ✅            |
| DELETE | `/reviews/:id`                | Delete review       | ✅            |

### 👨‍💼 Admin Panel

| Method | Endpoint                  | Description        | Auth Required |
| ------ | ------------------------- | ------------------ | ------------- |
| GET    | `/admin/dashboard`        | Admin dashboard    | ✅ (Admin)    |
| GET    | `/admin/users`            | Get all users      | ✅ (Admin)    |
| PUT    | `/admin/users/:id/status` | Update user status | ✅ (Admin)    |
| GET    | `/admin/orders`           | Get all orders     | ✅ (Admin)    |
| GET    | `/admin/products`         | Get all products   | ✅ (Admin)    |

### 🏪 Vendor Panel

| Method | Endpoint                    | Description         | Auth Required |
| ------ | --------------------------- | ------------------- | ------------- |
| GET    | `/vendor/dashboard`         | Vendor dashboard    | ✅ (Vendor)   |
| GET    | `/vendor/products`          | Get vendor products | ✅ (Vendor)   |
| GET    | `/vendor/orders`            | Get vendor orders   | ✅ (Vendor)   |
| PUT    | `/vendor/orders/:id/status` | Update order status | ✅ (Vendor)   |
| GET    | `/vendor/inventory`         | Inventory report    | ✅ (Vendor)   |

### 🚚 Delivery Panel

| Method | Endpoint                 | Description             | Auth Required |
| ------ | ------------------------ | ----------------------- | ------------- |
| GET    | `/delivery/assignments`  | Get assigned deliveries | ✅ (Delivery) |
| PUT    | `/delivery/:id/status`   | Update delivery status  | ✅ (Delivery) |
| PUT    | `/delivery/:id/complete` | Complete delivery       | ✅ (Delivery) |

## 📝 Sample Payloads

### Create Product

```json
{
  "name": "MacBook Pro 16",
  "description": "Apple MacBook Pro 16-inch with M2 chip",
  "price": 2499.99,
  "categoryId": 1,
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "processor": "M2 Pro",
    "memory": "16GB",
    "storage": "512GB SSD"
  },
  "variants": [
    {
      "name": "Space Gray",
      "price": 2499.99,
      "sku": "MBP16-SG-512"
    }
  ]
}
```

### Add to Cart

```json
{
  "productId": 1,
  "quantity": 2,
  "selectedVariant": {
    "color": "Space Gray",
    "storage": "512GB"
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
  "notes": "Please handle with care"
}
```

### Create Review

```json
{
  "productId": 1,
  "rating": 5,
  "title": "Excellent Product!",
  "comment": "This MacBook Pro exceeded my expectations. Great performance and build quality."
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

This guide covers all endpoints in your e-commerce backend. Import the Postman collection and follow this guide to comprehensively test your API!
