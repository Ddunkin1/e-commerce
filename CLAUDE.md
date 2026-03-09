# Enterprise DBMS Project — Agent Rules

## Project Context
- **Subject:** Fundamentals of Database Systems (3rd Year IT)
- **Stack:** Laravel (backend/API) + React + Vite (frontend, inside `resources/js`) + MySQL (Navicat)
- **Type:** E-commerce web application — single Laravel project, no separate frontend folder
- **Deadline:** 1 day — speed and accuracy are critical

## Hard Rules (never break these)

### No Hallucination
- Never invent package names, Laravel methods, or React APIs — only use what you know exists
- If unsure about a version-specific API, say so and use the safe/documented alternative
- Never assume a file exists — check before referencing it

### No Wasted Output
- No long explanations unless the user asks "why" or "explain"
- No repeating what was already said
- No filler phrases ("Great question!", "Sure!", "Of course!")
- Code only — skip prose when the user asks for code
- No comments in code unless logic is non-obvious

### No Scope Creep
- Only build what is asked — no bonus features, no extra abstraction
- No refactoring surrounding code unless it breaks the task
- No design patterns or extra layers unless the user requests it

### File Structure (enforce always)
- React lives in `resources/js/` — never create a separate frontend folder
- Controllers in `app/Http/Controllers/`
- Models in `app/Models/`
- API routes in `routes/api.php`
- Migrations in `database/migrations/`

### Database Rules
- Always use migrations — never raw SQL for schema
- Every table must have `id`, `timestamps()`
- Use foreign key constraints in migrations
- Follow naming: `snake_case` for columns, `plural` for table names

### Laravel + React API Rules
- Laravel is API-only (`routes/api.php`) — no Blade templates except the root `app.blade.php`
- React handles all UI via `resources/js/`
- Use Laravel Sanctum for auth (cookie-based SPA auth)
- Always return JSON from controllers: `return response()->json(...)`

## Priority Order When Stuck
1. Make it work first
2. Make it correct second
3. Make it clean third — only if time allows

## E-commerce Scope (fixed, do not add to)
Tables: `users`, `categories`, `products`, `carts`, `cart_items`, `orders`, `order_items`, `payments`

Pages: Home, Products, Product Detail, Cart, Checkout, Orders (user), Login, Register

Admin (if time allows): Products CRUD, Orders list
