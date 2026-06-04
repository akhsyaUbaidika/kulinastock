erDiagram

USERS {
int id PK
string username
string password
string role
datetime created_at
}

ITEMS {
int id PK
string item_name
string category
string unit
int current_stock
int minimum_stock
datetime created_at
}

STOCK_TRANSACTIONS {
int id PK
int item_id FK
int user_id FK
string transaction_type
int qty
date transaction_date
datetime created_at
}

USERS ||--o{ STOCK_TRANSACTIONS : creates

ITEMS ||--o{ STOCK_TRANSACTIONS : has