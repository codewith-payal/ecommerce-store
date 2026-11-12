# My Store: Full-Stack E-Commerce App

A full-stack e-commerce store with authentication, a cart, Stripe test-mode payments, order history, and an admin dashboard.

## Features

- Product listing with search and category filter
- Shopping cart saved in the browser (quantity limits based on stock)
- Sign up and log in with JWT authentication
- Checkout with Stripe (test mode)
- Order history for each user
- Admin dashboard to add, edit, and delete products
- Passwords hashed with bcrypt, admin-only routes protected on the server
- Prices are read from the database at checkout, so they cannot be changed from the browser

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, Context API
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Payments:** Stripe Checkout (test mode)
- **Auth:** JWT and bcrypt

## Screenshots

_Add screenshots here (home page, cart, checkout, admin dashboard)._

## Run Locally

### 1. Clone the repo

```
git clone https://github.com/codewith-payal/ecommerce-store.git
cd ecommerce-store
```

### 2. Set up the backend

```
cd server
npm install
```

Create a `server/.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_test_secret_key
```

Start the server:

```
npm run dev
```

### 3. Set up the frontend

In a new terminal:

```
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Test Payment

Use the Stripe test card `4242 4242 4242 4242` with any future expiry date and any CVC.

## Admin Access

New accounts are normal customers. To make an account an admin, set `isAdmin` to `true` on that user in the database.

## Live Demo

_Coming soon._