# Secure SQL Insights

You are building the frontend for SecureSQL, a RAG-powered AI data analyst platform that lets users query databases in natural language, with a security/validation layer sitting between the AI and the database. Build a production-quality React application per the spec below. Backend endpoints don't exist yet — build against a typed API client with mock data/MSW so the UI is fully demoable, and make it trivial to swap in real endpoints later.

1. Tech stack (use exactly this)

React 18 + TypeScript (Vite)

Tailwind CSS + shadcn/ui for components

TanStack Query for server state / data fetching

TanStack Router or React Router for routing

Zustand (or React Context) for lightweight client state (active data source, conversation state)

Monaco Editor for the SQL editor/viewer (read-only + editable modes)

Recharts for charts (bar, line, pie/donut, scatter)

react-hook-form + zod for forms and validation

lucide-react for icons

2. Information architecture (routes)

/login, /register
/dashboard
/agent                      → AI SQL Agent (the core screen)
/data-sources                → tabbed: Databases | Uploads | Documents | Datasets
/data-sources/:id            → detail/profile view for one source
/schema-explorer             → browsable schema graph + table/column detail
/history                     → query history (filterable, searchable)
/saved-queries
/admin                       → users, roles, data sources, RAG indexing status, blocked queries
/settings

Use a persistent left sidebar (collapsible) with the nav above, a top bar showing the active data source selector + user menu, and a main content area.

3. Core screen: AI SQL Agent (/agent)

This is the flagship screen — invest the most design effort here. Build it as a vertical, conversational flow, not a single static form:

Data source selector (dropdown, top of panel) — shows connected DBs/datasets with a status dot (connected/syncing/error).

Chat-style input — large textarea with placeholder examples that rotate, a send button, and a history of the conversation (user question bubbles + assistant response cards below).

Each assistant turn renders as a stacked result card with collapsible sections, in this order:

Intent — small pill badges (e.g. Ranking, Revenue, Customer, Last Quarter)

Retrieved context — chips naming the tables/columns/business rules/docs that were pulled from RAG, each expandable to show a snippet

Generated SQL — Monaco editor, read-only by default, with Edit, Run, Explain, Copy actions; syntax highlighted; a risk badge (Low/Medium/High) next to it

Results — data table (sortable, paginated, searchable, column type icons)

Visualization — auto-selected chart type with a toggle to switch chart types

AI insights — 1-3 short bullet callouts (trend/outlier/change), visually distinct (icon + colored left border)

Actions row — Ask Why?, Save Query, Export ▾ (CSV/XLSX/JSON/PDF)

Ask Why? opens a nested drill-down panel (accordion or side drawer) showing a branching investigation: Regional → Product → Customer → Root cause, each step re-running a scoped query.

If a query is blocked or risky, render an inline warning card (not a toast) explaining what was blocked and why, with a "this is a read-only connection" note when relevant.

Handle these states explicitly with real designed states (not just spinners): loading/thinking, retrieving context, generating SQL, self-correcting after an error (show the retry attempt count, e.g. "Attempt 2 of 3"), ambiguous question (render clarifying quick-reply chips), no relevant schema found, empty results.

4. Data Sources screens

Databases tab: card grid of connections (Postgres/MySQL), each showing name, host, status, last schema refresh, and actions (Test, Edit, Disconnect, Refresh Schema). "Add Database" opens a modal/stepper form (connection details → test connection → success).

Uploads tab: drag-and-drop zone for .db / .sqlite / .sql, with an upload progress list showing pipeline stages (Uploading → Validating → Importing → Extracting Schema → Indexing).

Documents tab: drag-and-drop for PDF/DOCX/TXT/MD/JSON, list view with per-doc status (Processing/Indexed/Failed) and chunk count.

Datasets tab: drag-and-drop for CSV/XLSX/JSON/Parquet. On upload, show a profiling summary card: row/column counts, missing-value %, duplicate count, and per-column type breakdown (numeric/categorical/date) as a compact bar.

5. Schema Explorer

Two-pane layout: left = searchable tree of tables (with column counts), right = selected table detail showing columns (name, type, PK/FK icons, description), a relationship diagram (simple node/edge visualization — can use a lightweight SVG or a library like reactflow), and any linked business-rule docs.

6. History, Saved Queries, Admin

History: table with columns Question / SQL preview / Status / Execution time / Timestamp, filterable by data source and status, row click opens the full result card (reuse the Agent result card component).

Saved Queries: card grid, each with name, question, last run, "Run again" button.

Admin: tabbed — Users & Roles (table + role badges), Data Sources overview, RAG Indexing Status (progress bars per source), Query Activity (chart), Blocked/Failed Queries (table with reason column).

7. Design direction

Don't default to a generic AI-dashboard look (dark navy + purple gradients, or the cream/terracotta "AI demo" palette). This product's identity should read as precise, trustworthy, and technical — closer to a database/security tool (think the confidence of a query planner, not a chatbot). Concretely:

Pick a real token system before coding: 4-6 named colors (a neutral base, one accent used sparingly for AI/generated content, a distinct semantic set for risk levels: safe/low/medium/high), a monospace face for SQL/data and a clean grotesk for UI text.

Use the risk-level colors consistently everywhere risk appears (badges, borders, backgrounds) so risk is instantly scannable across the whole app.

Keep chrome quiet; let generated SQL, tables, and charts be the visual focus.

Design real empty/error states with guidance text, not blank space.

Fully responsive; visible keyboard focus states; respect prefers-reduced-motion.

8. API contract (mock this; keep it swappable)

Define a typed client (src/lib/api.ts) with functions like:

ts

listDataSources(): Promise<DataSource[]>
connectDatabase(payload): Promise<DataSource>
uploadFile(file, type: 'database' | 'document' | 'dataset'): Promise<UploadJob>
getUploadStatus(jobId): Promise<UploadJob>
askQuestion(payload: { dataSourceId, question, conversationId? }): Promise<AgentTurn>
runSql(payload: { dataSourceId, sql }): Promise<QueryResult>
explainSql(sql): Promise<string>
askWhy(payload: { turnId }): Promise<DrillDownStep[]>
getHistory(filters): Promise<QueryHistoryItem[]>
saveQuery(payload): Promise<SavedQuery>
exportResult(payload: { turnId, format }): Promise<Blob>

Back these with MSW (Mock Service Worker) handlers returning realistic fixture data (a fake e-commerce schema: customers, orders, products, regions) so every screen is demoable without a backend. Model types in src/types/ matching the shapes above.

9. Deliverable structure

src/
  components/       (shared UI: DataTable, ChartRenderer, RiskBadge, SqlEditor, ResultCard, ...)
  features/
    agent/
    data-sources/
    schema-explorer/
    history/
    saved-queries/
    admin/
    auth/
  lib/              (api client, query keys, utils)
  mocks/            (MSW handlers + fixtures)
  types/
  routes/

Build incrementally: (1) shell + nav + routing, (2) Agent screen with mocked end-to-end flow, (3) Data Sources screens, (4) Schema Explorer, (5) History/Saved/Admin, (6) polish states + responsiveness.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/49173795-d32e-40f0-88ab-e526dd49b783).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
