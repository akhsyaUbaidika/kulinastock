flowchart TD

A([Start])
--> B[Login]

B --> C{Authentication Valid?}

C -->|No| D[Show Error]
D --> E([End])

C -->|Yes| F[Open Dashboard]

F --> G[Input Historical Stock Data]

G --> H[Select Item]

H --> I[Select Historical Start Date]

I --> J[Select Forecast Horizon 1-7 Days]

J --> K[Generate Forecast]

K --> L[Run SES Forecast]

K --> M[Run Holt Forecast]

K --> N[Run Holt-Winters Forecast]

L --> O[Calculate MAE MAPE RMSE]
M --> O
N --> O

O --> P[Determine Best Method]

P --> Q[Calculate Safety Stock]

Q --> R[Generate Restock Recommendation]

R --> S[Display Forecast Result]

S --> T([End])