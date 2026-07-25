"use client";

import { useState } from "react";
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

  async function submitPassword() {
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

  async function submitMfa() {
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
          <div className="flex flex-col gap-5">
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
              name="current-password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitPassword();
                }
              }}
            />

            {error && (
              <p role="alert" className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </p>
            )}

            <Button
              type="button"
              variant="primary"
              disabled={loading}
              className="mt-2 w-full"
              onClick={submitPassword}
            >
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <Input
              label={useBackupCode ? "Backup code" : "Verification code"}
              type="text"
              autoComplete="one-time-code"
              required
              placeholder={useBackupCode ? "XXXXX-XXXXX" : "123456"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitMfa();
                }
              }}
            />

            {error && (
              <p role="alert" className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </p>
            )}

            <Button type="button" variant="primary" disabled={loading} className="mt-2 w-full" onClick={submitMfa}>
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
          </div>
        )}

        {stage === "password" && (
          <p className="mt-6 text-center text-sm text-soil/70">
            New here?{" "}
            <a href="/register" className="font-bold text-clay underline underline-offset-2 hover:text-clay-light">
              Create an account
            </a>
          </p>
        )}
      </Card>
    </AuthLayout>
  );
}