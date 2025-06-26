# 🚀 Postman Testing Guide for E-Commerce Backend

## 📁 **File to Import**

**Import this file into Postman:** `POSTMAN_COLLECTION_ALL_ENDPOINTS.json`

This collection contains **ALL 62 API endpoints** with proper payloads and authentication.

## 🔧 **Setup Instructions**

### 1. **Import Collection**

1. Open Postman
2. Click "Import"
3. Select `POSTMAN_COLLECTION_ALL_ENDPOINTS.json`
4. Collection will be imported with all 62 endpoints

### 2. **Environment Variables**

The collection uses these variables:

- `{{base_url}}` = `http://localhost:5000/api` (already set)
- `{{auth_token}}` = Will be automatically set after login

### 3. **Start Your Server**

Make sure your server is running:

```bash
npm run dev
```

## 🎯 **Quick Testing Workflow**

### **Step 1: Authentication**

1. **Register User** - Creates a new account
2. **Login User** - ✨ **Automatically saves auth token for other requests**

### **Step 2: Test Core Features**

1. **Get All Categories** - Public endpoint
2. **Get All Products** - Public endpoint
3. **Create Address** - Requires auth
4. **Add Item to Cart** - Requires auth
5. **Create Order** - Requires auth

### **Step 3: Test Admin Features** (Need admin user)

1. **Create Category**
2. **Admin Dashboard**
3. **Get All Users**

## 📋 **All 62 Endpoints by Category**

### 🔐 **Authentication (4)**

- Register User
- Login User _(auto-saves token)_
- Verify OTP
- Resend OTP

### 👤 **User Management (2)**

- Get User Profile
- Update User Profile

### 🏷️ **Categories (5)**

- Get All Categories
- Create Category _(Admin)_
- Get Category by ID
- Update Category _(Admin)_
- Delete Category _(Admin)_

### 📦 **Products (5)**

- Get All Products
- Create Product _(Vendor)_
- Get Product by ID
- Update Product _(Vendor)_
- Delete Product _(Vendor)_

### 🛒 **Shopping Cart (6)**

- Get Cart Items
- Add Item to Cart
- Update Cart Item
- Remove Item from Cart
- Clear Cart
- Validate Cart

### 📍 **Addresses (7)**

- Get User Addresses
- Create Address
- Get Address by ID
- Update Address
- Delete Address
- Set Default Address
- Get Default Address

### 🛍️ **Orders (5)**

- Get User Orders
- Create Order from Cart
- Get Order by ID
- Cancel Order
- Update Order Status

### 💳 **Payments (7)**

- Initiate Payment
- Payment Callback
- Stripe Callback
- PayPal Callback
- Refund Payment _(Admin)_
- Get Order Payments
- Get Payment Details

### 📦 **Shipping (3)**

- Get Order Shipping
- Update Shipping Status
- Track Shipment

### ⭐ **Reviews (5)**

- Create Product Review
- Get Product Reviews
- Get User Reviews
- Update Review
- Delete Review

### 👨‍💼 **Admin Panel (5)**

- Admin Dashboard
- Get All Users
- Update User Status
- Get All Orders
- Get All Products

### 🏪 **Vendor Panel (5)**

- Vendor Dashboard
- Get Vendor Products
- Get Vendor Orders
- Update Order Status _(Vendor)_
- Inventory Report

### 🚚 **Delivery Panel (3)**

- Get Assigned Deliveries
- Update Delivery Status
- Complete Delivery

## 🎯 **Testing Tips**

### **Authentication Flow:**

1. First run "Register User" to create account
2. Then run "Login User" - token saves automatically
3. All other requests will use the saved token

### **Role-Based Testing:**

- **Normal User**: Register with `"userType": "normal"`
- **Vendor**: Register with `"userType": "vendor"`
- **Admin**: Register with `"userType": "admin"`
- **Delivery**: Register with `"userType": "delivery"`

### **Complete User Journey:**

1. Register → Login
2. Create Address
3. Browse Products → Add to Cart
4. Create Order → Make Payment
5. Track Shipping → Leave Review

### **Error Testing:**

- Try requests without auth token
- Test with invalid IDs
- Test role-based restrictions

## 🔍 **Expected Response Format**

**Success:**

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🚀 **Ready to Test!**

Your server is running on `http://localhost:5000` and all 62 endpoints are ready for testing. The Postman collection handles authentication automatically - just register, login, and start testing!

**Happy Testing! 🎉**
