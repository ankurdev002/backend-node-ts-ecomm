# 🚀 E-Commerce Backend API - Complete Endpoints Guide

## 📋 Base URL

```
http://localhost:5000/api
```

## 🔐 Authentication

Most endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📱 **AUTHENTICATION ENDPOINTS**

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

### 3. Verify OTP

```http
POST /api/users/verify
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### 4. Resend OTP

```http
POST /api/users/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

---

## 👤 **USER MANAGEMENT**

### 5. Get User Profile

```http
GET /api/users/profile
Authorization: Bearer <token>
```

### 6. Update User Profile

```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+1234567891"
}
```

### 7. Get All Products List (Public)

```http
GET /api/users/all-products-list?page=1&limit=10
```

---

## 🏷️ **CATEGORY MANAGEMENT (Admin Only)**

### 8. Create Super Category

```http
POST /api/admin/categories/super-category
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

### 9. Get All Super Categories

```http
GET /api/admin/categories/super-categories?page=1&limit=10
Authorization: Bearer <admin_token>
```

### 10. Get Super Category by ID

```http
GET /api/admin/categories/super-category/1
Authorization: Bearer <admin_token>
```

### 11. Update Super Category

```http
PUT /api/admin/categories/super-category/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics Updated",
  "description": "Updated description"
}
```

### 12. Delete Super Category

```http
DELETE /api/admin/categories/super-category/1
Authorization: Bearer <admin_token>
```

### 13. Create Category

```http
POST /api/admin/categories/category
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "superCategoryId": 1
}
```

### 14. Get All Categories

```http
GET /api/admin/categories/categories?page=1&limit=10
Authorization: Bearer <admin_token>
```

### 15. Get Category by ID

```http
GET /api/admin/categories/category/1
Authorization: Bearer <admin_token>
```

### 16. Update Category

```http
PUT /api/admin/categories/category/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Smartphones Updated",
  "description": "Updated description",
  "superCategoryId": 1
}
```

### 17. Delete Category

```http
DELETE /api/admin/categories/category/1
Authorization: Bearer <admin_token>
```

### 18. Create Sub Category

```http
POST /api/admin/categories/sub-category
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Android Phones",
  "description": "Android smartphones",
  "categoryId": 1
}
```

### 19. Get All Sub Categories

```http
GET /api/admin/categories/sub-categories?page=1&limit=10
Authorization: Bearer <admin_token>
```

### 20. Get Sub Category by ID

```http
GET /api/admin/categories/sub-category/1
Authorization: Bearer <admin_token>
```

### 21. Update Sub Category

```http
PUT /api/admin/categories/sub-category/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Android Phones Updated",
  "description": "Updated description",
  "categoryId": 1
}
```

### 22. Delete Sub Category

```http
DELETE /api/admin/categories/sub-category/1
Authorization: Bearer <admin_token>
```

### 23. Create Product Category

```http
POST /api/admin/categories/product-category
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Flagship Phones",
  "description": "High-end smartphones",
  "subCategoryId": 1
}
```

### 24. Get All Product Categories

```http
GET /api/admin/categories/product-categories?page=1&limit=10
Authorization: Bearer <admin_token>
```

### 25. Get Product Category by ID

```http
GET /api/admin/categories/product-category/1
Authorization: Bearer <admin_token>
```

### 26. Update Product Category

```http
PUT /api/admin/categories/product-category/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Flagship Phones Updated",
  "description": "Updated description",
  "subCategoryId": 1
}
```

### 27. Delete Product Category

```http
DELETE /api/admin/categories/product-category/1
Authorization: Bearer <admin_token>
```

---

## 📦 **PRODUCT MANAGEMENT (Vendor/Admin)**

### 28. Create Product

```http
POST /api/products/create
Authorization: Bearer <vendor_token>
Content-Type: application/json

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

### 29. Get All Products (Admin)

```http
GET /api/products/all-list?page=1&limit=10
Authorization: Bearer <admin_token>
```

### 30. Get Products by Role

```http
GET /api/products/all?page=1&limit=10
Authorization: Bearer <token>
```

### 31. Get Product by ID

```http
GET /api/products/1
Authorization: Bearer <token>
```

### 32. Update Product

```http
PUT /api/products/1
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro - Updated",
  "userId": 2,
  "pricing": [
    {
      "label": "Standard",
      "price": 899.99,
      "currency": "USD"
    }
  ]
}
```

### 33. Delete Product

```http
DELETE /api/products/1
Authorization: Bearer <vendor_token>
```

---

## 🛒 **SHOPPING CART**

### 34. Add Item to Cart

```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2,
  "selectedVariant": {
    "color": "black",
    "storage": "128GB"
  }
}
```

### 35. Get Cart Items

```http
GET /api/cart
Authorization: Bearer <token>
```

### 36. Update Cart Item

```http
PUT /api/cart/:cartItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### 37. Remove Item from Cart

```http
DELETE /api/cart/:cartItemId
Authorization: Bearer <token>
```

### 38. Clear Cart

```http
DELETE /api/cart
Authorization: Bearer <token>
```

### 39. Validate Cart

```http
GET /api/cart/validate?checkStock=true
Authorization: Bearer <token>
```

---

## 📍 **ADDRESS MANAGEMENT**

### 40. Create Address

```http
POST /api/addresses
Authorization: Bearer <token>
Content-Type: application/json

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

### 41. Get User Addresses

```http
GET /api/addresses?type=shipping
Authorization: Bearer <token>
```

### 42. Get Default Address

```http
GET /api/addresses/default/shipping
Authorization: Bearer <token>
```

### 43. Get Address by ID

```http
GET /api/addresses/:addressId
Authorization: Bearer <token>
```

### 44. Update Address

```http
PUT /api/addresses/:addressId
Authorization: Bearer <token>
Content-Type: application/json

{
  "street": "456 Updated Street",
  "city": "Los Angeles",
  "state": "CA"
}
```

### 45. Set Default Address

```http
PUT /api/addresses/:addressId/default
Authorization: Bearer <token>
```

### 46. Delete Address

```http
DELETE /api/addresses/:addressId
Authorization: Bearer <token>
```

---

## 🛍️ **ORDER MANAGEMENT**

### 47. Create Order

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": 1,
  "billingAddressId": 1,
  "paymentMethod": "stripe",
  "notes": "Handle with care",
  "couponCode": "SAVE10"
}
```

### 48. Get User Orders

```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### 49. Get Orders by Status

```http
GET /api/orders/status/pending
Authorization: Bearer <token>
```

### 50. Get Order by ID

```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

### 51. Update Order Status

```http
PUT /api/orders/:orderId
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 52. Cancel Order

```http
PUT /api/orders/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed mind"
}
```

---

## 💳 **PAYMENT PROCESSING**

### 53. Initiate Payment

```http
POST /api/payments/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "paymentMethod": "stripe",
  "amount": 999.99
}
```

### 54. Payment Callback

```http
POST /api/payments/:paymentId/callback
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "txn_123456"
}
```

### 55. Stripe Callback

```http
POST /api/payments/:paymentId/stripe/callback
Content-Type: application/json

{
  "payment_intent": "pi_123456",
  "status": "succeeded"
}
```

### 56. PayPal Callback

```http
POST /api/payments/:paymentId/paypal/callback
Content-Type: application/json

{
  "payment_id": "PAY-123456",
  "state": "approved"
}
```

### 57. Refund Payment (Admin)

```http
POST /api/payments/:paymentId/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Customer request",
  "amount": 999.99
}
```

### 58. Get Order Payments

```http
GET /api/payments/order/:orderId
Authorization: Bearer <token>
```

### 59. Get Payment Details

```http
GET /api/payments/:paymentId
Authorization: Bearer <token>
```

---

## 📦 **SHIPPING & DELIVERY**

### 60. Update Shipping Status

```http
PUT /api/shipping/:shippingId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "in_transit",
  "trackingNumber": "TRK123456789",
  "location": "New York Distribution Center"
}
```

### 61. Get Shipping Info

```http
GET /api/shipping/order/:orderId
Authorization: Bearer <token>
```

### 62. Track Shipment (Public)

```http
GET /api/shipping/track/:trackingNumber
```

### 63. Get Delivery Assignments

```http
GET /api/shipping/delivery/assignments?page=1&limit=10
Authorization: Bearer <delivery_token>
```

---

## ⭐ **REVIEWS & RATINGS**

### 64. Create Review

```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "title": "Excellent Product!",
  "comment": "This product exceeded my expectations."
}
```

### 65. Get Product Reviews

```http
GET /api/reviews/product/:productId?page=1&limit=10&rating=5&sortBy=createdAt&sortOrder=DESC
```

### 66. Get User Reviews

```http
GET /api/reviews/user
Authorization: Bearer <token>
```

### 67. Update Review

```http
PUT /api/reviews/:reviewId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "title": "Good Product - Updated",
  "comment": "Updated review comment."
}
```

### 68. Delete Review

```http
DELETE /api/reviews/:reviewId
Authorization: Bearer <token>
```

---

## 👨‍💼 **ADMIN PANEL**

### 69. Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

### 70. Get All Users

```http
GET /api/admin/users?page=1&limit=10&userType=normal&status=active
Authorization: Bearer <admin_token>
```

### 71. Update User Status

```http
PUT /api/admin/users/:userId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false,
  "reason": "Policy violation"
}
```

### 72. Get All Orders

```http
GET /api/admin/orders?page=1&limit=10&status=pending
Authorization: Bearer <admin_token>
```

### 73. Get Revenue Report

```http
GET /api/admin/reports/revenue
Authorization: Bearer <admin_token>
```

---

## 🏪 **VENDOR PANEL**

### 74. Vendor Dashboard

```http
GET /api/vendor/dashboard
Authorization: Bearer <vendor_token>
```

### 75. Get Vendor Products

```http
GET /api/vendor/products?page=1&limit=10&status=active
Authorization: Bearer <vendor_token>
```

### 76. Get Vendor Orders

```http
GET /api/vendor/orders?page=1&limit=10&status=pending
Authorization: Bearer <vendor_token>
```

### 77. Update Order Status (Vendor)

```http
PUT /api/vendor/orders/:orderId/status
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 78. Get Inventory Report

```http
GET /api/vendor/inventory/report
Authorization: Bearer <vendor_token>
```

---

## 🚚 **DELIVERY PANEL**

### 79. Delivery Dashboard

```http
GET /api/delivery/dashboard
Authorization: Bearer <delivery_token>
```

### 80. Get Assigned Orders

```http
GET /api/delivery/orders?page=1&limit=10&status=assigned
Authorization: Bearer <delivery_token>
```

### 81. Update Delivery Status

```http
PUT /api/delivery/orders/:orderId/status
Authorization: Bearer <delivery_token>
Content-Type: application/json

{
  "status": "picked_up",
  "location": "Picked up from warehouse",
  "notes": "Package secured"
}
```

### 82. Get Delivery Route

```http
GET /api/delivery/route?date=2024-01-15
Authorization: Bearer <delivery_token>
```

## 📦 **INVENTORY MANAGEMENT (Admin/Vendor)**

### 83. Create Inventory

```http
POST /api/inventory/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "productId": 1,
  "sku": "PHONE-001",
  "quantity": 100,
  "reorderLevel": 10
}
```

### 84. Get Product Inventory

```http
GET /api/inventory/product/:productId
Authorization: Bearer <admin_token>
```

### 85. Update Product Inventory

```http
PUT /api/inventory/product/:productId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantity": 150,
  "reorderLevel": 15,
  "sku": "PHONE-001-UPDATED"
}
```

### 86. Restock Product

```http
POST /api/inventory/restock/:productId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantity": 50
}
```

### 87. Get Low Stock Products

```http
GET /api/inventory/low-stock
Authorization: Bearer <admin_token>
```

### 88. Get Out of Stock Products

```http
GET /api/inventory/out-of-stock
Authorization: Bearer <admin_token>
```

### 89. Get Inventory Report

```http
GET /api/inventory/report
Authorization: Bearer <admin_token>
```

---

## 📊 **RESPONSE FORMAT**

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
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

---

## 🔍 **TESTING WORKFLOW**

### Complete User Journey:

1. **Register** → `POST /api/users/register`
2. **Login** → `POST /api/users/login` (save token)
3. **Create Address** → `POST /api/addresses`
4. **Browse Products** → `GET /api/products`
5. **Add to Cart** → `POST /api/cart/add`
6. **Create Order** → `POST /api/orders`
7. **Make Payment** → `POST /api/payments/initiate`
8. **Track Order** → `GET /api/orders/1`
9. **Leave Review** → `POST /api/reviews`

### Vendor Workflow:

1. **Register as Vendor** → `POST /api/users/register` (userType: "vendor")
2. **Login** → `POST /api/users/login`
3. **Create Products** → `POST /api/products`
4. **View Dashboard** → `GET /api/vendor/dashboard`
5. **Manage Orders** → `GET /api/vendor/orders`

### Admin Workflow:

1. **Login as Admin** → `POST /api/users/login`
2. **View Dashboard** → `GET /api/admin/dashboard`
3. **Manage Users** → `GET /api/admin/users`
4. **Handle Refunds** → `POST /api/payments/1/refund`

---

## 🛡️ **USER ROLES**

- **normal**: Regular customers
- **vendor**: Product sellers
- **admin**: System administrators
- **delivery**: Delivery personnel

---

## 📝 **TESTING TIPS**

1. Start with authentication endpoints
2. Create test data (categories, products, addresses)
3. Test complete workflows end-to-end
4. Verify role-based access control
5. Test error scenarios (invalid data, unauthorized access)
6. Check pagination and filtering
7. Validate response formats

This comprehensive guide covers all 89+ endpoints in your e-commerce backend system!
