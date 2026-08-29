import { http, HttpResponse } from "msw";
import { agentTurn, dataSources, history } from "./fixtures";

export const handlers = [
  http.get("/api/data-sources", () => HttpResponse.json(dataSources)),
  http.get("/api/history", () => HttpResponse.json(history)),
  http.post("/api/agent/ask", async ({ request }) => { const body = await request.json() as { question?: string }; return HttpResponse.json({ ...agentTurn, question: body.question ?? agentTurn.question }); }),
];