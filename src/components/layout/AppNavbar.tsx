"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, PublicUser } from "@/lib/api";

export function AppNavbar({ user }: { user: PublicUser }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.push("/login");
    }
  }

  return (
    <header className="border-b border-moss/15 bg-chalk px-6 py-4 sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/dashboard" className="font-display text-lg font-bold tracking-tight text-soil">
          KickMatch Hub
        </Link>

        <nav className="flex items-center gap-6 text-sm font-semibold text-soil/70">
          <Link href="/dashboard" className="hover:text-soil">
            Dashboard
          </Link>
          <Link href="/teams" className="hover:text-soil">
            Teams
          </Link>
          <Link href="/matches" className="hover:text-soil">
            Matches
          </Link>
          {user.role === "admin" && (
            <Link href="/admin" className="hover:text-soil">
              Admin
            </Link>
          )}
          <Link href="/profile" className="hover:text-soil">
            Profile
          </Link>
          <button onClick={handleLogout} className="rounded-full bg-clay/10 px-4 py-1.5 text-clay hover:bg-clay/20">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}