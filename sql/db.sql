
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
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    "currentOtp" VARCHAR(6),
    "isVerified" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UPDATE THE TIMESTAMP OF updatedAt in TABLE --
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGER TO UPDATE updatedAt COLUMN BEFORE UPDATE --
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

