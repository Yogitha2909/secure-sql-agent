import { agentTurn, dataSources, drillDown, history, savedQueries } from "@/mocks/fixtures";
import type { AgentTurn, DataSource, DrillDownStep, QueryHistoryItem, QueryResult, SavedQuery, UploadJob, UploadKind } from "@/types";

const pause = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listDataSources(): Promise<DataSource[]> { await pause(); return dataSources; }
export async function connectDatabase(payload: { name: string; host: string; type: "Postgres" | "MySQL" }): Promise<DataSource> { await pause(550); return { id: `new-${Date.now()}`, name: payload.name, host: payload.host, type: payload.type, status: "connected", lastRefresh: "Just now", tables: 0, rows: "—", readOnly: true }; }
export async function uploadFile(file: File, kind: UploadKind): Promise<UploadJob> { await pause(); return { id: `job-${Date.now()}`, name: file.name, kind, status: "processing", stage: "Validating", progress: 32, chunks: kind === "document" ? 0 : undefined }; }
export async function getUploadStatus(jobId: string): Promise<UploadJob> { await pause(); return { id: jobId, name: "customer-handbook.pdf", kind: "document", status: "indexed", stage: "Indexed", progress: 100, chunks: 184 }; }
export async function askQuestion(payload: { dataSourceId: string; question: string; conversationId?: string }): Promise<AgentTurn> { await pause(900); return { ...agentTurn, id: `q_${Date.now()}`, question: payload.question }; }
export async function runSql(_payload: { dataSourceId: string; sql: string }): Promise<QueryResult> { await pause(450); return agentTurn.result; }
export async function explainSql(_sql: string): Promise<string> { await pause(350); return "The query aggregates line-item revenue by product and region, constrains the time window to Q3 2024, then sorts the highest revenue combinations first."; }
export async function askWhy(_payload: { turnId: string }): Promise<DrillDownStep[]> { await pause(500); return drillDown; }
export async function getHistory(_filters?: { source?: string; status?: string }): Promise<QueryHistoryItem[]> { await pause(); return history; }
export async function saveQuery(payload: { name: string; question: string }): Promise<SavedQuery> { await pause(260); return { id: `s_${Date.now()}`, name: payload.name, question: payload.question, lastRun: "Never", source: "northwind-prod", risk: "low" }; }
export async function exportResult(_payload: { turnId: string; format: "CSV" | "XLSX" | "JSON" | "PDF" }): Promise<Blob> { await pause(220); return new Blob(["region,product,orders,revenue\nEMEA,Aurora Desk Lamp,1284,412908"], { type: "text/csv" }); }