# User Flows

## 1. Merchant onboarding

```mermaid
flowchart TD
    A["Merchant visits SaaS website"] --> B["Creates account"]
    B --> C["Creates organization / store"]
    C --> D["Adds store name, logo, and contact details"]
    D --> E["Sets delivery zones and delivery prices"]
    E --> F["Adds first product"]
    F --> G["Adds variants: size, colour, price, stock"]
    G --> H["Publishes product"]
    H --> I["Gets public storefront link"]
    I --> J["Shares link on Instagram / Facebook"]
    J --> K["Can add more products anytime from dashboard"]
```

**Success test:** A new merchant can create a store, publish one product, and get a public storefront link to share on social media.

---

## 2. Customer purchase journey

```mermaid
flowchart TD
    A["Customer sees product on Instagram / Facebook"] --> B["Clicks merchant storefront link"]
    B --> C["Browses product catalogue"]
    C --> D["Opens product page"]
    D --> E["Selects size and colour"]
    E --> F["Adds product to cart"]
    F --> G["Opens cart"]
    G --> H["Checkout"]
    H --> I["Enters name, phone number, and Tunisian delivery address"]
    I --> J{"Chooses payment method"}

    J -->|Cash on Delivery| K["Order submitted"]
    K --> L["Order awaits merchant confirmation"]
    L --> M["Merchant confirms order"]
    M --> N["Order is prepared for delivery"]

    J -->|Online payment| O["Redirect to payment provider"]
    O --> P{"Payment successful?"}
    P -->|Yes| Q["Payment provider sends webhook"]
    Q --> R["Order becomes paid"]
    R --> N
    P -->|No| S["Payment fails or expires"]
    S --> H
```

**Success test:** A customer can buy any published product, select an available variant, choose COD or online payment, and receive confirmation. No login required at any point.

---

## 3. Cash on Delivery (COD)

```mermaid
flowchart TD
    A["Customer submits COD order"] --> B["System validates selected variant stock"]
    B --> C{"Stock available?"}

    C -->|No| D["Customer sees out-of-stock message"]
    C -->|Yes| E["Order created: Pending confirmation"]
    E --> F["Payment status: COD due"]
    F --> G["Merchant reviews order"]
    G --> H["Merchant contacts / verifies customer"]
    H --> I{"Merchant confirms?"}

    I -->|No| J["Order cancelled or customer unreachable"]
    J --> K["Reserved stock released"]

    I -->|Yes| L["Stock reserved"]
    L --> M["Order status: Confirmed"]
    M --> N["Merchant packs order"]
    N --> O["Merchant ships / gives order to courier"]
    O --> P["Delivery status: In transit"]
    P --> Q{"Delivery outcome"}

    Q -->|Delivered| R["Courier collects cash"]
    R --> S["Payment status: COD collected"]
    S --> T["Order status: Delivered"]

    Q -->|Refused or failed| U["Order returned to merchant"]
    U --> V["Record refusal / failure reason"]
    V --> W["Merchant reviews and restores stock if appropriate"]
```

**COD rules:**

- Delivered does not automatically mean the merchant received remittance.
- COD collected means cash was collected from the customer.
- Cancelled COD orders release reserved stock.
- Refused/returned orders need a recorded reason.

---

## 4. Online payment lifecycle

```mermaid
flowchart TD
    A["Customer chooses online payment at checkout"] --> B["System validates product price and stock"]
    B --> C{"Stock available?"}

    C -->|No| D["Show out-of-stock message"]
    C -->|Yes| E["Create order: Pending payment"]
    E --> F["Create payment attempt"]
    F --> G["Redirect customer to payment provider"]

    G --> H{"Customer completes payment?"}

    H -->|No / cancelled| I["Payment status: Failed or cancelled"]
    I --> J["Order remains unpaid"]
    J --> K["Customer can retry payment or choose COD"]

    H -->|Yes| L["Payment provider sends signed webhook to backend"]
    L --> M["System verifies webhook signature and payment amount"]
    M --> N{"Webhook valid and not already processed?"}

    N -->|No| O["Reject or safely ignore duplicate event"]
    N -->|Yes| P["Payment status: Paid"]
    P --> Q["Order status: Confirmed"]
    Q --> R["Reserve or deduct stock"]
    R --> S["Merchant is notified"]
    S --> T["Order is ready for fulfillment"]
```

**Online payment rules:**

- The payment-provider webhook is the source of truth — not the browser redirect.
- Duplicate webhooks must not create duplicate orders or payments (idempotency by provider event ID).
- Validate the paid amount and currency before marking an order paid.
- Card/payment information is handled by the payment provider, never stored by Vendra.
- Merchants connect their own payment-provider account (Flouci/Paymee); Vendra never holds customer money.

---

## 5. Merchant order fulfillment

```mermaid
flowchart TD
    A["Merchant receives new-order notification"] --> B["Opens Orders dashboard"]
    B --> C["Reviews customer, items, payment, and delivery details"]
    C --> D{"Order type"}

    D -->|COD pending| E["Contact / verify customer"]
    E --> F{"Confirm order?"}
    F -->|No| G["Cancel order and release reserved stock"]
    F -->|Yes| H["Confirm order"]

    D -->|Online paid| H

    H --> I["Order status: Processing"]
    I --> J["Merchant picks and packs items"]
    J --> K["Creates shipment / assigns courier manually"]
    K --> L["Adds tracking number if available"]
    L --> M["Order status: Shipped"]
    M --> N["Delivery status: In transit"]

    N --> O{"Delivery outcome"}

    O -->|Delivered| P["Mark shipment delivered"]
    P --> Q{"Payment type"}

    Q -->|Online payment| R["Order status: Delivered"]
    Q -->|COD| S["Record COD collected"]
    S --> R

    O -->|Failed / refused| T["Record failure reason"]
    T --> U["Order status: Returned"]
    U --> V["Review and restore stock if appropriate"]
```

**Success test:** A merchant can review a new order, confirm it, pack it, mark it shipped, record the delivery result, and keep order, payment, and inventory states accurate.
