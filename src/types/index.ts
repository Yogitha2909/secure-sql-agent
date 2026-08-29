export type DataSourceStatus = "connected" | "syncing" | "error";
export type RiskLevel = "low" | "medium" | "high";
export type UploadKind = "database" | "document" | "dataset";

export interface DataSource {
  id: string;
  name: string;
  type: "Postgres" | "MySQL" | "SQLite" | "CSV" | "Documents";
  host: string;
  status: DataSourceStatus;
  lastRefresh: string;
  tables: number;
  rows: string;
  readOnly: boolean;
}

export interface QueryResult {
  columns: { name: string; type: "text" | "number" | "date" | "currency" }[];
  rows: Record<string, string | number>[];
  rowCount: number;
  executionMs: number;
}

export interface AgentTurn {
  id: string;
  question: string;
  intent: string[];
  context: { label: string; snippet: string }[];
  sql: string;
  risk: RiskLevel;
  result: QueryResult;
  insights: { tone: "safe" | "medium" | "high"; text: string }[];
  blockedReason?: string;
}

export interface UploadJob { id: string; name: string; kind: UploadKind; status: "processing" | "indexed" | "failed"; stage: string; progress: number; chunks?: number; }
export interface QueryHistoryItem { id: string; question: string; sql: string; status: "Success" | "Blocked" | "Failed"; executionMs: number; timestamp: string; source: string; risk: RiskLevel; }
export interface SavedQuery { id: string; name: string; question: string; lastRun: string; source: string; risk: RiskLevel; }
export interface DrillDownStep { label: string; detail: string; status: "complete" | "current" | "pending"; value?: string; }
export interface TableSchema { name: string; description: string; columns: { name: string; type: string; key?: "PK" | "FK"; description: string }[]; }