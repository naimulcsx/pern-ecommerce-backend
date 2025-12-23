# PERN E-commerce API - Postman Collection

This folder contains Postman collection and environment files for testing the PERN E-commerce API.

## Files

- `PERN-Ecommerce-API.postman_collection.json` - Complete API collection with all endpoints
- `PERN-Ecommerce-Local.postman_environment.json` - Environment variables for local development

## How to Import

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop both JSON files, or click **Upload Files** and select them
4. The collection and environment will be imported

## Setup

1. After importing, select **PERN E-commerce - Local** environment from the dropdown (top right)
2. Make sure your server is running on `http://localhost:3000`

## Testing Flow

### 1. Authentication
1. **Sign Up** - Create a new user account
2. **Sign In** - Login to get access token (auto-saved to variables)
3. **Get Current User** - Verify authentication works

### 2. Categories (Admin Required)
1. **Get All Categories** - View existing categories
2. **Create Category** - Create a new category (saves categoryId)
3. **Create Subcategory** - Create a child category

### 3. Products (Admin Required for CUD)
1. **Get All Products** - View existing products
2. **Create Product** - Create a new product (saves productId)
3. **Get Product By ID** - View product with variants and images

### 4. Variants (Admin Required for CUD)
1. **Create Variant** - Add color/size variant to product
2. **Create Variant - Storage Option** - Add storage variant with price adjustment
3. **Update Variant** - Modify variant details

### 5. Cart (Authenticated Users)
1. **Add Item to Cart** - Add product to cart
2. **Add Item with Variant** - Add product with specific variant
3. **Get Cart** - View cart contents
4. **Update Cart Item Quantity** - Change quantity
5. **Remove Item from Cart** - Remove single item
6. **Clear Cart** - Empty entire cart

### 6. Orders (Authenticated Users)
1. **Create Order** - Place order from cart items
2. **Get All Orders** - View order history
3. **Get Order By ID** - View order details
4. **Cancel Order** - Cancel your order
5. **Update Order Status** - (Admin) Update status/payment

## Variables

The collection uses these variables (auto-populated by test scripts):

| Variable | Description |
|----------|-------------|
| `baseUrl` | API base URL (default: http://localhost:3000) |
| `accessToken` | JWT token from sign-in |
| `userId` | Current user ID |
| `categoryId` | Last created/used category ID |
| `productId` | Last created/used product ID |
| `variantId` | Last created/used variant ID |
| `cartItemId` | Last created cart item ID |
| `orderId` | Last created order ID |
| `imageId` | Last created image ID |

## API Endpoints Summary

### Auth
- `POST /auth/sign-up` - Register new user
- `POST /auth/sign-in` - Login
- `GET /auth/me` - Get current user (Auth required)

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Categories
- `GET /category` - Get all categories
- `GET /category/:id` - Get category by ID
- `POST /category` - Create category (Admin)
- `PUT /category/:id` - Update category (Admin)
- `DELETE /category/:id` - Delete category (Admin)

### Products
- `GET /product` - Get all products
- `GET /product/:id` - Get product by ID
- `POST /product` - Create product (Admin)
- `PUT /product/:id` - Update product (Admin)
- `DELETE /product/:id` - Delete product (Admin)

### Product Variants
- `GET /product/variant` - Get all variants
- `GET /product/variant/:id` - Get variant by ID
- `POST /product/variant` - Create variant (Admin)
- `PUT /product/variant/:id` - Update variant (Admin)
- `DELETE /product/variant/:id` - Delete variant (Admin)

### Product Images
- `GET /product/image` - Get all images
- `GET /product/image/:id` - Get image by ID
- `POST /product/image` - Create image

### Cart
- `GET /cart` - Get cart (Auth required)
- `POST /cart/item` - Add item to cart (Auth required)
- `PUT /cart/item/:id` - Update cart item (Auth required)
- `DELETE /cart/item/:id` - Remove item from cart (Auth required)
- `DELETE /cart/clear` - Clear cart (Auth required)

### Orders
- `GET /order` - Get all orders (Auth required)
- `GET /order/:id` - Get order by ID (Auth required)
- `POST /order` - Create order (Auth required)
- `PUT /order/:id` - Update order (Auth required)
- `DELETE /order/:id` - Delete order (Admin required)

## Order/Payment Status Enums

### Order Status
- `PENDING` - Order placed, awaiting processing
- `PROCESSING` - Order being prepared
- `SHIPPED` - Order shipped
- `DELIVERED` - Order delivered
- `CANCELLED` - Order cancelled

### Payment Status
- `PENDING` - Payment pending
- `PAID` - Payment completed
- `FAILED` - Payment failed

