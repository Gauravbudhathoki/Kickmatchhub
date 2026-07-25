"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerUser, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);

    try {
      await registerUser({ username, email, password });
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Join KickMatch Hub" subtitle="Create your account, then find your team.">
      <Card>
        <div className="flex flex-col gap-5">
          <Input
            label="Username"
            type="text"
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            name="new-password"
            autoComplete="new-password"
            required
            minLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
          <p className="-mt-2 text-xs text-moss">
            At least 12 characters, with uppercase, lowercase, a number, and a symbol.
          </p>

          {error && (
            <p role="alert" className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">
              {error}
            </p>
          )}

          <Button type="button" variant="primary" disabled={loading} className="mt-2 w-full" onClick={submit}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-soil/70">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-clay underline underline-offset-2 hover:text-clay-light">
            Log in
          </a>
        </p>
      </Card>
    </AuthLayout>
  );
}