"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginStep1, loginStep2, ApiError } from "@/lib/api";

type Stage = "password" | "mfa";

export default function LoginPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginStep1({ email, password });
      if (result.requiresMfa && result.pendingToken) {
        setPendingToken(result.pendingToken);
        setStage("mfa");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMfaSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pendingToken) return;
    setError(null);
    setLoading(true);

    try {
      await loginStep2(useBackupCode ? { pendingToken, backupCode: code } : { pendingToken, code });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={stage === "password" ? "Welcome back" : "Verify it's you"}
      subtitle={
        stage === "password"
          ? "Log in to your KickMatch Hub account."
          : "Enter the 6-digit code from your authenticator app."
      }
    >
      <Card>
        {stage === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p role="alert" className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="flex flex-col gap-5">
            <Input
              label={useBackupCode ? "Backup code" : "Verification code"}
              type="text"
              autoComplete="one-time-code"
              required
              placeholder={useBackupCode ? "XXXXX-XXXXX" : "123456"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {error && (
              <p role="alert" className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
              {loading ? "Verifying…" : "Verify"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setUseBackupCode((v) => !v);
                setCode("");
                setError(null);
              }}
              className="text-sm font-semibold text-turf-dark hover:underline"
            >
              {useBackupCode ? "Use an authenticator code instead" : "Use a backup code instead"}
            </button>
          </form>
        )}

        {stage === "password" && (
          <p className="mt-6 text-center text-sm text-moss">
            New here?{" "}
            <a href="/register" className="font-semibold text-turf-dark hover:underline">
              Create an account
            </a>
          </p>
        )}
      </Card>
    </AuthLayout>
  );
}
