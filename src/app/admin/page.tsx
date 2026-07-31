"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/layout/AppNavbar";
import {
  getMe,
  listAdminUsers,
  changeUserRole,
  setUserDisabled,
  forceLogoutUser,
  AdminUser,
  FullProfile,
} from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [me, setMe] = useState<FullProfile | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const user = await getMe();
        if (user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setMe(user);
        const list = await listAdminUsers();
        setUsers(list);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function handleRoleChange(id: string, role: "player" | "captain" | "admin") {
    try {
      const updated = await changeUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role.");
    }
  }

  async function handleToggleDisabled(id: string, disabled: boolean) {
    try {
      const updated = await setUserDisabled(id, !disabled);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  }

  async function handleForceLogout(id: string) {
    try {
      await forceLogoutUser(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to force logout.");
    }
  }

  if (loading || !me) {
    return <div className="p-10 text-soil/60">Loading...</div>;
  }

  return (
    <div>
      <AppNavbar user={me} />
      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <h1 className="font-display text-3xl font-bold text-soil">Admin Dashboard</h1>
        <p className="mt-2 text-soil/70">Manage users, roles, and access.</p>

        {error && <div className="mt-4 rounded-xl bg-clay/10 px-4 py-3 text-clay">{error}</div>}

        <div className="mt-8 overflow-hidden rounded-2xl border border-moss/15 bg-chalk">
          <table className="w-full text-left text-sm">
            <thead className="bg-moss/5 text-soil/60">
              <tr>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-moss/10">
                  <td className="px-6 py-3 font-semibold text-soil">{u.username}</td>
                  <td className="px-6 py-3 text-soil/70">{u.email}</td>
                  <td className="px-6 py-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as "player" | "captain" | "admin")
                      }
                      className="rounded-lg border border-moss/20 bg-chalk px-2 py-1"
                    >
                      <option value="player">player</option>
                      <option value="captain">captain</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-3">
                    {u.disabled ? (
                      <span className="text-clay">Disabled</span>
                    ) : (
                      <span className="text-moss">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleDisabled(u.id, u.disabled)}
                        className="rounded-full bg-soil/10 px-3 py-1 text-xs font-semibold text-soil hover:bg-soil/20"
                      >
                        {u.disabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => handleForceLogout(u.id)}
                        className="rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold text-clay hover:bg-clay/20"
                      >
                        Force logout
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
