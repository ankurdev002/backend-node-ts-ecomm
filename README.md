# 🛒 E-Commerce Backend API

## 📋 Overview

A comprehensive Node.js/TypeScript e-commerce backend built with Express, PostgreSQL, and Sequelize. This API provides complete functionality for user management, product catalog, shopping cart, order processing, payments, shipping, and multi-role access control.

## 🚀 Tech Stack

- **Node.js & TypeScript**: Runtime and type safety
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **Sequelize**: ORM with TypeScript support
- **JWT**: Authentication and authorization
- **Zod**: Schema validation
- **Bcrypt**: Password hashing
- **Nodemailer**: Email service
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger

## 📁 Project Structure

```
src/
├── config/           # Database configuration
├── constants/        # Application constants
├── controllers/      # Request handlers
├── middleware/       # Custom middleware
├── models/          # Sequelize models
├── routes/          # Express routes
├── schema/          # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

## ⚙️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ankurdev002/backend-node-ts-ecomm.git
   cd backend-node-ts-ecomm
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file:**

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Setup database:**

   ```bash
   # Create database
   createdb ecommerce_db

   # Run SQL schema
   psql -d ecommerce_db -f sql/db.sql
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔐 User Roles

- **normal**: Regular customers
- **vendor**: Product sellers
- **admin**: System administrators
- **delivery**: Delivery personnel

## 📱 API Endpoints

### Base URL: `http://localhost:5000/api`

---

## 🔑 Authentication Endpoints

### 1. Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "normal"
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

## 👤 User Management

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
  "phone": "+1234567890"
}
```

### 7. Get All Products List (Public)

```http
GET /api/users/all-products-list?page=1&limit=10
```

---

## 🏷️ Category Management (Admin Only)

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

### 10. Create Category

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

### 11. Create Sub Category

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

### 12. Create Product Category

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

---

## 📦 Product Management (Vendor/Admin)

### 13. Create Product

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

### 14. Get All Products (Admin)

```http
GET /api/products/all-list?page=1&limit=10
Authorization: Bearer <admin_token>
```

### 15. Get Products by Role

```http
GET /api/products/all?page=1&limit=10
Authorization: Bearer <token>
```

### 16. Get Product by ID

```http
GET /api/products/:id
Authorization: Bearer <token>
```

### 17. Update Product

```http
PUT /api/products/:id
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro - Updated",
  "pricing": [
    {
      "label": "Standard",
      "price": 899.99,
      "currency": "USD"
    }
  ]
}
```

### 18. Delete Product

```http
DELETE /api/products/:id
Authorization: Bearer <vendor_token>
```

---

## 🛒 Shopping Cart

### 19. Add Item to Cart

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

### 20. Get User Cart

```http
GET /api/cart
Authorization: Bearer <token>
```

### 21. Update Cart Item

```http
PUT /api/cart/:cartItemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### 22. Remove Cart Item

```http
DELETE /api/cart/:cartItemId
Authorization: Bearer <token>
```

### 23. Clear Cart

```http
DELETE /api/cart
Authorization: Bearer <token>
```

### 24. Validate Cart

```http
GET /api/cart/validate?checkStock=true
Authorization: Bearer <token>
```

---

## 📍 Address Management

### 25. Create Address

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

### 26. Get User Addresses

```http
GET /api/addresses?type=shipping
Authorization: Bearer <token>
```

### 27. Get Default Address

```http
GET /api/addresses/default/shipping
Authorization: Bearer <token>
```

### 28. Get Address by ID

```http
GET /api/addresses/:addressId
Authorization: Bearer <token>
```

### 29. Update Address

```http
PUT /api/addresses/:addressId
Authorization: Bearer <token>
Content-Type: application/json

{
  "street": "456 Updated Street",
  "city": "Los Angeles"
}
```

### 30. Set Default Address

```http
PUT /api/addresses/:addressId/default
Authorization: Bearer <token>
```

### 31. Delete Address

```http
DELETE /api/addresses/:addressId
Authorization: Bearer <token>
```

---

## 🛍️ Order Management

### 32. Create Order

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

### 33. Get User Orders

```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <token>
```

### 34. Get Orders by Status

```http
GET /api/orders/status/pending
Authorization: Bearer <token>
```

### 35. Get Order by ID

```http
GET /api/orders/:orderId
Authorization: Bearer <token>
```

### 36. Update Order Status

```http
PUT /api/orders/:orderId
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 37. Cancel Order

```http
PUT /api/orders/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed mind"
}
```

---

## 💳 Payment Processing

### 38. Initiate Payment

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

### 39. Payment Callback

```http
POST /api/payments/:paymentId/callback
Content-Type: application/json

{
  "status": "completed",
  "transactionId": "txn_123456"
}
```

### 40. Stripe Callback

```http
POST /api/payments/:paymentId/stripe/callback
Content-Type: application/json

{
  "payment_intent": "pi_123456",
  "status": "succeeded"
}
```

### 41. PayPal Callback

```http
POST /api/payments/:paymentId/paypal/callback
Content-Type: application/json

{
  "payment_id": "PAY-123456",
  "state": "approved"
}
```

### 42. Refund Payment (Admin)

```http
POST /api/payments/:paymentId/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Customer request",
  "amount": 999.99
}
```

### 43. Get Order Payments

```http
GET /api/payments/order/:orderId
Authorization: Bearer <token>
```

### 44. Get Payment Details

```http
GET /api/payments/:paymentId
Authorization: Bearer <token>
```

---

## 📦 Shipping & Delivery

### 45. Update Shipping Status

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

### 46. Get Shipping Info

```http
GET /api/shipping/order/:orderId
Authorization: Bearer <token>
```

### 47. Track Shipment (Public)

```http
GET /api/shipping/track/:trackingNumber
```

### 48. Get Delivery Assignments

```http
GET /api/shipping/delivery/assignments?page=1&limit=10
Authorization: Bearer <delivery_token>
```

---

## ⭐ Reviews & Ratings

### 49. Create Review

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

### 50. Get Product Reviews

```http
GET /api/reviews/product/:productId?page=1&limit=10&rating=5&sortBy=createdAt&sortOrder=DESC
```

### 51. Get User Reviews

```http
GET /api/reviews/user
Authorization: Bearer <token>
```

### 52. Update Review

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

### 53. Delete Review

```http
DELETE /api/reviews/:reviewId
Authorization: Bearer <token>
```

---

## 👨‍💼 Admin Panel

### 54. Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

### 55. Get All Users

```http
GET /api/admin/users?page=1&limit=10&userType=normal&status=active
Authorization: Bearer <admin_token>
```

### 56. Update User Status

```http
PUT /api/admin/users/:userId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false,
  "reason": "Policy violation"
}
```

### 57. Get All Orders

```http
GET /api/admin/orders?page=1&limit=10&status=pending
Authorization: Bearer <admin_token>
```

### 58. Get Revenue Report

```http
GET /api/admin/reports/revenue
Authorization: Bearer <admin_token>
```

---

## 🏪 Vendor Panel

### 59. Vendor Dashboard

```http
GET /api/vendor/dashboard
Authorization: Bearer <vendor_token>
```

### 60. Get Vendor Products

```http
GET /api/vendor/products?page=1&limit=10&status=active
Authorization: Bearer <vendor_token>
```

### 61. Get Vendor Orders

```http
GET /api/vendor/orders?page=1&limit=10&status=pending
Authorization: Bearer <vendor_token>
```

### 62. Update Order Status (Vendor)

```http
PUT /api/vendor/orders/:orderId/status
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### 63. Get Inventory Report

```http
GET /api/vendor/inventory/report
Authorization: Bearer <vendor_token>
```

---

## 🚚 Delivery Panel

### 64. Delivery Dashboard

```http
GET /api/delivery/dashboard
Authorization: Bearer <delivery_token>
```

### 65. Get Assigned Orders

```http
GET /api/delivery/orders?page=1&limit=10&status=assigned
Authorization: Bearer <delivery_token>
```

### 66. Update Delivery Status

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

### 67. Get Delivery Route

```http
GET /api/delivery/route?date=2024-01-15
Authorization: Bearer <delivery_token>
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
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

## 🧪 Testing

### Run Tests

```bash
npm test
```

### API Testing

Use the included Postman collection or follow the API Testing Guide for comprehensive endpoint testing.

---

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Rate limiting for sensitive endpoints
- Input validation with Zod schemas
- Helmet.js security headers
- CORS configuration

---

## 📈 Development

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ankur Singh** - [ankurdev002](https://github.com/ankurdev002)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@example.com

---

**Total Endpoints: 67+** | **Multi-Role Support** | **Complete E-Commerce Solution**
