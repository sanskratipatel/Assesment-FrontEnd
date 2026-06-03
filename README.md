# Assesment-FrontEnd

## Project structure

```
frontend/
src/

├── api/
│   ├── axios.js
│   ├── dashboard.js
│   ├── products.js
│   ├── customers.js
│   ├── orders.js
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Customers.jsx
│   ├── Orders.jsx
│   └── OrderDetails.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── ProductModal.jsx
│   ├── CustomerModal.jsx
│   ├── OrderModal.jsx
│   ├── Pagination.jsx
│   └── Loader.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

## What is implemented

- Full React + Vite frontend scaffold.
- API integration for Dashboard, Products, Customers, Orders, and Order Details.
- Central Axios base config in `src/api/axios.js`.
- Reusable modal forms for product, customer, and order creation.
- Pagination on products, customers, and orders pages.
- Loader display during API calls.
- Error handling with `react-toastify`.
- Order status badges and update support.

## Axios base configuration

`src/api/axios.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventory-management-jo7m.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

All other API modules import this `api` instance and use the same base URL.

## API modules

- `src/api/dashboard.js`
- `src/api/products.js`
- `src/api/customers.js`
- `src/api/orders.js`

## Dashboard API

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/dashboard
```

Response model:

```json
{
  "success": true,
  "data": {
    "total_products": 2,
    "total_customers": 1,
    "total_orders": 2,
    "pending_orders": 0,
    "completed_orders": 1,
    "cancelled_orders": 1,
    "low_stock_products": 0
  }
}
```

The frontend uses `response.data.data` to extract the stats object.

## Customer suggestion API (order creation)

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/orders/customer-suggestions?search=1234
```

Response model:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "ABHI",
      "last_name": "PATEL",
      "phone": "1234567890"
    }
  ]
}
```

## Customer APIs

### Create customer

Endpoint:

```
POST https://inventory-management-jo7m.onrender.com/customers/create
```

Request payload:

```json
{
  "first_name": "ABHI",
  "last_name": "PATEL",
  "phone": "1234567890",
  "email": "abhi@gmail.com",
  "country_code": "+91"
}
```

Response model:

```json
{
  "success": true,
  "message": "Customer created successfully"
}
```

> The frontend enforces a 10-digit phone number, lowercase email, and default country code `+91`.

### Get customers

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/customers/all?page=1&page_size=10&search=abhi
```

Response model:

```json
{
  "success": true,
  "total_count": 1,
  "total_pages": 1,
  "current_page": 1,
  "page_size": 10,
  "data": [
    {
      "id": 1,
      "first_name": "ABHI",
      "last_name": "PATEL",
      "phone": "1234567890",
      "email": "abhi@gmail.com",
      "country_code": "+91",
      "created_at": "2026-06-02T20:13:30"
    }
  ]
}
```

> The frontend shows customer IDs with `cus-` prefix and supports search by name or phone.

### Customer details

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/customers/{customer_id}
```

Response model:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "ABHI",
    "last_name": "PATEL",
    "phone": "1234567890",
    "email": "abhi@gmail.com",
    "country_code": "+91",
    "created_at": "2026-06-02 20:13:30",
    "total_orders": 0
  }
}
```

The frontend uses this endpoint in a customer details modal.

## Product APIs

### Get UOMs

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/products/uoms
```

Response model:

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "uom_name": "BOX",
      "description": "Boxes",
      "created_at": "2026-06-02T19:49:15"
    }
  ]
}
```

### Create product

Endpoint:

```
POST https://inventory-management-jo7m.onrender.com/products
```

Request payload:

```json
{
  "sku": "P-2",
  "product_name": "HUMIC-raja",
  "uom_name": "KG",
  "price": 150,
  "unit_weight": 1,
  "available_quantity": 100,
  "minimum_quantity": 10
}
```

Response model:

```json
{
  "success": true,
  "message": "Product created successfully"
}
```

> The frontend validates SKU prefix `P-` and converts numeric fields to integers.

### Get all products

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/products/all?page=1&page_size=10&search=19&is_available=true
```

Response model:

```json
{
  "success": true,
  "total_count": 2,
  "total_pages": 1,
  "current_page": 1,
  "page_size": 10,
  "data": [
    {
      "id": 2,
      "product_name": "HUMIC-raja",
      "sku": "P-2",
      "uom_name": "KG",
      "price": "150",
      "unit_weight": "1",
      "available_quantity": 96,
      "minimum_quantity": 10,
      "is_available": true,
      "created_at": "2026-06-02T20:14:40"
    }
  ]
}
```

### Product details

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/products/{product_id}
```

Response model:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_name": "HUMIC",
    "sku": "P-1",
    "uom_name": null,
    "price": "150",
    "unit_weight": "1",
    "available_quantity": 100,
    "minimum_quantity": 10,
    "is_available": true,
    "created_at": "2026-06-02T20:11:37"
  }
}
```

The Products page includes a **Details** button for each item and opens a modal that loads this endpoint.

### Delete product

Endpoint:

```
DELETE https://inventory-management-jo7m.onrender.com/products/{product_id}
```

Response model:

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

> Backend error messages are surfaced in the UI where available.

## Product suggestion API (order creation)

Endpoint:

```
POST https://inventory-management-jo7m.onrender.com/orders/create
```

Request payload:

```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 2
    }
  ]
}
```

Response model:

```json
{
  "success": true,
  "message": "Order created successfully. Order ID: 3"
}
```

## Orders list API

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/orders/all?page=1&page_size=10
```

Response model:

```json
{
  "success": true,
  "total_count": 2,
  "total_pages": 1,
  "current_page": 1,
  "page_size": 10,
  "data": [
    {
      "id": 2,
      "customer_name": "ABHI PATEL",
      "status": "CANCELLED",
      "total_amount": 600,
      "total_weight": 4,
      "total_items": 2,
      "created_at": "2026-06-02T20:38:47"
    },
    {
      "id": 1,
      "customer_name": "ABHI PATEL",
      "status": "COMPLETED",
      "total_amount": 600,
      "total_weight": 4,
      "total_items": 2,
      "created_at": "2026-06-02T20:26:49"
    }
  ]
}
```

The frontend honors `search` and `status` filters when calling this endpoint.

## Order details API

Endpoint:

```
GET https://inventory-management-jo7m.onrender.com/orders/{order_id}
```

Response model:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "PENDING",
    "total_amount": 600,
    "total_weight": 4,
    "created_at": "2026-06-02T20:26:49",
    "customer": {
      "id": 1,
      "first_name": "ABHI",
      "last_name": "PATEL",
      "phone": "1234567890"
    },
    "items": [
      {
        "sku": "P-1",
        "product_name": "HUMIC",
        "quantity": 2,
        "unit_price": 150,
        "subtotal": 300
      },
      {
        "sku": "P-2",
        "product_name": "HUMIC-raja",
        "quantity": 2,
        "unit_price": 150,
        "subtotal": 300
      }
    ]
  }
}
```

## Order status update API

Endpoint:

```
PUT https://inventory-management-jo7m.onrender.com/orders/{order_id}/status
```

Request payload example:

```json
{
  "status": "CANCELLED",
  "remarks": "Customer request"
}
```

## Notes

- The app is wired to your backend at `https://inventory-management-jo7m.onrender.com`.
- `src/api/axios.js` centralizes the base URL and headers.
- The dashboard page now correctly reads the payload from `response.data.data`.
- The order creation flow uses customer and product suggestion APIs for search-based selection.
- If you want, I can also add the `orders/{order_id}/status` UI to the order details page with a dedicated button.

## Run locally

```bash
npm install
npm run dev
```
