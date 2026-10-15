# Expense Tracker: Backend

REST API for the Expense Tracker, built with **Node.js, Express 5 and MongoDB (Mongoose)**.

## Requirements
- Node.js 18 or higher (check with `node -v`)
- A MongoDB database: either local MongoDB or a free MongoDB Atlas cluster

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a file named `.env` inside the `backend` folder (copy `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
   CLIENT_URL=http://localhost:5173
   ```
3. Start the server:
   ```bash
   npm run dev      # auto-restarts on changes
   # or
   npm start
   ```
4. You should see `API running on http://localhost:5000`. Test it by opening
   `http://localhost:5000/api/categories` in your browser.

On the first run, some default categories (Salary, Freelance, Food, Transport, Rent, Bills) are created automatically.

## Using MongoDB Atlas (no local install)
1. Create a free cluster (M0) at mongodb.com/atlas.
2. **Database Access**: create a user with a simple password (letters and numbers).
3. **Network Access**: add your IP address, or allow access from anywhere for development.
4. **Connect > Drivers**: copy the connection string and set it in `.env`:
   ```env
   MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/expense_tracker?retryWrites=true&w=majority
   ```
   If your password has special characters (`@`, `#`, `/`), URL-encode them.

## Environment variables
| Name | Description | Default |
|------|-------------|---------|
| `PORT` | Port the API listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | none (required) |
| `CLIENT_URL` | Frontend address allowed by CORS | `http://localhost:5173` |

Restart the server after changing `.env`.

## API

### Categories
| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/categories` | none |
| POST | `/api/categories` | `{ name, type, color }` where type is `income` or `expense` |
| PUT | `/api/categories/:id` | `{ name, color }` |
| DELETE | `/api/categories/:id` | none (blocked if transactions use it) |

### Transactions
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/transactions?month=YYYY-MM&type=&category=` | all filters optional |
| POST | `/api/transactions` | `{ type, amount, category, note, date }` |
| PUT | `/api/transactions/:id` | same body as POST |
| DELETE | `/api/transactions/:id` | none |

### Reports
| Method | Endpoint | Returns |
|--------|----------|---------|
| GET | `/api/reports/monthly?month=YYYY-MM` | `{ income, expense, balance, byCategory[] }` |
| GET | `/api/reports/yearly?year=YYYY` | 12 items of `{ month, income, expense }` |

Errors are returned as `{ "message": "..." }` with status 400, 404, 409 or 500.

## Project structure
```
backend/
├── server.js              app setup, DB connection, error handler, seed data
├── models/
│   ├── Category.js
│   └── Transaction.js
├── routes/
│   ├── categories.js
│   ├── transactions.js
│   └── reports.js
└── utils/
    └── range.js           month string to date range helper
```
Dates are stored and grouped in UTC.

## Troubleshooting
| Problem | Fix |
|---------|-----|
| `[nodemon] app crashed` | Read the error printed just above it. |
| `MongoDB connection failed: ECONNREFUSED` | Local MongoDB is not running. Start it, or use Atlas. |
| `uri parameter must be a string, got undefined` | `.env` is missing or misnamed. It must be exactly `.env` inside `backend/`. |
| `Cannot find module ...` | Run `npm install` in `backend/`. |
| `EADDRINUSE ... 5000` | Port in use. Set `PORT=5001` and update the frontend `VITE_API_URL`. |
| Atlas connection times out | Add your IP in Atlas under Network Access. |
| CORS error in browser | `CLIENT_URL` must match the frontend address exactly. |
