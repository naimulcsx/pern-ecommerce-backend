# Database Schema

This document defines the database schema for the e-commerce application.

## 1. Users & Authentication

### `users`
Stores user account information for authentication and profile management.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the user |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User's email address (login identifier) |
| `first_name` | VARCHAR(100) | NOT NULL | User's first name |
| `last_name` | VARCHAR(100) | NOT NULL | User's last name |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT 'customer' | User role (e.g., 'customer', 'admin') |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### `user_addresses`
Stores multiple shipping addresses for users, used during checkout.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the address |
| `user_id` | UUID | NOT NULL, FOREIGN KEY (users.id) | The user this address belongs to |
| `full_name` | VARCHAR(200) | NOT NULL | Recipient's full name |
| `address_label` | VARCHAR(50) | | Optional label (e.g., "Home", "Work") |
| `address_line1` | VARCHAR(255) | NOT NULL | Street address |
| `address_line2` | VARCHAR(255) | | Apartment, suite, etc. |
| `city` | VARCHAR(100) | NOT NULL | City |
| `state` | VARCHAR(100) | NOT NULL | State or province |
| `postal_code` | VARCHAR(20) | NOT NULL | ZIP or postal code |
| `country` | VARCHAR(100) | NOT NULL | Country name |
| `phone_number` | VARCHAR(50) | NOT NULL | Contact phone number |
| `is_default` | BOOLEAN | DEFAULT FALSE | Whether this is the default shipping address |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

## 2. Product Catalog

### `categories`
Hierarchical category structure (e.g., Electronics -> Headphones).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the category |
| `name` | VARCHAR(100) | NOT NULL | Category name (e.g., "Electronics") |
| `slug` | VARCHAR(255) | NOT NULL, UNIQUE | URL-friendly slug |
| `parent_id` | UUID | FOREIGN KEY (categories.id) | Self-referencing FK for subcategories |
| `description` | TEXT | | Optional description |
| `image_url` | VARCHAR(255) | NOT NULL | Category thumbnail image |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### `products`
Core product information. Uses JSONB for flexible specifications (Brand, Model, Battery Life, etc.) displayed on the product details page.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for the product |
| `category_id` | UUID | NOT NULL, FOREIGN KEY (categories.id) | The category this product belongs to |
| `title` | VARCHAR(255) | NOT NULL | Product name |
| `slug` | VARCHAR(255) | NOT NULL, UNIQUE | URL-friendly slug |
| `description` | TEXT | | Detailed product description ("About this item") |
| `base_price` | DECIMAL(10, 2) | NOT NULL | Current selling price |
| `original_price` | DECIMAL(10, 2) | | Original price (for strike-through/discounts) |
| `stock_quantity` | INTEGER | NOT NULL, DEFAULT 0 | Inventory count |
| `specifications` | JSONB | | Key-value pairs for specs (e.g., `{"Brand": "Sony", "Model": "WH-1000XM5"}`) |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Whether to show in "Featured Deals" |
| `is_active` | BOOLEAN | DEFAULT TRUE | Soft delete / hide from store |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### `product_images`
Stores multiple images for a product (thumbnails, main view).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `product_id` | UUID | NOT NULL, FOREIGN KEY (products.id) | The product this image belongs to |
| `image_url` | VARCHAR(255) | NOT NULL | URL to the image file |
| `alt_text` | VARCHAR(255) | | Alt text for accessibility |
| `display_order` | INTEGER | DEFAULT 0 | Order of appearance (0 = Main Image) |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Flag for the main listing image |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### `product_variants`
Handles variations like Color or Size. In the templates, we see Color selection.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `product_id` | UUID | NOT NULL, FOREIGN KEY (products.id) | Parent product |
| `variant_name` | VARCHAR(50) | NOT NULL | Name of variation type (e.g., "Color", "Size") |
| `variant_value` | VARCHAR(50) | NOT NULL | Value (e.g., "Black", "Silver") |
| `price_adjustment` | DECIMAL(10, 2) | DEFAULT 0.00 | Price difference from base product price |
| `stock_quantity` | INTEGER | DEFAULT 0 | Inventory for this specific variant |
| `image_url` | VARCHAR(255) | | Specific image for this variant (e.g. Black headphones) |

## 3. Shopping Cart & Orders

### `carts`
Stores shopping cart sessions. Can be linked to a user or be anonymous (session-based).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `user_id` | UUID | FOREIGN KEY (users.id) | Optional link to a registered user |
| `session_id` | VARCHAR(255) | | Session ID for guest users |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last active timestamp |

### `cart_items`
Individual items within a shopping cart.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `cart_id` | UUID | NOT NULL, FOREIGN KEY (carts.id) | The cart this item belongs to |
| `product_id` | UUID | NOT NULL, FOREIGN KEY (products.id) | The product added |
| `variant_id` | UUID | FOREIGN KEY (product_variants.id) | Specific variant (if applicable) |
| `quantity` | INTEGER | NOT NULL, DEFAULT 1 | Number of units |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | When item was added |

### `orders`
Finalized purchase records. Contains snapshot of shipping info and totals.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `user_id` | UUID | NOT NULL, FOREIGN KEY (users.id) | User who placed the order |
| `status` | VARCHAR(50) | NOT NULL | Order status (pending, processing, shipped, delivered, cancelled) |
| `total_amount` | DECIMAL(10, 2) | NOT NULL | Final total (subtotal + tax + shipping - discount) |
| `shipping_address_snapshot` | JSONB | NOT NULL | Snapshot of the shipping address at time of order |
| `payment_method` | VARCHAR(50) | NOT NULL | Selected method (e.g., 'stripe', 'bkash') |
| `payment_status` | VARCHAR(50) | NOT NULL, DEFAULT 'pending' | Payment status (pending, paid, failed) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Order placement time |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last status update |

### `order_items`
Snapshot of products purchased in an order. Preserves detailed product information at the time of purchase to ensure order history remains accurate even if the product is updated or deleted.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `order_id` | UUID | NOT NULL, FOREIGN KEY (orders.id) | The order this item belongs to |
| `product_id` | UUID | FOREIGN KEY (products.id) | Optional link to live product (ON DELETE SET NULL) |
| `product_snapshot` | JSONB | NOT NULL | Full snapshot of the product data (title, desc, images, etc.) |
| `variant_snapshot` | JSONB | | Full snapshot of the specific variant selected (if any) |
| `quantity` | INTEGER | NOT NULL | Quantity purchased |
| `price_at_purchase` | DECIMAL(10, 2) | NOT NULL | Price per unit at time of order |
| `total_price` | DECIMAL(10, 2) | NOT NULL | quantity * price_at_purchase |

## 4. Reviews & Feedback

### `reviews`
User reviews and ratings for products.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `product_id` | UUID | NOT NULL, FOREIGN KEY (products.id) | The product being reviewed |
| `user_id` | UUID | NOT NULL, FOREIGN KEY (users.id) | The reviewer |
| `rating` | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Star rating (1-5) |
| `comment` | TEXT | | Written review text |
| `is_verified_purchase`| BOOLEAN | DEFAULT FALSE | Flag if user actually bought the item |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Review date |
