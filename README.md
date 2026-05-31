# KulinaStock

KulinaStock is a web-based inventory forecasting system designed to help restaurants and food businesses predict future stock consumption using time series forecasting methods.

The system implements:

* Single Exponential Smoothing (SES)
* Holt's Linear Trend Method
* Holt-Winters Seasonal Method

and automatically compares forecasting accuracy using:

* MAE (Mean Absolute Error)
* MAPE (Mean Absolute Percentage Error)
* RMSE (Root Mean Squared Error)

The application is built with Next.js and Supabase, providing inventory management, historical stock tracking, forecasting analysis, and visualization dashboards.

---

## Features

### Inventory Management

* Add inventory items
* Categorize inventory products
* Track current stock

### Historical Data Management

* Record daily stock usage
* Store historical inventory consumption
* Manage forecasting datasets

### Forecasting Engine

* Single Exponential Smoothing (SES)
* Holt Forecasting
* Holt-Winters Forecasting
* Automatic method comparison

### Forecast Evaluation

* MAE calculation
* MAPE calculation
* RMSE calculation
* Best forecasting method selection

### Dashboard & Visualization

* Inventory summary dashboard
* Forecast result visualization
* Forecast comparison charts
* Forecast accuracy metrics

---

## Technology Stack

### Frontend

* Next.js 15
* React
* Tailwind CSS
* Recharts

### Backend

* Next.js API Routes

### Database

* Supabase
* PostgreSQL

---

## Project Structure

```text
src
├── app
│   ├── page.js
│   ├── items
│   ├── history
│   ├── forecast
│   │
│   └── api
│       ├── items
│       ├── history
│       ├── forecast
│       └── forecast-results
│
├── lib
│   └── forecasting
│       ├── ses.js
│       ├── holt.js
│       ├── holtWinters.js
│       └── metrics.js
│
└── components
    └── Navbar.js
```

---

## Database Schema

### items

| Column        | Type      |
| ------------- | --------- |
| id            | int       |
| item_name     | string    |
| category      | string    |
| current_stock | int       |
| created_at    | timestamp |

### stock_history

| Column     | Type      |
| ---------- | --------- |
| id         | int       |
| item_id    | int       |
| stock_used | int       |
| period     | date      |
| created_at | timestamp |

### forecast_results

| Column         | Type      |
| -------------- | --------- |
| id             | int       |
| item_id        | int       |
| method         | string    |
| forecast_value | float     |
| mae            | float     |
| mape           | float     |
| rmse           | float     |
| created_at     | timestamp |

---

## Installation

Clone repository:

```bash
git clone https://github.com/yourusername/kulinastock.git
```

Enter project folder:

```bash
cd kulinastock
```

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
.env.local
```

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run development server:

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

---

## Forecasting Workflow

```text
Inventory Item
        ↓
Historical Stock Data
        ↓
Forecast Engine
 ├── SES
 ├── Holt
 └── Holt-Winters
        ↓
Accuracy Metrics
 ├── MAE
 ├── MAPE
 └── RMSE
        ↓
Best Method Selection
        ↓
Forecast Result
```

---

## Current Progress

### Completed

* Inventory Management
* Historical Stock Management
* Forecasting Engine
* Accuracy Metrics
* Dashboard
* Forecast Visualization
* Supabase Integration
* Dynamic Forecast Generation

### In Progress

* Forecast History Page
* Authentication
* PDF Export Report

---

## Thesis Context

This project is developed as an inventory forecasting system that applies time series forecasting techniques to estimate future stock consumption and compare forecasting methods based on accuracy metrics.

Methods implemented:

1. Single Exponential Smoothing (SES)
2. Holt's Linear Trend Method
3. Holt-Winters Seasonal Method

Evaluation metrics:

1. Mean Absolute Error (MAE)
2. Mean Absolute Percentage Error (MAPE)
3. Root Mean Squared Error (RMSE)

---

## License

This project is developed for educational and research purposes.
