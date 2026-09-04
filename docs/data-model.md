# Data Model

## Core entities

```mermaid
erDiagram
    ORGANIZATION ||--o{ MEMBERSHIP : has
    ORGANIZATION ||--|| STOREFRONT : owns
    ORGANIZATION ||--o{ PRODUCT : owns
    PRODUCT ||--o{ PRODUCT_VARIANT : has
    PRODUCT_VARIANT ||--o{ INVENTORY_ENTRY : records

    ORGANIZATION ||--o{ CUSTOMER : owns
    CUSTOMER ||--o{ ADDRESS : saves
    CUSTOMER ||--o{ ORDER : places

    ORGANIZATION ||--o{ ORDER : owns
    ORDER ||--o{ ORDER_ITEM : contains
    ORDER ||--o{ PAYMENT : has
    ORDER ||--o{ SHIPMENT : has

    PRODUCT_VARIANT ||--o{ ORDER_ITEM : selected_in
    PRODUCT_VARIANT ||--o{ INVENTORY_ENTRY : changes

    ORGANIZATION {
        uuid id
        string name
        string slug
    }

    MEMBERSHIP {
        uuid id
        uuid organization_id
        uuid user_id
        string role
    }

    STOREFRONT {
        uuid id
        uuid organization_id
        string public_slug
        string logo_url
    }

    PRODUCT {
        uuid id
        uuid organization_id
        string title
        string status
    }

    PRODUCT_VARIANT {
        uuid id
        uuid product_id
        string sku
        string size
        string color
        decimal price_tnd
        int stock_on_hand
    }

    CUSTOMER {
        uuid id
        uuid organization_id
        string full_name
        string phone
    }

    ADDRESS {
        uuid id
        uuid customer_id
        string governorate
        string delegation
        string street_address
    }

    ORDER {
        uuid id
        uuid organization_id
        uuid customer_id
        string order_number
        string order_status
        string payment_status
        decimal total_tnd
    }

    ORDER_ITEM {
        uuid id
        uuid order_id
        uuid product_variant_id
        string product_title_snapshot
        string variant_snapshot
        decimal unit_price_tnd
        int quantity
    }

    PAYMENT {
        uuid id
        uuid order_id
        string method
        string provider
        string status
        decimal amount_tnd
    }

    SHIPMENT {
        uuid id
        uuid order_id
        string carrier_name
        string tracking_number
        string status
    }

    INVENTORY_ENTRY {
        uuid id
        uuid product_variant_id
        string reason
        int quantity_change
    }
```

## Multi-tenancy rule

Every merchant-owned record belongs to one Organization. The app must always filter merchant data by `organization_id`.

Example: Merchant A must never see Merchant B's products, orders, customers, payments, or analytics.

## Order snapshot rule

When a customer orders a product, save the product title, selected size/colour, price, and delivery address inside the order. Later product edits must not change historical orders.

## Customer identity rule

Customers do not have Supabase Auth accounts. A customer record is created (or matched by phone number, within one organization) at the moment they place an order — not through any signup flow. Phone number is a useful identifier, not a globally unique one across the platform.

---

## Status systems

Keep these three systems separate. An order can be delivered while its COD money is still not reconciled, so one status is not enough.

### Order status

```mermaid
flowchart LR
    A["Pending confirmation"] --> B["Confirmed"]
    A --> C["Cancelled"]
    B --> D["Processing"]
    D --> E["Shipped"]
    E --> F["Delivered"]
    E --> G["Returned"]
    D --> C
```

### Payment status

```mermaid
flowchart LR
    A["Unpaid"] --> B["Pending payment"]
    B --> C["Paid"]
    B --> D["Failed"]
    D --> B
    C --> E["Refunded"]

    F["COD due"] --> G["COD collected"]
```

### Delivery status

```mermaid
flowchart LR
    A["Unfulfilled"] --> B["Ready to ship"]
    B --> C["In transit"]
    C --> D["Out for delivery"]
    D --> E["Delivered"]
    D --> F["Delivery failed"]
    F --> D
    F --> G["Returned to merchant"]
```

**Status rule:** Order status = merchant fulfillment work. Payment status = whether/how the customer paid. Delivery status = courier/shipment progress. These are stored separately.

**Example — COD order mid-flow:**
```
Order:    Shipped
Payment:  COD due
Delivery: In transit

After successful delivery:
Order:    Delivered
Payment:  COD collected
Delivery: Delivered
```
