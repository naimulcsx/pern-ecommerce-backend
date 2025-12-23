# PERN E-Commerce Backend

A robust e-commerce backend built with PostgreSQL, Express, and Node.js featuring user authentication, product management, cart functionality, and order processing.

## Prerequisites

Before running this project, ensure you have the following installed on your machine:

- **Node.js 24.x** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **Docker** - [Download Docker](https://www.docker.com/)

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/naimulcsx/pern-ecommerce-backend.git
cd pern-ecommerce-backend
```

### 2. Checkout the Branch

If you want to check a specific branch/class, use:

```bash
git checkout <branch_name>
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory based on the `.env.example` file:

```bash
cp .env.example .env
```

Then update the `.env` file with your configuration. Example:

```env
DATABASE_URL="postgresql://postgres:EqUWXwsmExrl@localhost:5432/pern_ecommerce"
JWT_SECRET="your-secret-key-here"
```

### 4. Start Docker Services

Start the PostgreSQL database and pgAdmin using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on `localhost:5432`
- pgAdmin on `localhost:8080`

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Database Migrations

Apply all database migrations:

```bash
npx prisma migrate dev
```

### 7. Generate Prisma Client

Generate the Prisma client for database operations:

```bash
npx prisma generate
```

### 8. Compile TypeScript

Compile TypeScript files to JavaScript:

```bash
npx tsc
```

### 9. Start the Server

Run the development server with auto-reload:

```bash
node --watch src/app.js
```

The server should now be running on `http://localhost:3000` (or the port specified in your `.env` file).

## Project Structure

```
pern-ecommerce-backend/
├── src/
│   ├── app.js                      # Main application entry point
│   ├── controllers/                # Request handlers
│   │   ├── authController.js       # Authentication logic
│   │   ├── cartController.js       # Cart management
│   │   ├── categoryController.js   # Category operations
│   │   ├── orderController.js      # Order processing
│   │   ├── userController.js       # User management
│   │   └── product/                # Product-related controllers
│   │       ├── index.js
│   │       ├── productController.js
│   │       ├── imageController.js
│   │       └── variantController.js
│   ├── routes/                     # API route definitions
│   │   ├── authRoutes.js
│   │   ├── cartRoute.js
│   │   ├── categoryRoute.js
│   │   ├── orderRoutes.js
│   │   ├── productRoute.js
│   │   ├── userRoutes.js
│   │   └── products/               # Product-related routes
│   │       ├── index.js
│   │       ├── productRoute.js
│   │       ├── imageRoute.js
│   │       └── variantRoute.js
│   ├── middleware/                 # Express middleware
│   │   ├── authMiddleware.js       # JWT authentication
│   │   └── adminMiddleware.js      # Admin authorization
│   └── database/
│       └── prisma.js               # Prisma client instance
├── prisma/
│   ├── schema.prisma               # Database schema definition
│   └── migrations/                 # Database migration files
├── generated/                      # Auto-generated Prisma types
├── postman/                        # Postman collection & environment
│   ├── PERN-Ecommerce-API.postman_collection.json
│   ├── PERN-Ecommerce-Local.postman_environment.json
│   └── README.md
├── docs/                           # Documentation
│   ├── database_schema.md
│   └── schema.dbml
├── examples/                       # Example code snippets
├── docker-compose.yml              # Docker services configuration
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

## Testing API Endpoints

To test the API endpoints using Postman:

### 1. Open Postman

Download and install [Postman](https://www.postman.com/downloads/) if you haven't already.

### 2. Import Collection

1. Click on **Import** button in Postman
2. Navigate to the `postman/` folder in this project
3. Select and import:
   - `PERN-Ecommerce-API.postman_collection.json` (API endpoints collection)
   - `PERN-Ecommerce-Local.postman_environment.json` (Local environment variables)

### 3. Select Environment

1. In Postman, select **PERN-Ecommerce-Local** from the environment dropdown (top-right corner)
2. Make sure the `baseUrl` matches your server URL (e.g., `http://localhost:3000`)

### 4. Test Endpoints

You're now ready to test all API endpoints! The collection includes requests for:
- User registration and authentication
- Product CRUD operations
- Category management
- Cart operations
- Order processing
- And more...

## Available API Endpoints

- **Auth**: `/api/auth/*` - Register, Login, Logout
- **Users**: `/api/users/*` - User management
- **Products**: `/api/products/*` - Product CRUD, variants, images
- **Categories**: `/api/categories/*` - Category management
- **Cart**: `/api/cart/*` - Shopping cart operations
- **Orders**: `/api/orders/*` - Order creation and management

Refer to the Postman collection for detailed endpoint documentation.

## Database Management

### Access pgAdmin

pgAdmin is available at `http://localhost:8080`

**Login Credentials:**
- Email: `naimulcsx@gmail.com`
- Password: `testingpassword`

### Useful Prisma Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name migration_name

# Format schema file
npx prisma format
```


## Troubleshooting

### Port Already in Use

If you get an error about port already in use:

```bash
# Kill process on port 3000 (or your specified port)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

1. Ensure Docker containers are running: `docker ps`
2. Check your DATABASE_URL in `.env` file
3. Restart Docker services: `docker-compose restart`

### Migration Errors

If migrations fail, try resetting:

```bash
npx prisma migrate reset
npx prisma migrate dev
```


**Happy Coding! 🚀**
