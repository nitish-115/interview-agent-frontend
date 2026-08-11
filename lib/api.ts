import { RolesResponse, StartResponse, TurnResponse, HistoryItem } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function post<T>(path: string, body: object): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(
      "Couldn't reach the interview server. It may be waking up from sleep — wait 30 seconds and try again."
    );
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiRequestError(data?.detail || `Something went wrong (status ${res.status}).`);
  }
  return data as T;
}

export async function getRoles(): Promise<RolesResponse> {
  const res = await fetch(`${API_URL}/api/roles`);
  if (!res.ok) throw new ApiRequestError("Couldn't load roles.");
  return res.json();
}

export async function startInterview(role: string, jobDescription?: string): Promise<StartResponse> {
  return post<StartResponse>("/api/interview/start", {
    role,
    job_description: jobDescription || null,
  });
}

export async function submitAnswer(
  role: string,
  history: HistoryItem[],
  currentAnswer: string,
  jobDescription?: string
): Promise<TurnResponse> {
  return post<TurnResponse>("/api/interview/turn", {
    role,
    job_description: jobDescription || null,
    history,
    current_answer: currentAnswer,
  });
}
