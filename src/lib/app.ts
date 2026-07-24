const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(body?.error ?? "Something went wrong.", res.status, body?.details);
  }

  return body as T;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: "player" | "captain" | "admin";
}

export function registerUser(input: RegisterInput) {
  return request<PublicUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface LoginStep1Result {
  requiresMfa: boolean;
  pendingToken?: string;
  user?: PublicUser;
}

export function loginStep1(input: { email: string; password: string }) {
  return request<LoginStep1Result>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function loginStep2(input: { pendingToken: string; code?: string; backupCode?: string }) {
  return request<{ user: PublicUser }>("/api/auth/login/mfa", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout() {
  return request<{ message: string }>("/api/auth/logout", { method: "POST" });
}

export interface FullProfile extends PublicUser {
  mfaEnabled: boolean;
  profile: { displayName: string; bio: string; position: string };
  createdAt: string;
}

export function getMe() {
  return request<FullProfile>("/api/profile/me");
}