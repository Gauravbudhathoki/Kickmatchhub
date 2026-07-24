import { Button } from "@/components/ui/Button";
import { ChalkDivider } from "@/components/ui/ChalkDivider";
import { PitchCorner } from "@/components/ui/PitchCorner";

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-pitch bg-grain-dark text-chalk">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 800px 500px at 30% -10%, rgba(239,234,216,0.08), transparent 60%)",
          }}
        />

        <div className="relative mx-auto flex max-w-6xl flex-col px-6 pt-8 pb-24 sm:px-10">
          <nav className="flex items-center justify-between pb-16 sm:pb-24">
            <span className="font-display text-lg font-bold tracking-tight">
              KickMatch Hub
            </span>
            <div className="flex items-center gap-3">
              
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-chalk/80 transition hover:text-chalk"
              >
                Log in
              </a>
              <Button variant="secondary" className="text-sm px-5 py-2">
                Join a team
              </Button>
            </div>
          </nav>

          <div className="grid items-center gap-12 sm:grid-cols-2">
            <div>
              <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Your Sunday
                <br />
                league,
                <br />
                <span className="text-turf-light">organized.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-chalk/70">
                Join a team, request fixtures, and let your captain sort the
                rest. No more group chats full of &ldquo;who&apos;s in Sunday?&rdquo;
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button variant="primary">Join a team</Button>
                <Button variant="secondary">See how it works</Button>
              </div>
            </div>

            <div className="hidden sm:flex sm:justify-end">
              <PitchCorner className="h-72 w-72 opacity-90" />
            </div>
          </div>
        </div>

        <ChalkDivider className="absolute bottom-0 left-0 text-chalk" />
      </section>

      <section className="bg-chalk px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-lg font-display text-3xl font-bold leading-tight text-soil sm:text-4xl">
            Everything a Sunday-league captain used to do in six group chats.
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <FeatureCard
              title="Teams & fixtures"
              body="Players request to join. Captains approve. Match requests go straight to the other team's captain — no more waiting on a reply in the group chat."
            />
            <FeatureCard
              title="Built for captains"
              body="Approve join requests, accept or reject fixtures, and manage your roster from one dashboard — not a pinned message from three seasons ago."
            />
            <FeatureCard
              title="Secure by design"
              body="Two-factor login, encrypted sessions, and full activity logs. Your club's data is handled the way a real club's admin deserves."
            />
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <ChalkDivider flip className="text-moss/40" />
        </div>
      </section>

      <footer className="bg-chalk px-6 pb-10 pt-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-moss sm:flex-row sm:items-center">
          <span>KickMatch Hub — a Sunday-league team management project.</span>
          <div className="flex gap-6">
            <a href="/login" className="hover:text-soil">
              Log in
            </a>
            <a href="/register" className="hover:text-soil">
              Register
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-moss/20 bg-white/40 p-7">
      <h3 className="font-display text-xl font-bold text-soil">{title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-soil/70">{body}</p>
    </div>
  );
}
