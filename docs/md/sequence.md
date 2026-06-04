sequenceDiagram

participant User
participant ForecastUI
participant API
participant Engine
participant Metrics

User->>ForecastUI: Generate Forecast

ForecastUI->>API: Request Forecast

API->>Engine: Get Historical Data

Engine->>Engine: Run SES

Engine->>Engine: Run Holt

Engine->>Engine: Run Holt-Winters

Engine->>Metrics: Calculate MAE MAPE RMSE

Metrics-->>Engine: Accuracy Metrics

Engine->>Engine: Determine Best Method

Engine->>Engine: Calculate Safety Stock

Engine->>Engine: Generate Restock Recommendation

Engine-->>API: Forecast Result

API-->>ForecastUI: Return Result

ForecastUI-->>User: Display Forecast