# 🔥 CRAVE — Production-Ready Full-Stack Food Delivery Platform

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2-purple.svg)](https://vitejs.dev/)

**CRAVE** is a production-grade, responsive full-stack food delivery web application built with modern architecture and appetite-inducing UI/UX design. The platform consists of a **Customer Web Application** (port `5173`), an independent **Admin Operations Dashboard** (port `5174`), and a high-performance **REST API Backend** (port `5000`).

---

## 🏗️ Project Architecture & Tech Stack

```
crave/
├── server/          -> Node.js / Express REST API, Mongoose models, JWT Auth, Multer
├── client/          -> Customer-facing React (Vite) + Tailwind CSS web application (Port 5173)
├── admin/           -> Operations & Analytics Admin Dashboard with Recharts (Port 5174)
└── package.json     -> Root workspace orchestrator with concurrent scripts
```

### 1. Customer Frontend (`client/`) — Runs on `http://localhost:5173`
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS + Custom appetite-inducing theme tokens (warm amber/orange gradients & sleek slate backgrounds)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`, `CartContext`) with optimistic updates
- **Notifications**: `react-hot-toast`
- **Celebrations**: `canvas-confetti`

### 2. Admin Panel (`admin/`) — Runs on `http://localhost:5174`
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Dark Ops Theme)
- **Analytics & Visualizations**: Recharts (Revenue trend area charts & Order status breakdown)
- **Role Guarding**: Protected routes strictly verifying `role === 'admin'` with automatic redirect to Admin Login
- **Operations**: Live Order Status Dispatcher, Food Inventory Manager, Category Manager, Customer Directory

### 3. Backend REST API (`server/`) — Runs on `http://localhost:5000`
- **Engine**: Node.js & Express.js
- **Database & ODM**: MongoDB & Mongoose (with automatic embedded `mongodb-memory-server` fallback for instant zero-config startup!)
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs password hashing
- **File Uploads**: Multer disk storage for local media in `uploads/`
- **Cross-Origin**: CORS enabled for client and admin ports

---

## 🔑 Default Seed Credentials

The database comes pre-seeded with verified test accounts:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| 🛡️ **Super Admin** | `admin@crave.com` | `admin123` | Full access to Admin Panel (`:5174`) and all CRUD operations |
| 👤 **Customer** | `john@example.com` | `user123` | Ordering, cart sync, live order tracking, addresses (`:5173`) |

*Tip: Both the Customer Auth Modal and the Admin Login screen feature **one-click demo auto-fill buttons** for instant evaluation.*

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Install Dependencies
Run the following from the root directory to install all packages for root, server, client, and admin:

```bash
# Install root orchestration tools
npm install

# Install all subproject dependencies in one shot:
npm run install:all
```

*(Alternatively, run `npm install` inside `server/`, `client/`, and `admin/` separately)*

### 2. Seed the Database
Populate 6 categories, 12 realistic gourmet food items, default admin and customer users, and sample orders:

```bash
npm run seed
```

*(Note: If a local MongoDB instance is running, it connects automatically. If not running, CRAVE automatically initializes an embedded in-memory MongoDB instance with zero manual setup required!)*

### 3. Start All Services Concurrently
Run all three services simultaneously with color-coded terminal logs:

```bash
npm run dev
```

The services will start at:
- **Customer Frontend**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📋 Individual Service Scripts

If you prefer running services in separate terminals:

| Terminal | Command | Description |
| :--- | :--- | :--- |
| **Backend** | `npm --prefix server run dev` | Runs Express API on port `5000` |
| **Client** | `npm --prefix client run dev` | Runs Customer app on port `5173` |
| **Admin** | `npm --prefix admin run dev` | Runs Admin portal on port `5174` |

---

## 🗄️ Database Schemas (Mongoose)

### 1. User Schema (`server/models/User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [{ street: String, city: String, state: String, zipCode: String, isDefault: Boolean }],
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. Category Schema (`server/models/Category.js`)
```javascript
{
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}
```

### 3. Food Schema (`server/models/Food.js`)
```javascript
{
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  isVeg: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  prepTime: { type: String, default: '25-35 mins' },
  createdAt: { type: Date, default: Date.now }
}
```

### 4. Order Schema (`server/models/Order.js`)
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    image: String
  }],
  deliveryAddress: { street: String, city: String, state: String, zipCode: String, phone: String },
  paymentMethod: { type: String, enum: ['COD', 'Stripe', 'Razorpay'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 40 },
  totalAmount: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Order Placed' 
  },
  statusTimeline: [{ status: String, timestamp: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
}
```

---

## 📡 REST API Reference

### Authentication & Users
- `POST /api/auth/register` — Register customer/admin
- `POST /api/auth/login` — Authenticate and receive JWT
- `GET /api/auth/me` — Current user profile *(Protected)*
- `PUT /api/auth/profile` — Update address book & phone *(Protected)*

### Food & Categories
- `GET /api/categories` — Fetch active categories
- `POST /api/categories` — Create category with image *(Admin only)*
- `PUT /api/categories/:id` — Update category status *(Admin only)*
- `DELETE /api/categories/:id` — Delete category *(Admin only)*
- `GET /api/food` — Filter foods (`category`, `search`, `isVeg`, `sort`, `available`)
- `GET /api/food/:id` — Single food details
- `POST /api/food` — Create food item with Multer multipart image *(Admin only)*
- `PUT /api/food/:id` — Update dish or toggle in-stock *(Admin only)*
- `DELETE /api/food/:id` — Remove dish from inventory *(Admin only)*

### Cart (Persisted Per User)
- `GET /api/cart` — Fetch populated cart items *(Protected)*
- `POST /api/cart/sync` — Merge guest cart with user cart on login *(Protected)*
- `POST /api/cart/add` — Add dish or increment quantity *(Protected)*
- `PUT /api/cart/update` — Update exact quantity *(Protected)*
- `DELETE /api/cart/item/:foodId` — Remove item *(Protected)*
- `DELETE /api/cart/clear` — Clear entire cart *(Protected)*

### Orders & Tracking
- `POST /api/orders` — Place order, auto-clear cart, record timeline *(Protected)*
- `GET /api/orders/my-orders` — User's itemized order history *(Protected)*
- `GET /api/orders/:id` — Detailed live order tracker by ID *(Protected)*

### Admin Operations
- `GET /api/admin/dashboard-stats` — Aggregated revenue, top sellers, and status counts *(Admin only)*
- `GET /api/admin/orders` — Platform-wide orders with search, filters, pagination *(Admin only)*
- `PUT /api/admin/orders/:id/status` — Instant status updater & timeline push *(Admin only)*
- `GET /api/admin/users` — List registered customers with order counts *(Admin only)*

---

## 💡 Key Highlights & WOW Features

1. **Live Stepper Tracker**:
   - Visual progress bar: `[Order Placed] -> [Confirmed] -> [Preparing] -> [Out for Delivery] -> [Delivered]`.
   - Real-time polling reflects status changes made in the Admin Panel immediately on the customer tracker screen!

2. **Smart Cart Experience**:
   - Interactive `[-] quantity [+]` controller on food cards once added.
   - Sliding Cart Drawer + Dedicated Cart Page.
   - Dynamic **Free Delivery Progress Meter** (free delivery when subtotal reaches ₹500).
   - Promo coupon code system (`CRAVE20` for 20% discount).

3. **Visual Aesthetics & Polish**:
   - Modern appetite-inducing warm amber/orange color palette with dark mode accents.
   - Google Fonts typography (`Plus Jakarta Sans`).
   - Skeleton card loaders during asynchronous data fetching.
   - Celebratory confetti effects upon placing an order (`canvas-confetti`).

4. **Zero-Friction Evaluation**:
   - Pre-configured demo credentials on login screens.
   - Embedded database fallback ensures instant launch without local MongoDB dependency.
