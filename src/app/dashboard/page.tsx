"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Card } from "@/components/ui/Card";
import { ChalkDivider } from "@/components/ui/ChalkDivider";
import { getMe, FullProfile, ApiError } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) {
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-chalk">
        <p className="text-moss">Loading your dashboard…</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-chalk">
      <AppNavbar user={user} />

      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-soil sm:text-4xl">
              {user.profile.displayName || user.username}
            </h1>
            <p className="mt-1 text-moss">
              Logged in as <RoleBadge role={user.role} />
            </p>
          </div>
        </div>

        <ChalkDivider className="my-8 text-moss/30" />

        <div className="grid gap-6 sm:grid-cols-3">
          <DashboardCard
            title="Browse teams"
            body="Find a Sunday-league team to join, or start your own."
            href="/teams"
            cta="View teams"
          />
          <DashboardCard
            title="Fixtures"
            body="See your upcoming and past matches."
            href="/matches"
            cta="View matches"
          />
          {(user.role === "captain" || user.role === "admin") && (
            <DashboardCard
              title="Captain tools"
              body="Approve join requests and match requests for your team."
              href="/teams"
              cta="Manage requests"
            />
          )}
          {user.role === "admin" && (
            <DashboardCard
              title="Admin panel"
              body="Manage users, review activity logs, and check security alerts."
              href="/admin"
              cta="Open admin panel"
            />
          )}
          {!user.mfaEnabled && (
            <DashboardCard
              title="Secure your account"
              body="Two-factor authentication isn't set up yet. It takes about a minute."
              href="/profile"
              cta="Set up MFA"
              highlight
            />
          )}
        </div>
      </div>
    </main>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="rounded-full bg-turf/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-turf-dark">
      {role}
    </span>
  );
}

function DashboardCard({
  title,
  body,
  href,
  cta,
  highlight = false,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-clay/40 bg-clay/5" : ""}>
      <h3 className="font-display text-xl font-bold text-soil">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-soil/70">{body}</p>
      <Link
        href={href}
        className={`mt-5 flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
          highlight
            ? "bg-clay text-chalk hover:bg-clay-light"
            : "border-2 border-moss/30 text-soil hover:bg-soil/5"
        }`}
      >
        {cta}
      </Link>
    </Card>
  );
}
