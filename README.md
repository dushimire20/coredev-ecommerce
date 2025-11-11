# CoreDev E-Commerce API

A robust e-commerce API built with Node.js, Express.js, TypeScript, and Prisma. This API provides authentication, product management, and order processing functionalities.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Product Management**: Full CRUD operations for products (Admin only)
- **Order Management**: Place orders, view user orders, and admin order oversight
- **Role-based Access Control**: Admin and User roles with appropriate permissions
- **Data Validation**: Comprehensive input validation using Joi
- **Database Integration**: PostgreSQL with Prisma ORM
- **Error Handling**: Centralized error handling middleware
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Testing**: Jest, Supertest

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd coredev-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=4000
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:4000`.

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Product Endpoints

#### Get Products (Public)
```http
GET /products?page=1&limit=10&search=term
```

#### Get Product by ID (Public)
```http
GET /products/:id
```

#### Create Product (Admin only)
```http
POST /products
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "stock": 100,
  "category": "Electronics"
}
```

#### Update Product (Admin only)
```http
PUT /products/:id
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 39.99
}
```

#### Delete Product (Admin only)
```http
DELETE /products/:id
Authorization: Bearer <admin-jwt-token>
```

### Order Endpoints

#### Place Order (Authenticated users)
```http
POST /orders
Authorization: Bearer <user-jwt-token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2
    }
  ],
  "description": "Order description"
}
```

#### Get User Orders (Authenticated users)
```http
GET /orders
Authorization: Bearer <user-jwt-token>
```

#### Get All Orders (Admin only)
```http
GET /orders/all
Authorization: Bearer <admin-jwt-token>
```

The tests cover:
- User authentication (registration, login)
- Product CRUD operations
- Order placement and retrieval
- Authorization and validation

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── productController.ts
│   └── orderController.ts
├── middlewares/          # Express middlewares
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/               # API routes
│   ├── auth.ts
│   ├── product.ts
│   └── order.ts
├── utils/                # Utility functions
│   └── validators.ts
├── tests/                # Test files
│   ├── setup.ts
│   ├── auth.test.ts
│   ├── product.test.ts
│   └── order.test.ts
└── app.ts                # Express app setup
prisma/
├── schema.prisma         # Database schema
└── migrations/           # Database migrations
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 4000)
- `TEST_DATABASE_URL`: Database URL for testing (optional)


