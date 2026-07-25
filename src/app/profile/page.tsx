"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ChalkDivider } from "@/components/ui/ChalkDivider";
import {
  getMe,
  updateProfile,
  exportMyData,
  setupMfa,
  verifyMfaSetup,
  FullProfile,
  MfaSetupResponse,
  ApiError,
} from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<FullProfile | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError && err.statusCode === 401) router.push("/login");
      });
  }, [router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-chalk">
      <AppNavbar user={user} />

      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-10">
        <h1 className="font-display text-3xl font-bold text-soil sm:text-4xl">Your profile</h1>
        <p className="mt-2 text-moss">{user.email}</p>

        <ProfileEditForm user={user} onUpdated={setUser} />

        <ChalkDivider className="my-10 text-moss/30" />

        <MfaSection user={user} onChanged={setUser} />

        <ChalkDivider flip className="my-10 text-moss/30" />

        <DataExportSection />
      </div>
    </main>
  );
}

function ProfileEditForm({ user, onUpdated }: { user: FullProfile; onUpdated: (u: FullProfile) => void }) {
  const [displayName, setDisplayName] = useState(user.profile.displayName);
  const [bio, setBio] = useState(user.profile.bio);
  const [position, setPosition] = useState(user.profile.position);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateProfile({ displayName, bio, position });
      onUpdated({ ...user, profile: { displayName, bio, position } });
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mt-8">
      <h2 className="font-display text-xl font-bold text-soil">Edit profile</h2>
      <div className="mt-5 flex flex-col gap-5">
        <Input label="Display name" type="text" maxLength={50} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input label="Position" type="text" maxLength={30} value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Midfielder" />
        <Input label="Bio" type="text" maxLength={300} value={bio} onChange={(e) => setBio(e.target.value)} />

        {message && <p className="rounded-lg bg-turf/10 px-4 py-3 text-sm text-turf-dark">{message}</p>}
        {error && <p className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}

        <Button type="button" variant="primary" disabled={saving} className="w-full" onClick={save}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}

function MfaSection({ user, onChanged }: { user: FullProfile; onChanged: (u: FullProfile) => void }) {
  const [setup, setSetup] = useState<MfaSetupResponse | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startSetup() {
    setError(null);
    setLoading(true);
    try {
      const result = await setupMfa();
      setSetup(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmSetup() {
    setError(null);
    setLoading(true);
    try {
      const result = await verifyMfaSetup(code);
      setBackupCodes(result.backupCodes);
      onChanged({ ...user, mfaEnabled: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Incorrect code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (user.mfaEnabled) {
    return (
      <div>
        <h2 className="font-display text-xl font-bold text-soil">Two-factor authentication</h2>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-turf/10 px-4 py-1.5 text-sm font-semibold text-turf-dark">
          ✓ MFA is enabled on your account
        </p>
      </div>
    );
  }

  if (backupCodes) {
    return (
      <div>
        <h2 className="font-display text-xl font-bold text-soil">MFA enabled — save these backup codes</h2>
        <p className="mt-2 text-sm text-moss">
          Each code can be used once if you lose access to your authenticator app. Store them somewhere safe — they
          won&apos;t be shown again.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-soil/5 p-4 font-mono text-sm">
          {backupCodes.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-soil">Two-factor authentication</h2>
      <p className="mt-2 text-sm text-moss">
        Add an extra layer of security — a 6-digit code from an authenticator app, in addition to your password.
      </p>

      {!setup ? (
        <Button type="button" variant="primary" disabled={loading} className="mt-4" onClick={startSetup}>
          {loading ? "Starting…" : "Set up MFA"}
        </Button>
      ) : (
        <Card className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={setup.qrCodeDataUrl} alt="MFA QR code" className="mx-auto h-40 w-40" />
          <p className="mt-3 text-center text-xs text-moss">
            Scan with your authenticator app, or enter this code manually:
          </p>
          <p className="mt-1 text-center font-mono text-sm text-soil">{setup.manualEntrySecret}</p>

          <div className="mt-5 flex flex-col gap-3">
            <Input
              label="Enter the 6-digit code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
            />
            {error && <p className="rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}
            <Button type="button" variant="primary" disabled={loading} onClick={confirmSetup}>
              {loading ? "Verifying…" : "Confirm and enable MFA"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function DataExportSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setError(null);
    setLoading(true);
    try {
      await exportMyData();
    } catch {
      setError("Failed to export data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-soil">Your data</h2>
      <p className="mt-2 text-sm text-moss">
        Download everything KickMatch Hub holds about your account — profile, teams, matches, and activity history.
      </p>
      {error && <p className="mt-3 rounded-lg bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}
      <Button type="button" variant="outline" disabled={loading} className="mt-4" onClick={handleExport}>
        {loading ? "Preparing…" : "Export my data"}
      </Button>
    </div>
  );
}
