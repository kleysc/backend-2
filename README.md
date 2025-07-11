# Ecommerce Backend

Backend API for an ecommerce application with user authentication and authorization using JWT.

## Features

- User management (CRUD operations)
- Authentication using JWT
- Authorization based on user roles
- MongoDB integration

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the server
```bash
# Development with nodemon
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- **POST /api/sessions/login**
  - Log in a user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Response: JWT token and user data

- **GET /api/sessions/current**
  - Get current logged-in user information
  - Headers: `Authorization: Bearer <token>`
  - Response: User data

### Users

- **POST /api/users**
  - Create a new user
  - Body: 
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "age": 30,
    "password": "password123",
    "role": "user" 
  }
  ```
  - Response: Created user data

- **GET /api/users**
  - Get all users (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Response: Array of users

- **GET /api/users/:id**
  - Get a user by ID (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Response: User data

- **PUT /api/users/:id**
  - Update a user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Body: User data to update
  - Response: Updated user data

- **DELETE /api/users/:id**
  - Delete a user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message

### Products

- **GET /api/products**
  - Get all products (public)
  - Response: List of products

- **GET /api/products/:id**
  - Get product by ID (public)
  - Response: Product data

- **POST /api/products**
  - Create a new product (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body:
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 100,
    "stock": 50,
    "category": "Category"
  }
  ```
  - Response: Created product data

- **PUT /api/products/:id**
  - Update a product (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Body: Fields to update
  - Response: Updated product data

- **DELETE /api/products/:id**
  - Delete a product (admin only)
  - Headers: `Authorization: Bearer <token>`
  - Response: Deleted product data

## Example API Requests (curl)

### Register a new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "age": 30,
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get current user
```bash
curl -X GET http://localhost:3000/api/sessions/current \
  -H "Authorization: Bearer <your_token>"
```

### Get all products
```bash
curl -X GET http://localhost:3000/api/products
```

### Create a new product (as admin)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "A cool product",
    "price": 199,
    "stock": 20,
    "category": "Gadgets"
  }'
```