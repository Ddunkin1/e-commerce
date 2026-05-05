# ShopEase — System Documentation

**Ddunkin1** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; IT33

---

## 1. Introduction

**ShopEase** is a full-featured E-Commerce Web Application built for academic purposes under the course *Fundamentals of Database Systems*. It provides a complete online shopping experience — from product browsing and cart management to order placement, delivery tracking, and admin oversight. The system supports multiple user roles including customers, administrators, and delivery riders.

---

## 2. Tech Stack

### Frontend
- **Framework:** React 18 (with Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast

### Backend
- **Framework:** Laravel 11 (API-only)
- **Auth:** Laravel Sanctum (token-based SPA auth)
- **ORM:** Eloquent
- **Language:** PHP 8.4

### Database
- **System:** MySQL
- **Tool:** Navicat / Railway MySQL

### Deployment
- **Platform:** Railway
- **Server:** FrankenPHP (via Railpack)
- **Repository:** GitHub

---

## 3. User Roles & Permissions

| Role      | Description        | Key Permissions                                                                 |
|-----------|--------------------|---------------------------------------------------------------------------------|
| **Admin** | System Overseer    | Manage products, categories, orders, users, assign riders, view dashboard stats |
| **Rider** | Delivery Personnel | View assigned deliveries, update delivery status                                |
| **Customer** | Shopper         | Browse products, manage cart, place orders, write reviews, track orders         |

---

## 4. System Workflows

### Shopping Flow
1. Customer browses products (filterable by category, sortable by price/name).
2. Customer adds items to cart or uses Buy Now.
3. Customer proceeds to checkout — enters shipping address and payment method.
4. Order is placed (Status: **pending**), payment record created.
5. Admin processes the order (Status: **processing**).
6. Admin assigns a rider for delivery.
7. Rider updates delivery status: `assigned → picked_up → delivered`.
8. Order marked **completed** upon delivery.

### Review Flow
1. Customer must have a **completed** order containing the product.
2. Customer submits a star rating (1–5) and optional comment.
3. Review is displayed on the product detail page with average rating.

### Admin Flow
1. Admin logs in via `/admin` panel (dark-themed, separate from customer UI).
2. Admin manages: Products (CRUD), Categories (inline edit), Orders (status + rider assignment), Users (role management).
3. Dashboard shows: Total revenue, orders, products, users, monthly revenue chart, low stock alerts, recent orders.

---

## 5. Database Schema

### Tables Overview

| Table                    | Description                              |
|--------------------------|------------------------------------------|
| `users`                  | All users (customers, admins, riders)    |
| `categories`             | Product categories                       |
| `products`               | Product listings with stock and pricing  |
| `carts`                  | One cart per user                        |
| `cart_items`             | Items inside a cart                      |
| `orders`                 | Placed orders with status and rider info |
| `order_items`            | Line items for each order                |
| `payments`               | Payment record per order                 |
| `reviews`                | Product reviews (one per user per product)|
| `personal_access_tokens` | Sanctum auth tokens                      |

### Key Models

```
model User {
  id         Int      @id @autoincrement
  name       String
  email      String   @unique
  password   String
  is_admin   Boolean  @default(false)
  is_rider   Boolean  @default(false)
  timestamps
}

model Product {
  id          Int      @id @autoincrement
  category_id Int      FK → categories
  name        String
  description Text?
  price       Decimal
  stock       Int
  image       String?
  slug        String
  timestamps
}

model Order {
  id               Int     @id @autoincrement
  user_id          Int     FK → users
  rider_id         Int?    FK → users
  status           Enum    [pending, processing, completed, cancelled]
  delivery_status  Enum    [unassigned, assigned, picked_up, delivered]
  total_amount     Decimal
  shipping_address Text
  timestamps
}

model Review {
  id         Int  @id @autoincrement
  user_id    Int  FK → users
  product_id Int  FK → products
  rating     Int  (1–5)
  comment    Text?
  timestamps
  unique [user_id, product_id]
}
```

---

## 6. Core Features

- **Product Catalog** — Category filtering, price/name sorting, search, stock badges, sold count
- **Shopping Cart** — Add/remove items, quantity stepper, select items for checkout, subtotal calculation
- **Checkout** — Shipping address, payment method (Cash / GCash / Card)
- **Order Tracking** — 5-step delivery progress tracker per order
- **Order Cancellation** — Cancel pending orders with automatic stock restoration
- **Product Reviews** — Star ratings, eligibility check (must have purchased), average displayed on cards
- **Rider System** — Admin assigns riders; riders update delivery status via their dashboard
- **Admin Dashboard** — Revenue chart, stat cards, low stock alerts, recent orders
- **Admin Products CRUD** — Create, edit, delete products with image URL support
- **Admin Categories** — Inline edit with slug auto-generation
- **Admin User Management** — View all users, grant/revoke admin access
- **Stock Management** — Validated before order placement, decremented on purchase, restored on cancellation
- **Profile Page** — Edit name/email, change password

---

## 7. API Routes Summary

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login |
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Product detail |
| GET | `/api/categories` | List categories |
| GET | `/api/products/{id}/reviews` | Product reviews |

### Authenticated (Customer)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/cart` | View / add to cart |
| PATCH | `/api/cart/{item}` | Update quantity |
| DELETE | `/api/cart/{item}` | Remove item |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | My orders |
| GET | `/api/orders/{id}` | Order detail |
| PATCH | `/api/orders/{id}/cancel` | Cancel order |
| POST | `/api/products/{id}/reviews` | Submit review |
| PATCH | `/api/profile` | Update profile |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/products` | List / create products |
| PUT/DELETE | `/api/admin/products/{id}` | Update / delete product |
| GET | `/api/admin/orders` | All orders (filterable) |
| PATCH | `/api/admin/orders/{id}/status` | Update order status |
| PATCH | `/api/admin/orders/{id}/assign-rider` | Assign rider |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/{id}/toggle-admin` | Grant/revoke admin |
| GET/POST | `/api/admin/riders` | List / create riders |

### Rider
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rider/orders` | Active deliveries |
| PATCH | `/api/rider/orders/{id}/delivery-status` | Update delivery status |

---

## 8. Pages

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Products | `/products` | Public |
| Product Detail | `/products/:id` | Public |
| Cart | `/cart` | Customer |
| Checkout | `/checkout` | Customer |
| Order Success | `/order-success/:id` | Customer |
| My Orders | `/orders` | Customer |
| Order Detail | `/orders/:id` | Customer |
| Profile | `/profile` | Customer |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Admin Dashboard | `/admin` | Admin |
| Admin Products | `/admin/products` | Admin |
| Admin Categories | `/admin/categories` | Admin |
| Admin Orders | `/admin/orders` | Admin |
| Admin Users | `/admin/users` | Admin |
| Admin Riders | `/admin/riders` | Admin |
| Rider Dashboard | `/rider` | Rider |

---

## 9. Deployment

- **GitHub:** https://github.com/Ddunkin1/e-commerce
- **Live URL:** https://e-commerce-dbms.up.railway.app
- **Platform:** Railway (PHP 8.4 + MySQL + FrankenPHP)
