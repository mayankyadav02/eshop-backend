# eShop Backend

## Project Overview

eShop Backend is a Node.js and Express.js API server for the full-stack e-commerce application.
It provides RESTful APIs to manage **products, users, carts, and orders**.
MongoDB is used as the database, and authentication is implemented using **JWT tokens**.

## Features

- User registration and login with JWT authentication.
- Role-based access control (Admin/User).
- CRUD operations for products (Admin only).
- Order creation and management.
- Persistent cart and order handling.
- Input validation and error handling.
- Integration with frontend via RESTful APIs.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing
- **Environment Variables:** .env

## Installation

Clone the repository:

```bash
git clone https://github.com/mayankyadav02/eshop-backend.git
```

Install dependencies:
cd eshop-backend
npm install
Create .env file based on .env.example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the server: npm run dev

## Folder Structure

backend/
 ├── controllers/        # Business logic for products, users, orders
 ├── routes/             # API endpoints
 ├── models/             # Mongoose schemas for Product, User, Order
 ├── middleware/         # Auth, error handling, validation
 ├── config/db.js        # MongoDB connection
 ├── server.js           # Express server entry point
 └── package.json


## API Endpoints

User Routes
POST /api/users/register → Register a new user

POST /api/users/login → Login and get JWT token

GET /api/users/profile → Get logged-in user profile (Protected)

PUT /api/users/profile → Update user profile (Protected)

Product Routes
GET /api/products → List all products

GET /api/products/:id → Get product by ID

POST /api/products → Add new product (Admin only)

PUT /api/products/:id → Update product (Admin only)

DELETE /api/products/:id → Delete product (Admin only)

Order Routes
POST /api/orders → Create new order (Protected)

GET /api/orders/:id → Get order by ID (Protected)

GET /api/orders/user/:id → Get orders for specific user

GET /api/orders → Admin: List all orders

Middleware
authMiddleware.js → Verifies JWT token and protects routes.

errorMiddleware.js → Centralized error handling for API responses.


## Usage

Start backend server on http://localhost:5000.

Connect frontend by setting REACT_APP_API_URL=http://localhost:5000/api in frontend .env.

Use Postman or frontend to test APIs.


## Future Enhancements

Add advanced order tracking and status updates.

Implement rate limiting and security enhancements.

Add pagination and filtering for product listings.

Unit and integration tests for API endpoints.

Logging system for monitoring (e.g., Winston, Sentry).
