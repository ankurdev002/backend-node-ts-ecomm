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
POST /api/users/verify-otp
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

---

## 🏷️ **CATEGORIES**

### 7. Get All Categories

```http
GET /api/categories
```

### 8. Create Category (Admin Only)

```http
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "parentId": null
}
```

### 9. Get Category by ID

```http
GET /api/categories/1
```

### 10. Update Category (Admin Only)

```http
PUT /api/categories/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics Updated",
  "description": "Updated description"
}
```

### 11. Delete Category (Admin Only)

```http
DELETE /api/categories/1
Authorization: Bearer <admin_token>
```

---

## 📦 **PRODUCTS**

### 12. Get All Products

```http
GET /api/products?page=1&limit=10&category=1&search=laptop&minPrice=100&maxPrice=5000
```

### 13. Create Product (Vendor Only)

```http
POST /api/products
Authorization: Bearer <vendor_token>
Content-Type: application/json

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

### 14. Get Product by ID

```http
GET /api/products/1
```

### 15. Update Product (Vendor Only)

```http
PUT /api/products/1
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "name": "MacBook Pro 16 - Updated",
  "price": 2399.99
}
```

### 16. Delete Product (Vendor Only)

```http
DELETE /api/products/1
Authorization: Bearer <vendor_token>
```

---

## 🛒 **SHOPPING CART**

### 17. Get Cart Items

```http
GET /api/cart
Authorization: Bearer <token>
```

### 18. Add Item to Cart

```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2,
  "selectedVariant": {
    "color": "Space Gray",
    "storage": "512GB"
  }
}
```

### 19. Update Cart Item

```http
PUT /api/cart/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### 20. Remove Item from Cart

```http
DELETE /api/cart/1
Authorization: Bearer <token>
```

### 21. Clear Cart

```http
DELETE /api/cart/clear
Authorization: Bearer <token>
```

### 22. Validate Cart

```http
POST /api/cart/validate
Authorization: Bearer <token>
```

---

## 📍 **ADDRESSES**

### 23. Get User Addresses

```http
GET /api/addresses?type=shipping
Authorization: Bearer <token>
```

### 24. Create Address

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

### 25. Get Address by ID

```http
GET /api/addresses/1
Authorization: Bearer <token>
```

### 26. Update Address

```http
PUT /api/addresses/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "street": "456 Updated Street",
  "city": "Los Angeles",
  "state": "CA"
}
```

### 27. Delete Address

```http
DELETE /api/addresses/1
Authorization: Bearer <token>
```

### 28. Set Default Address

```http
PUT /api/addresses/1/default
Authorization: Bearer <token>
```

### 29. Get Default Address

```http
GET /api/addresses/default/shipping
Authorization: Bearer <token>
```

---

## 🛍️ **ORDERS**

### 30. Get User Orders

```http
GET /api/orders?page=1&limit=10
Authorization: Bearer <token>
```

### 31. Create Order from Cart

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddressId": 1,
  "billingAddressId": 1,
  "paymentMethod": "stripe",
  "notes": "Please handle with care"
}
```

### 32. Get Order by ID

```http
GET /api/orders/1
Authorization: Bearer <token>
```

### 33. Cancel Order

```http
PUT /api/orders/1/cancel
Authorization: Bearer <token>
```

### 34. Update Order Status (Vendor/Admin)

```http
PUT /api/orders/1/status
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

---

## 💳 **PAYMENTS**

### 35. Initiate Payment

```http
POST /api/payments/initiate
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "paymentMethod": "stripe",
  "amount": 2499.99
}
```

### 36. Payment Callback (Webhook)

```http
POST /api/payments/1/callback
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "txn_123456"
}
```

### 37. Stripe Callback

```http
POST /api/payments/1/stripe/callback
Content-Type: application/json

{
  "payment_intent": "pi_123456",
  "status": "succeeded"
}
```

### 38. PayPal Callback

```http
POST /api/payments/1/paypal/callback
Content-Type: application/json

{
  "payment_id": "PAY-123456",
  "state": "approved"
}
```

### 39. Refund Payment (Admin Only)

```http
POST /api/payments/1/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Customer request",
  "amount": 2499.99
}
```

### 40. Get Order Payments

```http
GET /api/payments/order/1
Authorization: Bearer <token>
```

### 41. Get Payment Details

```http
GET /api/payments/1
Authorization: Bearer <token>
```

---

## 📦 **SHIPPING**

### 42. Get Order Shipping

```http
GET /api/shipping/order/1
Authorization: Bearer <token>
```

### 43. Update Shipping Status (Admin/Delivery)

```http
PUT /api/shipping/1/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "in_transit",
  "trackingNumber": "TRK123456789",
  "location": "New York Distribution Center"
}
```

### 44. Track Shipment (Public)

```http
GET /api/shipping/track/TRK123456789
```

---

## ⭐ **REVIEWS**

### 45. Create Product Review

```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "title": "Excellent Product!",
  "comment": "This MacBook Pro exceeded my expectations. Great performance and build quality."
}
```

### 46. Get Product Reviews

```http
GET /api/reviews/product/1?page=1&limit=10&rating=5&sortBy=createdAt&sortOrder=DESC
```

### 47. Get User Reviews

```http
GET /api/reviews/user
Authorization: Bearer <token>
```

### 48. Update Review

```http
PUT /api/reviews/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "title": "Good Product - Updated",
  "comment": "Updated review: Still a good product but found some minor issues."
}
```

### 49. Delete Review

```http
DELETE /api/reviews/1
Authorization: Bearer <token>
```

---

## 👨‍💼 **ADMIN PANEL**

### 50. Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

### 51. Get All Users (Admin)

```http
GET /api/admin/users?page=1&limit=10&userType=normal&status=active
Authorization: Bearer <admin_token>
```

### 52. Update User Status (Admin)

```http
PUT /api/admin/users/1/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false,
  "reason": "Policy violation"
}
```

### 53. Get All Orders (Admin)

```http
GET /api/admin/orders?page=1&limit=10&status=pending
Authorization: Bearer <admin_token>
```

### 54. Get All Products (Admin)

```http
GET /api/admin/products?page=1&limit=10&status=active
Authorization: Bearer <admin_token>
```

---

## 🏪 **VENDOR PANEL**

### 55. Vendor Dashboard

```http
GET /api/vendor/dashboard
Authorization: Bearer <vendor_token>
```

### 56. Get Vendor Products

```http
GET /api/vendor/products?page=1&limit=10&category=1&status=active&search=laptop
Authorization: Bearer <vendor_token>
```

### 57. Get Vendor Orders

```http
GET /api/vendor/orders?page=1&limit=10&status=pending&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <vendor_token>
```

### 58. Update Order Status (Vendor)

```http
PUT /api/vendor/orders/1/status
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 59. Inventory Report

```http
GET /api/vendor/inventory
Authorization: Bearer <vendor_token>
```

---

## 🚚 **DELIVERY PANEL**

### 60. Get Assigned Deliveries

```http
GET /api/delivery/assignments?page=1&limit=10&status=assigned
Authorization: Bearer <delivery_token>
```

### 61. Update Delivery Status

```http
PUT /api/delivery/1/status
Authorization: Bearer <delivery_token>
Content-Type: application/json

{
  "status": "picked_up",
  "location": "Picked up from warehouse",
  "notes": "Package secured for delivery"
}
```

### 62. Complete Delivery

```http
PUT /api/delivery/1/complete
Authorization: Bearer <delivery_token>
Content-Type: application/json

{
  "deliveryProof": "https://example.com/proof.jpg",
  "recipientName": "John Doe",
  "notes": "Delivered successfully to customer"
}
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

This comprehensive guide covers all 62+ endpoints in your e-commerce backend system!
