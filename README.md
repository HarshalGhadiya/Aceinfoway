# eCommerce Analytics and Reporting Platform

## Setup

Backend (server/):

- Copy `.env.example` to `.env` and adjust values.
- Install deps and run:
  - `npm install`
  - `npm run dev` (or `node src/server.js` if configured)

Seed DB:

- From `server/`: `node src/seed.js`

Frontend (client/):

- `npm install`
- `npm run dev`

## Features Implemented

- MongoDB schema for Products, Customers, Orders (items+discounts), Campaigns, Ads
- Seed data: 20 products, 10 customers, 30 orders, 5 campaigns, 60 days ads
- Aggregations: ROAS per campaign, Top products by revenue (optional campaign), Revenue trends (weekly/monthly), Orders per customer
- APIs:
  - `GET /api/dashboard` (alias of `/api/dashboard/dashboard`) – summary metrics
  - `GET /api/dashboard/trends?period=weekly|monthly&campaignId=...`
  - `GET /api/dashboard/top-products?campaignId=...`
  - `GET /api/dashboard/orders-per-customer`
  - `GET /api/dashboard/campaigns`
  - `GET /api/orders` (filters: from, to, campaign, product)
  - `POST /api/orders` (transactional insert)
  - `GET /api/products/:id/details`
- API caching (in-memory), logging, env config
- Frontend: dashboard with cards, charts (theme-aware), sortable Orders table, light/dark theme

## Advanced Feature

- Performance optimization: indexes and API-level caching. Charts fetch aggregated, cached endpoints.

## Notes

- For large datasets (~10k+), consider using Redis for cache and ensuring compound indexes on `orders(placedAt)`, `orders(items.product)`, `orders(discounts.campaign)`.

eCommerce Analytics and Reporting Platform

Stack: Node.js, Express, MongoDB (Mongoose), React, Chart.js/Recharts, Axios, JWT (optional), In-memory caching.

Structure

- server/ (Backend - MVC)
  - src/
    - config/
      - db.js
      - cache.js
      - logger.js
      - env.js
    - models/
      - Product.js
      - Customer.js
      - Order.js
      - Campaign.js
      - Ad.js
      - index.js
    - services/
      - analyticsService.js
      - orderService.js
      - productService.js
      - cacheService.js
    - controllers/
      - dashboardController.js
      - ordersController.js
      - productsController.js
    - routes/
      - dashboardRoutes.js
      - orderRoutes.js
      - productRoutes.js
      - index.js
    - middlewares/
      - errorHandler.js
      - asyncHandler.js
      - cacheMiddleware.js
    - utils/
      - pagination.js
      - constants.js
    - app.js
    - server.js
    - schema.js (export all models for requirement)
    - seed.js (seed sample data)
  - .env.example
  - package.json
- client/ (Frontend - React)
  - src/
    - api/
      - http.js
    - components/
      - layout/
        - Header.jsx
        - Sidebar.jsx
        - Footer.jsx
      - dashboard/
        - DashboardCard.jsx
        - OrdersTable.jsx
        - RevenueChart.jsx
        - TopProductsChart.jsx
        - TopCampaignsChart.jsx
    - pages/
      - Dashboard.jsx
    - App.jsx
    - index.css
    - main.jsx
  - vite.config.js
  - index.html
  - package.json

Setup

1. Backend

- cd server
- cp .env.example .env
- Fill MONGODB_URI and PORT
- npm install
- npm run seed (loads sample data)
- npm run dev

2. Frontend

- cd client
- npm install
- npm run dev

Advanced Feature choices implemented

- Caching for heavy analytics (in-memory with TTL)
- Basic indexes and query optimization hints
- Transaction usage in seeding and order service

Notes

- All code is commented near logic blocks for clarity.
- Aggregations included: ROAS, Top products, Campaign revenue trends.
