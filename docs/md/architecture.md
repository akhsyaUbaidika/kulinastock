flowchart TB

User[Admin / Staff]

subgraph Frontend
DashboardUI[Dashboard UI]
StockManagement[Stock Management]
ForecastVisualization[Forecast Module]
ReportsModule[Reports Module]
end

subgraph Backend
API[Next.js API Routes]
end

subgraph ForecastEngine
SES[SES Forecast]
HOLT[Holt Forecast]
HW[Holt Winters Forecast]
METRICS[MAE MAPE RMSE]
SAFETY[Safety Stock]
RESTOCK[Restock Recommendation]
end

subgraph Database
DB[(Historical Stock Database)]
end

User --> DashboardUI
User --> StockManagement
User --> ForecastVisualization
User --> ReportsModule

DashboardUI --> API
StockManagement --> API
ForecastVisualization --> API
ReportsModule --> API

API --> DB

API --> SES
API --> HOLT
API --> HW

SES --> METRICS
HOLT --> METRICS
HW --> METRICS

METRICS --> SAFETY

SAFETY --> RESTOCK