flowchart LR

Admin((Admin))
Staff((Staff))

A((Login))
B((Manage Inventory Items))
C((Manage Stock Transactions))
D((Generate Forecast))
E((Compare Forecast Methods))
F((View Accuracy Metrics))
G((Generate Inventory Report))
H((Generate Forecast Evaluation Report))
I((Generate Restock Report))

Admin --> A
Admin --> B
Admin --> C
Admin --> D
Admin --> E
Admin --> F
Admin --> G
Admin --> H
Admin --> I

Staff --> A
Staff --> B
Staff --> C
Staff --> D
Staff --> E
Staff --> F

D -.include.-> E
E -.include.-> F