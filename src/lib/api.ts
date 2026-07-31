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

// --- Teams ---

export interface Team {
  id: string;
  name: string;
  description: string;
  captainId: string;
}

export interface TeamDetail extends Team {
  roster: { userId: string; username: string; displayName: string; position: string }[];
}

export interface PendingJoinRequest {
  membershipId: string;
  userId: string;
  username: string;
  displayName: string;
  requestedAt: string;
}

export function listTeams() {
  return request<Team[]>("/api/teams");
}

export function createTeam(input: { name: string; description?: string }) {
  return request<Team>("/api/teams", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getTeam(id: string) {
  return request<TeamDetail>(`/api/teams/${id}`);
}

export function joinTeam(id: string) {
  return request<{ membershipId: string; status: string }>(`/api/teams/${id}/join`, {
    method: "POST",
  });
}

export function listPendingRequests(teamId: string) {
  return request<PendingJoinRequest[]>(`/api/teams/${teamId}/requests`);
}

export function decideJoinRequest(teamId: string, membershipId: string, decision: "approve" | "reject") {
  return request<{ membershipId: string; status: string }>(`/api/teams/${teamId}/requests/${membershipId}`, {
    method: "PATCH",
    body: JSON.stringify({ decision }),
  });
}

// --- Match requests ---

export interface MatchRequestRecord {
  id: string;
  requestingTeamId: string;
  opponentTeamId: string;
  proposedDate: string;
  venue: string;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  createdBy: string;
  decidedBy: string | null;
}

export function createMatchRequest(input: {
  requestingTeamId: string;
  opponentTeamId: string;
  proposedDate: string;
  venue: string;
}) {
  return request<MatchRequestRecord>("/api/matches/request", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listMatchesForTeam(teamId: string) {
  return request<MatchRequestRecord[]>(`/api/matches/team/${teamId}`);
}

export function listIncomingMatchRequests(teamId: string) {
  return request<MatchRequestRecord[]>(`/api/matches/team/${teamId}/incoming`);
}

export function decideMatchRequest(matchId: string, decision: "accept" | "reject") {
  return request<MatchRequestRecord>(`/api/matches/${matchId}/decide`, {
    method: "PATCH",
    body: JSON.stringify({ decision }),
  });
}

export function updateProfile(input: { displayName?: string; bio?: string; position?: string }) {
  return request<{ id: string; username: string; profile: FullProfile["profile"] }>("/api/profile/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function exportMyData(): Promise<void> {
  const res = await fetch(`${API_URL}/api/profile/export`, { credentials: "include" });
  if (!res.ok) throw new ApiError("Failed to export data.", res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kickmatch-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

// --- MFA ---

export interface MfaSetupResponse {
  otpauthUrl: string;
  qrCodeDataUrl: string;
  manualEntrySecret: string;
}

export function setupMfa() {
  return request<MfaSetupResponse>("/api/mfa/setup", { method: "POST" });
}

export function verifyMfaSetup(code: string) {
  return request<{ message: string; backupCodes: string[] }>("/api/mfa/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function disableMfa(password: string) {
  return request<{ message: string }>("/api/mfa/disable", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

// --- Admin ---

export interface AdminUser extends PublicUser {
  disabled: boolean;
  createdAt: string;
}

export function listAdminUsers() {
  return request<AdminUser[]>("/api/admin/users");
}

export function changeUserRole(id: string, role: "player" | "captain" | "admin") {
  return request<AdminUser>(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export function setUserDisabled(id: string, disabled: boolean) {
  return request<AdminUser>(`/api/admin/users/${id}/disabled`, {
    method: "PATCH",
    body: JSON.stringify({ disabled }),
  });
}

export function forceLogoutUser(id: string) {
  return request<{ message: string }>(`/api/admin/users/${id}/force-logout`, {
    method: "POST",
  });
}