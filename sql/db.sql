
-- super_categories TABLE CREATION --
CREATE TABLE IF NOT EXISTS public.super_categories
(
    id integer NOT NULL DEFAULT nextval('super_categories_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    CONSTRAINT super_categories_pkey PRIMARY KEY (id)
)
-- categories TABLE CREATION --
CREATE TABLE IF NOT EXISTS public.categories
(
    id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "superCategoryId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT "categories_superCategoryId_fkey" FOREIGN KEY ("superCategoryId")
        REFERENCES public.super_categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
-- sub_categories TABLE CREATION --
CREATE TABLE IF NOT EXISTS public.sub_categories
(
    id integer NOT NULL DEFAULT nextval('sub_categories_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "categoryId" integer,
    "superCategoryId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    CONSTRAINT sub_categories_pkey PRIMARY KEY (id),
    CONSTRAINT "sub_categories_categoryId_fkey" FOREIGN KEY ("categoryId")
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "sub_categories_superCategoryId_fkey" FOREIGN KEY ("superCategoryId")
        REFERENCES public.super_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

-- product_categories TABLE CREATION --
CREATE TABLE IF NOT EXISTS public.product_categories
(
    id integer NOT NULL DEFAULT nextval('product_categories_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "superCategoryId" integer,
    "categoryId" integer,
    "subCategoryId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    CONSTRAINT product_categories_pkey PRIMARY KEY (id),
    CONSTRAINT "product_categories_categoryId_fkey" FOREIGN KEY ("categoryId")
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "product_categories_subCategoryId_fkey" FOREIGN KEY ("subCategoryId")
        REFERENCES public.sub_categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "product_categories_superCategoryId_fkey" FOREIGN KEY ("superCategoryId")
        REFERENCES public.super_categories (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
-- products TABLE CREATION --
CREATE TABLE IF NOT EXISTS public.products
(
    id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "productCategoryId" integer NOT NULL,
    "superCategoryId" integer NOT NULL,
    "categoryId" integer NOT NULL,
    "subCategoryId" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isActive" boolean NOT NULL DEFAULT true,
    pricing json NOT NULL,
    images json NOT NULL,
    "productType" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    attributes json NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId")
        REFERENCES public.categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT "products_productCategoryId_fkey" FOREIGN KEY ("productCategoryId")
        REFERENCES public.product_categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId")
        REFERENCES public.sub_categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT "products_superCategoryId_fkey" FOREIGN KEY ("superCategoryId")
        REFERENCES public.super_categories (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
)


-- users TABLE CREATION --
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "userType" VARCHAR(20) DEFAULT 'normal' CHECK ("userType" IN ('admin', 'vendor', 'delivery', 'normal')),
    "currentOtp" VARCHAR(6),
    "isVerified" BOOLEAN DEFAULT FALSE,
    "isActive" BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20),
    avatar TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- addresses TABLE CREATION --
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('billing', 'shipping')),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    "zipCode" VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    "isDefault" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- inventory TABLE CREATION --
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    quantity INTEGER DEFAULT 0,
    "reservedQuantity" INTEGER DEFAULT 0,
    "reorderLevel" INTEGER DEFAULT 10,
    "lastRestocked" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inventory_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- cart_items TABLE CREATION --
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    "selectedVariant" JSONB,
    price DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    UNIQUE("userId", "productId", "selectedVariant")
);

-- orders TABLE CREATION --
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    "orderNumber" VARCHAR(100) UNIQUE NOT NULL,
    "userId" INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) DEFAULT 0,
    "shippingAmount" DECIMAL(10,2) DEFAULT 0,
    "taxAmount" DECIMAL(10,2) DEFAULT 0,
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "shippingAddressId" INTEGER NOT NULL,
    "billingAddressId" INTEGER,
    "paymentMethod" VARCHAR(50),
    "paymentStatus" VARCHAR(50) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'completed', 'failed', 'refunded')),
    "deliveryDate" TIMESTAMP,
    "vendorId" INTEGER,
    "deliveryPersonId" INTEGER,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId")
        REFERENCES addresses (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT "orders_billingAddressId_fkey" FOREIGN KEY ("billingAddressId")
        REFERENCES addresses (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT "orders_vendorId_fkey" FOREIGN KEY ("vendorId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT "orders_deliveryPersonId_fkey" FOREIGN KEY ("deliveryPersonId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- order_items TABLE CREATION --
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "selectedVariant" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- payments TABLE CREATION --
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "paymentMethod" VARCHAR(50) NOT NULL,
    "paymentGateway" VARCHAR(50),
    "transactionId" VARCHAR(255),
    "gatewayTransactionId" VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    "gatewayResponse" JSONB,
    "refundAmount" DECIMAL(10,2) DEFAULT 0,
    "refundReason" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- shipping TABLE CREATION --
CREATE TABLE IF NOT EXISTS shipping (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "shippingMethod" VARCHAR(100) NOT NULL,
    "trackingNumber" VARCHAR(255),
    "shippingProvider" VARCHAR(100),
    "estimatedDelivery" TIMESTAMP,
    "actualDelivery" TIMESTAMP,
    "shippingCost" DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'pickup_scheduled', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned')),
    "deliveryInstructions" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shipping_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- reviews TABLE CREATION --
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    "isVerified" BOOLEAN DEFAULT FALSE,
    "isApproved" BOOLEAN DEFAULT TRUE,
    "helpfulCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    UNIQUE("userId", "productId")
);

-- coupons TABLE CREATION --
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(10,2) NOT NULL,
    "minOrderAmount" DECIMAL(10,2) DEFAULT 0,
    "maxDiscountAmount" DECIMAL(10,2),
    "usageLimit" INTEGER DEFAULT 1,
    "usedCount" INTEGER DEFAULT 0,
    "userLimit" INTEGER DEFAULT 1,
    "validFrom" TIMESTAMP NOT NULL,
    "validUntil" TIMESTAMP NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    "applicableProducts" JSONB,
    "applicableCategories" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- coupon_usage TABLE CREATION --
CREATE TABLE IF NOT EXISTS coupon_usage (
    id SERIAL PRIMARY KEY,
    "couponId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderId" INTEGER,
    "discountAmount" DECIMAL(10,2) NOT NULL,
    "usedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coupon_usage_couponId_fkey" FOREIGN KEY ("couponId")
        REFERENCES coupons (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "coupon_usage_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "coupon_usage_orderId_fkey" FOREIGN KEY ("orderId")
        REFERENCES orders (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- notifications TABLE CREATION --
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'order', 'payment', 'shipping')),
    "isRead" BOOLEAN DEFAULT FALSE,
    "relatedId" INTEGER,
    "relatedType" VARCHAR(50),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- wishlist TABLE CREATION --
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wishlist_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "wishlist_productId_fkey" FOREIGN KEY ("productId")
        REFERENCES products (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    UNIQUE("userId", "productId")
);

-- UPDATE THE TIMESTAMP OF updatedAt in TABLE --
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGERS FOR TIMESTAMP UPDATES --
CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_addresses
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_cart_items
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_orders
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_order_items
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_payments
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_shipping
BEFORE UPDATE ON shipping
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_reviews
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_coupons
BEFORE UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_notifications
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER IF NOT EXISTS trigger_set_timestamp_inventory
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- CREATE INDEXES FOR PERFORMANCE --
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_userType ON users("userType");
CREATE INDEX IF NOT EXISTS idx_products_userId ON products("userId");
CREATE INDEX IF NOT EXISTS idx_products_isActive ON products("isActive");
CREATE INDEX IF NOT EXISTS idx_cart_items_userId ON cart_items("userId");
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_orderNumber ON orders("orderNumber");
CREATE INDEX IF NOT EXISTS idx_order_items_orderId ON order_items("orderId");
CREATE INDEX IF NOT EXISTS idx_payments_orderId ON payments("orderId");
CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews("productId");
CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications("userId");
CREATE INDEX IF NOT EXISTS idx_inventory_productId ON inventory("productId");
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory(sku);

