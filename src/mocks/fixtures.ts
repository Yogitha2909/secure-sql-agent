import type { AgentTurn, DataSource, DrillDownStep, QueryHistoryItem, SavedQuery, TableSchema } from "@/types";

export const dataSources: DataSource[] = [
  { id: "ecommerce", name: "northwind-prod", type: "Postgres", host: "analytics.acme.internal", status: "connected", lastRefresh: "12 min ago", tables: 14, rows: "2.4M", readOnly: true },
  { id: "warehouse", name: "warehouse-replica", type: "MySQL", host: "warehouse.acme.internal", status: "syncing", lastRefresh: "Syncing now", tables: 28, rows: "18.7M", readOnly: true },
  { id: "sandbox", name: "analyst-sandbox", type: "Postgres", host: "sandbox.local", status: "error", lastRefresh: "Yesterday", tables: 6, rows: "84K", readOnly: false },
];

const rows = [
  { region: "EMEA", product: "Aurora Desk Lamp", orders: 1284, revenue: 412908 },
  { region: "APAC", product: "Nimbus Standing Desk", orders: 967, revenue: 388251 },
  { region: "AMER", product: "Terra Ergo Chair", orders: 842, revenue: 296410 },
  { region: "EMEA", product: "Vega Monitor Arm", orders: 1510, revenue: 243772 },
  { region: "APAC", product: "Cobalt USB Hub", orders: 2043, revenue: 181957 },
];

export const agentTurn: AgentTurn = {
  id: "q_8f3a1c", question: "Top 5 products by revenue in Q3 2024, split by region", intent: ["Ranking", "Revenue", "Customer", "Q3 2024"],
  context: [
    { label: "orders", snippet: "Order facts, created_at and region_id join path." },
    { label: "products", snippet: "Product catalog with name, category and unit_price." },
    { label: "regions", snippet: "Canonical regional dimensions: AMER, EMEA, APAC." },
    { label: "rule: revenue = qty × unit_price", snippet: "Business rule from finance/glossary.md." },
  ],
  sql: "SELECT r.region, p.name,\n  SUM(oi.qty * oi.unit_price) AS revenue\nFROM order_items oi\nJOIN orders o ON o.id = oi.order_id\nJOIN products p ON p.id = oi.product_id\nJOIN regions r ON r.id = o.region_id\nWHERE o.created_at BETWEEN '2024-07-01' AND '2024-09-30'\nGROUP BY r.region, p.name\nORDER BY revenue DESC\nLIMIT 5;",
  risk: "medium", result: { columns: [{ name: "region", type: "text" }, { name: "product", type: "text" }, { name: "orders", type: "number" }, { name: "revenue", type: "currency" }], rows, rowCount: 5, executionMs: 412 },
  insights: [
    { tone: "safe", text: "EMEA leads Q3 revenue at $413k, up 14% over Q2." },
    { tone: "medium", text: "Aurora Desk Lamp is an outlier — 3× the median unit margin." },
    { tone: "high", text: "APAC volume is high but low-margin; hardware skews the mix." },
  ],
};

export const history: QueryHistoryItem[] = [
  { id: "q_8f3a1c", question: agentTurn.question, sql: agentTurn.sql, status: "Success", executionMs: 412, timestamp: "Today, 10:42 AM", source: "northwind-prod", risk: "medium" },
  { id: "q_7de220", question: "Show customers with more than 3 orders this month", sql: "SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) > 3;", status: "Success", executionMs: 188, timestamp: "Today, 9:16 AM", source: "northwind-prod", risk: "low" },
  { id: "q_6ac901", question: "Remove duplicate test orders", sql: "DELETE FROM orders WHERE environment = 'test';", status: "Blocked", executionMs: 0, timestamp: "Yesterday, 4:08 PM", source: "northwind-prod", risk: "high" },
  { id: "q_52bd10", question: "What is the average delivery time by region?", sql: "SELECT r.region, AVG(o.delivered_at - o.created_at) FROM orders o JOIN regions r ON r.id = o.region_id GROUP BY r.region;", status: "Success", executionMs: 623, timestamp: "Yesterday, 1:55 PM", source: "warehouse-replica", risk: "low" },
];

export const savedQueries: SavedQuery[] = [
  { id: "s1", name: "Quarterly revenue leaders", question: agentTurn.question, lastRun: "Today, 10:42 AM", source: "northwind-prod", risk: "medium" },
  { id: "s2", name: "Repeat customer pulse", question: "Which customer cohorts are returning most often?", lastRun: "Aug 28, 2026", source: "northwind-prod", risk: "low" },
  { id: "s3", name: "Inventory risk watch", question: "Which products are below the reorder threshold?", lastRun: "Aug 26, 2026", source: "warehouse-replica", risk: "low" },
];

export const schemaTables: TableSchema[] = [
  { name: "orders", description: "One row per customer order and fulfillment lifecycle.", columns: [{ name: "id", type: "uuid", key: "PK", description: "Stable order identifier" }, { name: "customer_id", type: "uuid", key: "FK", description: "Links to customers.id" }, { name: "region_id", type: "uuid", key: "FK", description: "Links to regions.id" }, { name: "created_at", type: "timestamp", description: "Order creation time" }, { name: "status", type: "order_status", description: "Current fulfillment state" }] },
  { name: "customers", description: "B2C customer profile and lifecycle facts.", columns: [{ name: "id", type: "uuid", key: "PK", description: "Stable customer identifier" }, { name: "email", type: "text", description: "Unique contact email" }, { name: "segment", type: "text", description: "Lifecycle segmentation" }, { name: "created_at", type: "timestamp", description: "Account creation time" }] },
  { name: "products", description: "Product catalog and commercial metadata.", columns: [{ name: "id", type: "uuid", key: "PK", description: "Stable product identifier" }, { name: "name", type: "text", description: "Customer-facing product name" }, { name: "category", type: "text", description: "Merchandising category" }, { name: "unit_price", type: "numeric", description: "Current list price" }] },
  { name: "order_items", description: "Line items within each order.", columns: [{ name: "id", type: "uuid", key: "PK", description: "Line item identifier" }, { name: "order_id", type: "uuid", key: "FK", description: "Links to orders.id" }, { name: "product_id", type: "uuid", key: "FK", description: "Links to products.id" }, { name: "qty", type: "integer", description: "Units purchased" }, { name: "unit_price", type: "numeric", description: "Captured sale price" }] },
  { name: "regions", description: "Canonical geographic regions for reporting.", columns: [{ name: "id", type: "uuid", key: "PK", description: "Stable region identifier" }, { name: "region", type: "text", description: "Reporting region code" }, { name: "manager", type: "text", description: "Regional owner" }] },
];

export const drillDown: DrillDownStep[] = [
  { label: "Regional", detail: "EMEA revenue is the only region growing double digits.", status: "complete", value: "+14%" },
  { label: "Product", detail: "Aurora Desk Lamp contributes 42% of EMEA growth.", status: "current", value: "$413k" },
  { label: "Customer", detail: "Repeat customers account for 68% of lamp revenue.", status: "pending" },
  { label: "Root cause", detail: "Bundle promotion launched July 08 in EMEA.", status: "pending" },
];